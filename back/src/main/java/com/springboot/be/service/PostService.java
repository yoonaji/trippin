package com.springboot.be.service;

import com.springboot.be.dto.request.PostCreateRequest;
import com.springboot.be.dto.response.CommentDto;
import com.springboot.be.dto.response.PhotoDetailDto;
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
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
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

    @Transactional
    public void createPost(PostCreateRequest request, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("사용자를 찾을 수 없습니다."));

        Post post = new Post();
        post.setUser(user);
        post.setTitle(request.getTitle());
        postRepository.save(post);

        for (PostCreateRequest.PhotoData photoData : request.getPhotos()) {
            processPhoto(post, photoData, null);
        }

        createTravelPathFromPost(post, user);
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
    public void updatePost(Long postId, PostCreateRequest request, Long userId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new NotFoundException("게시글을 찾을 수 없습니다."));

        if (!post.getUser().getId().equals(userId)) {
            throw new UnauthorizedException("게시글 수정 권한이 없습니다.");
        }

        post.setTitle(request.getTitle());

        Map<Long, Photo> existingPhotos = post.getPhotos().stream()
                .collect(Collectors.toMap(Photo::getId, p -> p));

        Set<Long> incomingIds = request.getPhotos().stream()
                .map(PostCreateRequest.PhotoData::getPhotoId)
                .filter(Objects::nonNull)
                .collect(Collectors.toSet());

        // 삭제된 사진 처리
        for (Photo existing : existingPhotos.values()) {
            if (!incomingIds.contains(existing.getId())) {
                Marker marker = existing.getMarker();
                photoRepository.delete(existing);
                marker.decreasePhotoCount();
                if (marker.getPhotoCount() == 0) {
                    markerRepository.delete(marker);
                }
            }
        }

        // 기존 & 신규 사진 처리
        for (PostCreateRequest.PhotoData photoData : request.getPhotos()) {
            processPhoto(post, photoData, existingPhotos.get(photoData.getPhotoId()));
        }

        // 여행 경로 다시 생성
        if (post.getTravelPath() != null) {
            travelPathRepository.delete(post.getTravelPath());
            post.setTravelPath(null);
        }
        createTravelPathFromPost(post, post.getUser());
    }

    public void deletePost(Long postId, Long userId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new NotFoundException("게시글을 찾을 수 없습니다."));

        if (!post.getUser().getId().equals(userId)) {
            throw new UnauthorizedException("게시글 삭제 권한이 없습니다.");
        }

        for (Photo photo : post.getPhotos()) {
            Marker marker = photo.getMarker();
            photoRepository.delete(photo);
            marker.decreasePhotoCount();
        }

        postRepository.delete(post);
    }

    // 공통 사진 처리 메서드
    private void processPhoto(Post post, PostCreateRequest.PhotoData photoData, Photo existingPhoto) {
        if (existingPhoto != null) {
            existingPhoto.setImageUrl(photoData.getImageUrl());
            existingPhoto.setContent(photoData.getContent());
            existingPhoto.setTakenAt(parseDateTime(photoData.getTakenAt()));

            // 기존 사진 -> 주소 변경 시
            if (photoData.getAddress() != null && !photoData.getAddress().isBlank()
                    && !photoData.getAddress().equals(existingPhoto.getMarker().getGlobalPlace().getPlaceName())) {
                Marker oldMarker = existingPhoto.getMarker();
                oldMarker.decreasePhotoCount();
                if (oldMarker.getPhotoCount() == 0) {
                    markerRepository.delete(oldMarker);
                }

                Marker marker = getOrCreateMarker(photoData.getAddress());
                marker.increasePhotoCount();

                existingPhoto.setMarker(marker);
            }
        } else {
            if (photoData.getAddress() == null || photoData.getAddress().isBlank()) {
                throw new IllegalArgumentException("주소가 비어있습니다.");
            }

            Marker marker = getOrCreateMarker(photoData.getAddress());
            marker.increasePhotoCount();

            Photo photo = new Photo();
            photo.setPost(post);
            photo.setMarker(marker);
            photo.setImageUrl(photoData.getImageUrl());
            photo.setContent(photoData.getContent());
            photo.setTakenAt(parseDateTime(photoData.getTakenAt()));

            photoRepository.save(photo);
        }
    }

    private Marker getOrCreateMarker(String address) {
        GlobalPlace globalPlace = globalPlaceRepository
                .findByPlaceNameIgnoreCase(address)
                .orElseGet(() -> {
                    PlaceInfo geo = geoCodingService.forwardGeocoding(address);

                    GlobalPlace newPlace = new GlobalPlace();
                    newPlace.setPlaceName(geo.getFormattedAddress());
                    newPlace.setLatitude(geo.getLatitude());
                    newPlace.setLongitude(geo.getLongitude());
                    return globalPlaceRepository.save(newPlace);
                });

        return markerRepository
                .findByGlobalPlace(globalPlace)
                .orElseGet(() -> {
                    Marker newMarker = new Marker();
                    newMarker.setGlobalPlace(globalPlace);
                    return markerRepository.save(newMarker);
                });
    }

    private LocalDateTime parseDateTime(String takenAt) {
        if (takenAt == null || takenAt.isBlank()) return null;
        try {
            return OffsetDateTime.parse(takenAt).toLocalDateTime();
        } catch (Exception e) {
            return LocalDateTime.parse(takenAt, DateTimeFormatter.ISO_DATE_TIME);
        }
    }

    private void createTravelPathFromPost(Post post, User user) {
        List<Photo> photos = post.getPhotos().stream()
                .filter(p -> p.getTakenAt() != null)
                .sorted((a, b) -> a.getTakenAt().compareTo(b.getTakenAt()))
                .toList();

        if (photos.isEmpty()) return;

        TravelPath travelPath = new TravelPath();
        travelPath.setUser(user);
        travelPath.setPost(post);
        travelPath.setPathName("여행 경로 - " + post.getTitle());

        int seq = 1;
        for (Photo photo : photos) {
            Marker marker = photo.getMarker();

            TravelPathPoint point = new TravelPathPoint();
            point.setTravelPath(travelPath);
            point.setMarker(marker);
            point.setLatitude(marker.getGlobalPlace().getLatitude());
            point.setLongitude(marker.getGlobalPlace().getLongitude());
            point.setSequence(seq++);

            travelPath.getPoints().add(point);
        }

        post.setTravelPath(travelPath);
        travelPathRepository.save(travelPath);
    }
}
