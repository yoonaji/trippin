package com.springboot.be.dto.request;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class PostCreateRequest {
    private String title;
    private List<PhotoCreateData> photos;

    @Getter
    @Setter
    public static class PhotoCreateData {
        private String imageUrl;
        private String content;
        private String address;
        private String takenAt;
    }
}
