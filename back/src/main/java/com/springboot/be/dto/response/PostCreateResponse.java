package com.springboot.be.dto.response;

import java.util.List;

public record PostCreateResponse(
        Long postId,
        List<PhotoCreateDto> photos
) {
    public record PhotoCreateDto(Long photoId, Integer sequence) {
    }
}
