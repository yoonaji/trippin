package com.springboot.be.dto.response;

import java.util.List;

public record PostDetailDto(
        Long postId,
        String title,
        String period,
        String authorName,
        String authorProfileImage,
        List<PhotoDetailDto> photos
) {
}