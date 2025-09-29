package com.springboot.be.dto.response;

import java.time.LocalDateTime;

public record PhotoUploadResponse(
        String imageUrl,
        String address,
        LocalDateTime takenAt
) {
}
