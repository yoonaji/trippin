package com.springboot.be.dto.request;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Data
public class PostUpdateRequest {
    private String title;
    private List<PhotoUpdateData> photos;

    @Getter
    @Setter
    public static class PhotoUpdateData {
        private Long photoId;
        private String imageUrl;
        private String content;
        private String address;
        private String takenAt;
    }
}
