package com.springboot.be.dto.response;

import com.springboot.be.entity.Photo;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PopularPhotoDto {

    private Long photoId;
    private String title;
    private String content;
    private String imageUrl;
    private Long likeCount;
    private Long commentCount;
    private String createdAt;
    private Marker marker;
    private Author author;

    @Getter @Setter @AllArgsConstructor
    public static class Marker {
        private Long id;
        private String placeName;
        private double latitude;
        private double longitude;
    }

    @Getter @Setter @AllArgsConstructor
    public static class Author {
        private String name;
        private String profileImage;
    }

    public static PopularPhotoDto from(Photo photo) {
        var post = photo.getPost();
        var marker = photo.getMarker();

        return new PopularPhotoDto(
                photo.getId(),
                post != null ? post.getTitle() : null,
                photo.getContent(),
                photo.getImageUrl(),

                photo.getLikeCount() != null
                        ? photo.getLikeCount().longValue()
                        : 0L,

                photo.getComments() != null
                        ? (long) photo.getComments().size()
                        : 0L,

                photo.getCreatedAt() != null ? photo.getCreatedAt().toString() : null,

                marker != null
                        ? new Marker(
                        marker.getId(),
                        marker.getGlobalPlace().getPlaceName(),
                        marker.getGlobalPlace().getLatitude(),
                        marker.getGlobalPlace().getLongitude()
                )
                        : null,

                post != null && post.getUser() != null
                        ? new Author(
                        post.getUser().getUsername(),
                        post.getUser().getProfileImage()
                )
                        : null
        );
    }
}
