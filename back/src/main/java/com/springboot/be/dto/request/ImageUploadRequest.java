package com.springboot.be.dto.request;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class ImageUploadRequest {
    private List<FileMeta> files;

    @Getter
    @Setter
    public static class FileMeta {
        private String filename;
        private String contentType;
    }
}
