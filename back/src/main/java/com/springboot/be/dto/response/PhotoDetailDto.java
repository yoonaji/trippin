package com.springboot.be.dto.response;

import com.springboot.be.entity.Photo;

import java.time.LocalDateTime;
import java.util.List;

public record PhotoDetailDto(
        Long photoId,
        String content,
        String imageUrl,
        int likeCount,
        int commentCount,
        LocalDateTime createdAt,
        String authorName,
        String authorProfileImage,
        LocalDateTime takenAt,
        Double latitude,
        Double longitude,
        String placeName,
        List<CommentDto> comments
) {
    public static PhotoDetailDto from(Photo photo, List<CommentDto> comments) {

        int commentCount = (comments != null) ? comments.size() : (photo.getComments() == null ? 0 : photo.getComments().size());

        String authorName = null;
        String authorProfileImage = null;
        if (photo.getPost() != null && photo.getPost().getUser() != null) {
            authorName = photo.getPost().getUser().getUsername();
            authorProfileImage = photo.getPost().getUser().getProfileImage();
        }

        String placeName = null;
        if (photo.getMarker() != null && photo.getMarker().getGlobalPlace() != null) {
            placeName = photo.getMarker().getGlobalPlace().getPlaceName();
        }

        return new PhotoDetailDto(
                photo.getId(),
                photo.getContent(),
                photo.getImageUrl(),
                photo.getLikeCount(),
                commentCount,
                photo.getCreatedAt(),
                authorName,
                authorProfileImage,
                photo.getTakenAt(),
                photo.getLatitude(),
                photo.getLongitude(),
                placeName,
                comments
        );
    }
}
