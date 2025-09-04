package com.springboot.be.dto.request;

import lombok.Data;

import java.util.List;

@Data
public class PostCreateRequest {
    private String title;
    private List<PhotoData> photos;

    @Data
    public static class PhotoData {
        private Long photoId;
        private String imageUrl;
        private String content;
        private String address;
        private String takenAt;
    }
}
