package com.springboot.be.dto.response;

import com.springboot.be.entity.Photo;

import java.time.LocalDateTime;

public record PhotoSummaryDto(
        Long photoId,
        Long postId,
        String content,
        String imageUrl,
        int likeCount,
        int commentCount,
        LocalDateTime createdAt,
        String authorName,
        String authorProfileImage,
        String placeName,
        Double latitude,
        Double longitude
) {
    public static PhotoSummaryDto from(Photo photo) {

        int commentCount = photo.getComments() == null ? 0 : photo.getComments().size();

        String authorName = null;
        String authorProfileImage = null;
        Long postId = null;
        if (photo.getPost() != null && photo.getPost().getUser() != null) {
            postId = photo.getPost().getId();
            authorName = photo.getPost().getUser().getUsername();
            authorProfileImage = photo.getPost().getUser().getProfileImage();
        }

        String placeName = null;
        Double lat = photo.getLatitude();
        Double lon = photo.getLongitude();

        if (photo.getMarker() != null && photo.getMarker().getGlobalPlace() != null) {
            placeName = photo.getMarker().getGlobalPlace().getPlaceName();
        }

        return new PhotoSummaryDto(
                photo.getId(),
                postId,
                photo.getContent(),
                photo.getImageUrl(),
                photo.getLikeCount(),
                commentCount,
                photo.getCreatedAt(),
                authorName,
                authorProfileImage,
                placeName,
                lat,
                lon
        );
    }
}
