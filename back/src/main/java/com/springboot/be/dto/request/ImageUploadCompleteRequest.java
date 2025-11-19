package com.springboot.be.dto.request;

import lombok.Data;

import java.util.List;

@Data
public class ImageUploadCompleteRequest {
    private List<String> objectkeys;
}
