package com.springboot.be.dto.request;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class PostCreateRequest {
    private String title;
    private List<PhotoData> photos;

    @Getter
    @Setter
    public static class PhotoData {
        private Long photoId;
        private String imageUrl;
        private String content;
        private String address;
        private String takenAt;
    }
}
