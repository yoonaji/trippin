package com.springboot.be.service;

import com.drew.imaging.ImageMetadataReader;
import com.drew.metadata.Metadata;
import com.drew.metadata.exif.ExifSubIFDDirectory;
import com.drew.metadata.exif.GpsDirectory;
import com.springboot.be.dto.response.CommentDto;
import com.springboot.be.dto.response.PhotoDetailDto;
import com.springboot.be.dto.response.PhotoUploadResponse;
import com.springboot.be.entity.Photo;
import com.springboot.be.entity.PhotoLike;
import com.springboot.be.entity.User;
import com.springboot.be.exception.FileStorageException;
import com.springboot.be.exception.NotFoundException;
import com.springboot.be.repository.CommentRepository;
import com.springboot.be.repository.PhotoLikeRepository;
import com.springboot.be.repository.PhotoRepository;
import com.springboot.be.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileOutputStream;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PhotoService {
    private final PhotoRepository photoRepository;
    private final PhotoLikeRepository photoLikeRepository;
    private final UserRepository userRepository;
    private final CommentRepository commentRepository;
    private final GeoCodingService geoCodingService;

    @Transactional(readOnly = true)
    public PhotoDetailDto getPhotoDetail(Long photoId) {
        Photo photo = photoRepository.findById(photoId)
                .orElseThrow(() -> new NotFoundException("사진을 찾을 수 없습니다."));
        List<CommentDto> comments = commentRepository
                .findByPhoto_IdOrderByCreatedAtAsc(photoId)
                .stream()
                .map(CommentDto::from)
                .toList();
        return PhotoDetailDto.from(photo, comments);
    }

    @Transactional
    public void likePhoto(Long photoId, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("사용자를 찾을 수 없습니다."));
        Photo photo = photoRepository.findById(photoId)
                .orElseThrow(() -> new NotFoundException("사진을 찾을 수 없습니다."));

        if (photoLikeRepository.existsByUserAndPhoto(user, photo)) return;

        photoLikeRepository.save(new PhotoLike(user, photo));
        photo.increaseLike();
    }

    @Transactional
    public void unlikePhoto(Long photoId, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("사용자를 찾을 수 없습니다."));
        Photo photo = photoRepository.findById(photoId)
                .orElseThrow(() -> new NotFoundException("사진을 찾을 수 없습니다."));

        int deleted = photoLikeRepository.deleteByUserAndPhoto(user, photo);
        if (deleted > 0) {
            photo.decreaseLike();
        }
    }

    public List<PhotoUploadResponse> uploadImages(List<MultipartFile> images) {
        List<PhotoUploadResponse> responses = new ArrayList<>();

        for (MultipartFile image : images) {
            try {
                String imageUrl = saveFile(image);

                Metadata metadata = ImageMetadataReader.readMetadata(image.getInputStream());

                Double lat = null, lng = null;
                LocalDateTime takenAt = null;

                GpsDirectory gpsDir = metadata.getFirstDirectoryOfType(GpsDirectory.class);
                if (gpsDir != null && gpsDir.getGeoLocation() != null) {
                    lat = gpsDir.getGeoLocation().getLatitude();
                    lng = gpsDir.getGeoLocation().getLongitude();
                }

                ExifSubIFDDirectory exifDir = metadata.getFirstDirectoryOfType(ExifSubIFDDirectory.class);
                if (exifDir != null && exifDir.getDateOriginal() != null) {
                    takenAt = LocalDateTime.ofInstant(
                            exifDir.getDateOriginal().toInstant(),
                            java.time.ZoneId.systemDefault()
                    );
                }

                String address = (lat != null && lng != null) ? geoCodingService.reverseGeocoding(lat, lng) : "위치 정보 없음";
                ;

                responses.add(new PhotoUploadResponse(imageUrl, address, takenAt));
            } catch (Exception e) {
                responses.add(new PhotoUploadResponse(
                        null,
                        "업로드 실패: " + e.getMessage(),
                        null
                ));
            }
        }

        return responses;
    }

    private String saveFile(MultipartFile file) {
        // TODO: 사진 클라우드 저장
        String fileName = file.getOriginalFilename();
        String ext = (fileName != null && fileName.contains(".")) ? fileName.substring(fileName.lastIndexOf(".")) : "";
        String newFileName = UUID.randomUUID().toString() + ext;

        File dest = new File("uploads/" + newFileName);
        File parent = dest.getParentFile();

        if (!parent.exists() && !parent.mkdirs()) {
            throw new FileStorageException("업로드 디렉토리를 생성할 수 없습니다: " + parent.getAbsolutePath());
        }

        try (FileOutputStream fos = new FileOutputStream(dest)) {
            fos.write(file.getBytes());
        } catch (Exception e) {
            throw new FileStorageException("파일 저장 실패: " + file.getOriginalFilename(), e);
        }
        return "uploads/" + newFileName;
    }
}
