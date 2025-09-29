package com.springboot.be.dto.response;

import com.springboot.be.entity.Photo;

import java.time.LocalDateTime;

public record PhotoSummaryDto(
        Long photoId,
        String content,
        String imageUrl,
        int likeCount,
        int commentCount,
        LocalDateTime createdAt,
        String authorName,
        String authorProfileImage
) {
    public static PhotoSummaryDto from(Photo photo) {

        int commentCount = photo.getComments() == null ? 0 : photo.getComments().size();

        String authorName = null;
        String authorProfileImage = null;
        if (photo.getPost() != null && photo.getPost().getUser() != null) {
            authorName = photo.getPost().getUser().getUsername();
            authorProfileImage = photo.getPost().getUser().getProfileImage();
        }

        return new PhotoSummaryDto(
                photo.getId(),
                photo.getContent(),
                photo.getImageUrl(),
                photo.getLikeCount(),
                commentCount,
                photo.getCreatedAt(),
                authorName,
                authorProfileImage
        );
    }
}
