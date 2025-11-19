package com.springboot.be.service;

import com.springboot.be.dto.request.PostCreateRequest;
import com.springboot.be.dto.request.PostUpdateRequest;
import com.springboot.be.dto.response.CommentDto;
import com.springboot.be.dto.response.PhotoDetailDto;
import com.springboot.be.dto.response.PostCreateResponse;
import com.springboot.be.dto.response.PostDetailDto;
import com.springboot.be.entity.*;
import com.springboot.be.exception.NotFoundException;
import com.springboot.be.exception.UnauthorizedException;
import com.springboot.be.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PostService {
    private final PostRepository postRepository;
    private final MarkerRepository markerRepository;
    private final PhotoRepository photoRepository;
    private final UserRepository userRepository;
    private final CommentRepository commentRepository;
    private final GlobalPlaceRepository globalPlaceRepository;
    private final GeoCodingService geoCodingService;
    private final TravelPathRepository travelPathRepository;
    private final TravelPathPointRepository travelPathPointRepository;

    @Transactional
    public PostCreateResponse createPost(PostCreateRequest request, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("사용자를 찾을 수 없습니다."));

        Post post = new Post();
        post.setUser(user);
        post.setTitle(request.getTitle());
        postRepository.save(post);

        List<PostCreateRequest.PhotoCreateData> incoming =
                request.getPhotos() == null ? List.of() : request.getPhotos();

        int seq = 1;
        List<PostCreateResponse.PhotoCreateDto> created = new java.util.ArrayList<>();

        for (PostCreateRequest.PhotoCreateData photoData : incoming) {
            Photo photo = createPhoto(post, photoData, seq);
            created.add(new PostCreateResponse.PhotoCreateDto(photo.getId(), photo.getSequence()));
            seq++;
        }

        rebuildTravelPathFromPost(post);

        return new PostCreateResponse(post.getId(), created);
    }

    @Transactional(readOnly = true)
    public PostDetailDto getPostDetails(Long postId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new NotFoundException("게시글을 찾을 수 없습니다."));

        List<PhotoDetailDto> photoDetails = post.getPhotos().stream()
                .map(photo -> {
                    List<CommentDto> comments = commentRepository
                            .findByPhoto_IdOrderByCreatedAtAsc(photo.getId())
                            .stream()
                            .map(CommentDto::from)
                            .toList();
                    return PhotoDetailDto.from(photo, comments);
                })
                .toList();

        String period = calcPeriodFromPhotos(post.getPhotos());

        return new PostDetailDto(
                post.getId(),
                post.getTitle(),
                period,
                post.getUser().getUsername(),
                post.getUser().getProfileImage(),
                photoDetails
        );
    }

    private String calcPeriodFromPhotos(List<Photo> photos) {
        LocalDate minDate = null, maxDate = null;
        for (Photo photo : photos) {
            LocalDateTime ta = photo.getTakenAt();
            if (ta == null) continue;
            LocalDate d = ta.toLocalDate();
            if (minDate == null || d.isBefore(minDate)) minDate = d;
            if (maxDate == null || d.isAfter(maxDate)) maxDate = d;
        }
        if (minDate == null) return null;
        DateTimeFormatter formatter = DateTimeFormatter.ISO_DATE;
        return minDate.format(formatter) + " ~ " + maxDate.format(formatter);
    }

    @Transactional
    public PostCreateResponse updatePost(Long postId, PostUpdateRequest request, Long userId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new NotFoundException("게시글을 찾을 수 없습니다."));

        if (!post.getUser().getId().equals(userId)) {
            throw new UnauthorizedException("게시글 수정 권한이 없습니다.");
        }

        post.setTitle(request.getTitle());

        // 여행 경로 다시 생성
        TravelPath existingTp = Optional.ofNullable(post.getTravelPath())
                .orElseGet(() -> travelPathRepository.findByPost_Id((postId)).orElse(null));

        if (existingTp != null) {
            existingTp.setPost(post);
            post.setTravelPath(existingTp);
            existingTp.getPoints().clear();
            travelPathRepository.save(existingTp);
            travelPathRepository.flush();
        }

        Map<Long, Photo> existingPhotos = post.getPhotos().stream()
                .collect(Collectors.toMap(Photo::getId, p -> p));

        List<PostUpdateRequest.PhotoUpdateData> incoming =
                request.getPhotos() == null ? List.of() : request.getPhotos();

        Set<Long> incomingIds = incoming.stream()
                .map(PostUpdateRequest.PhotoUpdateData::getPhotoId)
                .filter(Objects::nonNull)
                .collect(Collectors.toSet());

        Set<Marker> maybeOrphanMarkers = new HashSet<>();

        for (Photo existing : new ArrayList<>(existingPhotos.values())) {
            if (!incomingIds.contains(existing.getId())) {
                Marker marker = existing.getMarker();
                photoRepository.delete(existing);
                if (marker != null) {
                    maybeOrphanMarkers.add(marker);
                }
            }
        }

        int seq = 1;
        List<PostCreateResponse.PhotoCreateDto> updatedDtos = new ArrayList<>();

        // 기존 & 신규 처리
        for (PostUpdateRequest.PhotoUpdateData photoData : incoming) {
            if (photoData.getPhotoId() == null) {
                Photo created = createPhoto(post, toCreateData(photoData), seq);
                updatedDtos.add(new PostCreateResponse.PhotoCreateDto(created.getId(), created.getSequence()));
            } else {
                Photo existing = existingPhotos.get(photoData.getPhotoId());
                if (existing == null) {
                    throw new NotFoundException("사진을 찾을 수 없습니다. id = " + photoData.getPhotoId());
                }
                Marker before = existing.getMarker();
                updateExistingPhoto(existing, photoData);
                existing.setSequence(seq);

                Marker after = existing.getMarker();
                if (before != null && (after == null || !Objects.equals(before.getId(), after.getId()))) {
                    maybeOrphanMarkers.add(before);
                }

                updatedDtos.add(new PostCreateResponse.PhotoCreateDto(existing.getId(), existing.getSequence()));
            }
            seq++;
        }

        photoRepository.flush();
        markerRepository.flush();

        rebuildTravelPathFromPost(post);

        cleanupOrphanMarkers(maybeOrphanMarkers);

        return new PostCreateResponse(post.getId(), updatedDtos);
    }

    @Transactional
    public void deletePost(Long postId, Long userId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new NotFoundException("게시글을 찾을 수 없습니다."));

        if (!post.getUser().getId().equals(userId)) {
            throw new UnauthorizedException("게시글 삭제 권한이 없습니다.");
        }

        if (post.getTravelPath() != null) {
            travelPathRepository.delete(post.getTravelPath());
            post.setTravelPath(null);
        }

        Set<Marker> maybeOrphanMarkers = new HashSet<>();

        for (Photo photo : new ArrayList<>(post.getPhotos())) {
            Marker marker = photo.getMarker();
            photoRepository.delete(photo);
            if (marker != null) {
                maybeOrphanMarkers.add(marker);
            }
        }

        photoRepository.flush();

        postRepository.delete(post);

        postRepository.flush();
        markerRepository.flush();
        travelPathRepository.flush();

        cleanupOrphanMarkers(maybeOrphanMarkers);
    }

    private Photo createPhoto(Post post, PostCreateRequest.PhotoCreateData photoData, int sequence) {
        if (photoData.getAddress() == null || photoData.getAddress().isBlank()) {
            throw new IllegalArgumentException("주소가 비어있습니다.");
        }

        Marker marker = getOrCreateMarker(photoData.getAddress());

        Photo photo = new Photo();
        photo.setPost(post);
        photo.setMarker(marker);
        photo.setImageUrl(photoData.getImageUrl());
        photo.setContent(photoData.getContent());
        photo.setTakenAt(parseDateTime(photoData.getTakenAt()));
        photo.setSequence(sequence);

        GlobalPlace place = marker.getGlobalPlace();
        photo.setLatitude(place.getLatitude());
        photo.setLongitude(place.getLongitude());

        photoRepository.save(photo);
        post.getPhotos().add(photo);
        return photo;
    }

    private PostCreateRequest.PhotoCreateData toCreateData(PostUpdateRequest.PhotoUpdateData photoData) {
        PostCreateRequest.PhotoCreateData c = new PostCreateRequest.PhotoCreateData();
        c.setImageUrl(photoData.getImageUrl());
        c.setContent(photoData.getContent());
        c.setAddress(photoData.getAddress());
        c.setTakenAt(photoData.getTakenAt());
        return c;
    }

    private void updateExistingPhoto(Photo existingPhoto, PostUpdateRequest.PhotoUpdateData photoData) {
        existingPhoto.setImageUrl(photoData.getImageUrl());
        existingPhoto.setContent(photoData.getContent());
        existingPhoto.setTakenAt(parseDateTime(photoData.getTakenAt()));

        // 주소 변경 시 마커 교체
        if (photoData.getAddress() != null && !photoData.getAddress().isBlank()) {
            Marker target = getOrCreateMarker(photoData.getAddress());
            Marker current = existingPhoto.getMarker();

            if (current == null || !Objects.equals(current.getId(), target.getId())) {
                existingPhoto.setMarker(target);
                GlobalPlace place = target.getGlobalPlace();
                existingPhoto.setLatitude(place.getLatitude());
                existingPhoto.setLongitude(place.getLongitude());
            }
        }
    }

    private Marker getOrCreateMarker(String address) {
        GlobalPlace globalPlace = globalPlaceRepository
                .findByPlaceNameIgnoreCase(address)
                .orElse(null);

        if (globalPlace == null) {
            // 신규: 지오코딩해서 좌표 저장
            PlaceInfo geo = geoCodingService.forwardGeocoding(address);

            GlobalPlace newPlace = new GlobalPlace();
            newPlace.setPlaceName(geo.getFormattedAddress());
            newPlace.setLatitude(geo.getLatitude());
            newPlace.setLongitude(geo.getLongitude());
            globalPlace = globalPlaceRepository.save(newPlace);
        } else {
            // 기존인데 좌표가 없거나 0,0이면 보정
            if (globalPlace.getLatitude() == 0.0 || globalPlace.getLongitude() == 0.0) {
                PlaceInfo geo = geoCodingService.forwardGeocoding(address);
                globalPlace.setPlaceName(geo.getFormattedAddress());
                globalPlace.setLatitude(geo.getLatitude());
                globalPlace.setLongitude(geo.getLongitude());
                globalPlace = globalPlaceRepository.save(globalPlace);
            }
        }

        Optional<Marker> found = markerRepository.findByGlobalPlace(globalPlace);
        if (found.isPresent()) return found.get();
        Marker m = new Marker();
        m.setGlobalPlace(globalPlace);
        return markerRepository.save(m);
    }

    private LocalDateTime parseDateTime(String takenAt) {
        if (takenAt == null || takenAt.isBlank()) return null;
        try {
            return OffsetDateTime.parse(takenAt).toLocalDateTime();
        } catch (Exception e) {
            return LocalDateTime.parse(takenAt, DateTimeFormatter.ISO_DATE_TIME);
        }
    }

    private void rebuildTravelPathFromPost(Post rawPost) {
        Post post = postRepository.findByIdForUpdate(rawPost.getId())
                .orElseThrow(() -> new NotFoundException("게시글을 찾을 수 없습니다."));

        List<Photo> photos = post.getPhotos().stream()
                .filter(p -> p.getTakenAt() != null)
                .sorted(Comparator.comparing(Photo::getTakenAt).thenComparing(Photo::getId))
                .toList();

        TravelPath tp = travelPathRepository.findByPost_Id(post.getId()).orElse(null);

        // 포인트가 하나도 없으면 비우고 종료
        if (photos.isEmpty()) {
            if (tp != null) {
                tp.setPathName("여행 경로 - " + post.getTitle());
                tp.getPoints().clear();
                travelPathRepository.save(tp);
                travelPathRepository.flush();
            }
            return;
        }

        if (tp == null) {
            tp = new TravelPath();
            tp.setUser(post.getUser());
            tp.setPost(post);
            post.setTravelPath(tp);
            tp.setPathName("여행 경로 - " + post.getTitle());
            travelPathRepository.saveAndFlush(tp);
        } else {
            tp.setPost(post);
            post.setTravelPath(tp);
            tp.setPathName("여행 경로 - " + post.getTitle());
            tp.getPoints().clear();
            travelPathRepository.save(tp);
            travelPathRepository.flush();
        }

        int seq = 1;
        Long lastMarkerId = null;
        for (Photo photo : photos) {
            Marker marker = photo.getMarker();

            if (marker == null) continue;

            if (Objects.equals(lastMarkerId, marker.getId())) continue;
            lastMarkerId = marker.getId();

            TravelPathPoint point = new TravelPathPoint();
            point.setTravelPath(tp);
            point.setMarker(marker);
            point.setLatitude(marker.getGlobalPlace().getLatitude());
            point.setLongitude(marker.getGlobalPlace().getLongitude());
            point.setSequence(seq++);
            tp.getPoints().add(point);
        }

        travelPathRepository.save(tp);
        travelPathRepository.flush();
    }

    private void cleanupOrphanMarkers(Collection<Marker> candidates) {
        if (candidates == null || candidates.isEmpty()) return;

        Set<Long> checked = new HashSet<>();
        for (Marker m : candidates) {
            if (m == null) continue;
            Long id = m.getId();
            if (id == null || !checked.add(id)) continue;

            boolean usedByPhoto = photoRepository.existsByMarker_Id(id);
            boolean usedByPathPoint = travelPathPointRepository.existsByMarker_Id(id);

            if (!usedByPhoto && !usedByPathPoint) {
                markerRepository.delete(m);
            }
        }
        markerRepository.flush();
    }
}
