package com.springboot.be.service;

import com.drew.imaging.ImageMetadataReader;
import com.drew.metadata.Metadata;
import com.drew.metadata.exif.ExifSubIFDDirectory;
import com.drew.metadata.exif.GpsDirectory;
import com.google.cloud.storage.Storage;
import com.springboot.be.dto.request.ImageUploadRequest;
import com.springboot.be.dto.response.CommentDto;
import com.springboot.be.dto.response.PhotoDetailDto;
import com.springboot.be.dto.response.PhotoUploadResponse;
import com.springboot.be.entity.Photo;
import com.springboot.be.entity.PhotoLike;
import com.springboot.be.entity.User;
import com.springboot.be.exception.NotFoundException;
import com.springboot.be.repository.CommentRepository;
import com.springboot.be.repository.PhotoLikeRepository;
import com.springboot.be.repository.PhotoRepository;
import com.springboot.be.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
//import software.amazon.awssdk.core.ResponseBytes;
//import software.amazon.awssdk.services.s3.S3Client;
//import software.amazon.awssdk.services.s3.model.GetObjectRequest;
//import software.amazon.awssdk.services.s3.model.GetObjectResponse;
//import software.amazon.awssdk.services.s3.model.PutObjectRequest;
//import software.amazon.awssdk.services.s3.presigner.S3Presigner;
//import software.amazon.awssdk.services.s3.presigner.model.PresignedPutObjectRequest;
//import software.amazon.awssdk.services.s3.presigner.model.PutObjectPresignRequest;

import com.google.cloud.storage.BlobId;
import com.google.cloud.storage.BlobInfo;
import com.google.cloud.storage.HttpMethod;
import com.google.cloud.storage.Storage;
import com.google.cloud.storage.Storage.SignUrlOption;

import java.io.ByteArrayInputStream;
import java.net.URL;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class PhotoService {
    private final PhotoRepository photoRepository;
    private final PhotoLikeRepository photoLikeRepository;
    private final UserRepository userRepository;
    private final CommentRepository commentRepository;
    private final GeoCodingService geoCodingService;
//    private final S3Client s3Client;
//    private final S3Presigner s3Presigner;

//    @Value("${app.s3.bucket}")
//    String bucket;
//    @Value("${app.s3.region}")
//    String region;

    @Value("${app.gcs.bucket}")
    String bucket;
    @Value("${app.cdn.domain}")
    String cdn;

    private final Storage storage;

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

//    public List<Map<String, Object>> presign(List<ImageUploadRequest.FileMeta> files) {
//        List<Map<String, Object>> out = new ArrayList<>();
//
//        for (ImageUploadRequest.FileMeta file : files) {
//            String key = buildSafeKey(file.getFilename());
//            PutObjectRequest por = PutObjectRequest.builder()
//                    .bucket(bucket).key(key).contentType(file.getContentType()).build();
//
//            PresignedPutObjectRequest pre = s3Presigner.presignPutObject(
//                    PutObjectPresignRequest.builder()
//                            .signatureDuration(Duration.ofMinutes(10))
//                            .putObjectRequest(por).build());
//
//            out.add(Map.of(
//                    "objectKey", key,
//                    "uploadUrl", pre.url().toString(),
//                    "headers", pre.signedHeaders(),
//                    "publicUrl", "https://" + cdn + "/" + key
//            ));
//        }
//        return out;
//    }

    // [로직 변경] S3 Presigned URL -> GCS Signed URL
    public List<Map<String, Object>> presign(List<ImageUploadRequest.FileMeta> files) {
        List<Map<String, Object>> out = new ArrayList<>();

        for (ImageUploadRequest.FileMeta file : files) {
            String key = buildSafeKey(file.getFilename());

            // GCS: 업로드할 파일(Blob)의 메타데이터 정의
            BlobId blobId = BlobId.of(bucket, key);
            BlobInfo blobInfo = BlobInfo.newBuilder(blobId)
                    .setContentType(file.getContentType())
                    .build();

            try {
                // GCS: 10분간 유효한 V4 서명된 URL (PUT용) 생성
                URL uploadUrl = storage.signUrl(
                        blobInfo,
                        10, // S3의 Duration.ofMinutes(10)와 동일
                        TimeUnit.MINUTES,
                        SignUrlOption.httpMethod(HttpMethod.PUT),
                        SignUrlOption.withV4Signature(), // V4 서명 사용 (권장)
                        SignUrlOption.withContentType() // Content-Type을 서명에 포함
                );

                out.add(Map.of(
                        "objectKey", key,
                        "uploadUrl", uploadUrl.toString(),
                        // GCS V4 Signed URL은 S3와 달리 별도 헤더 맵을 반환하지 않습니다.
                        // Content-Type 등은 서명 자체에 포함되며, 클라이언트는 PUT 요청 시
                        // 반드시 'Content-Type' 헤더를 전송해야 합니다. (S3도 동일)
                        // 기존 API 출력 구조를 맞추기 위해 빈 맵을 반환합니다.
                        "headers", Collections.emptyMap(),
                        "publicUrl", "https://" + cdn + "/" + key
                ));
            } catch (Exception e) {
                // 로깅 추가 권장 (e.g., log.error("Failed to sign URL", e))
            }
        }
        return out;
    }


    public List<PhotoUploadResponse> finalizeFromS3(List<String> objecKeys) {
        List<PhotoUploadResponse> responses = new ArrayList<>();
        for (String key : objecKeys) {
            try {
//                ResponseBytes<GetObjectResponse> obj = s3Client.getObjectAsBytes(
//                        GetObjectRequest.builder().bucket(bucket).key(key).build());
//                byte[] bytes = obj.asByteArray();

                byte[] bytes = storage.readAllBytes(BlobId.of(bucket, key));

                Metadata metadata = ImageMetadataReader.readMetadata(new ByteArrayInputStream(bytes));

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

                String publicUrl = "https://" + cdn + "/" + key;
                responses.add(new PhotoUploadResponse(publicUrl, address, takenAt));
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

    private String buildSafeKey(String original) {
        String src = (original == null || original.isBlank() ? "file" : original);
        int dot = src.lastIndexOf(".");
        String name = (dot > 0 ? src.substring(0, dot) : src);
        String ext = (dot > 0 ? src.substring(dot) : "");

        name = name.replaceAll("[^a-zA-Z0-9._-]", "_");
        return "images/" + UUID.randomUUID().toString() + "-" + name + ext;
    }
}
