package com.springboot.be.dto.response;

import com.springboot.be.entity.Marker;
import com.springboot.be.entity.Photo;

import java.util.List;

public record MarkerDetailDto(
        Long id,
        String placeName,
        double latitude,
        double longitude,
        List<PhotoDto> photos
) {
    public static MarkerDetailDto from(Marker marker, List<Photo> photos) {
        return new MarkerDetailDto(
                marker.getId(),
                marker.getGlobalPlace().getPlaceName(),
                marker.getGlobalPlace().getLatitude(),
                marker.getGlobalPlace().getLongitude(),
                photos.stream().map(PhotoDto::from).toList()
        );
    }

    public record PhotoDto(
            Long photoId,
            Long postId,
            String title,
            String content,
            String imageUrl,
            int likeCount,
            int commentCount,
            String createdAt
    ) {
        public static PhotoDto from(Photo photo) {
            var post = photo.getPost();
            return new PhotoDto(
                    photo.getId(),
                    post != null ? post.getId() : null,
                    post != null ? post.getTitle() : null,
                    photo.getContent(),
                    photo.getImageUrl(),
                    photo.getLikeCount(),
                    photo.getComments() != null ? photo.getComments().size() : 0,
                    photo.getCreatedAt() != null ? photo.getCreatedAt().toString() : null
            );
        }
    }
}
