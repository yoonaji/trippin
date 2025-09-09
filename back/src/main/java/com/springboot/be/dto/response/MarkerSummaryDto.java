package com.springboot.be.dto.response;

import com.springboot.be.entity.Marker;

public record MarkerSummaryDto(
        Long id,
        String placeName,
        double lat,
        double lng,
        int photoCount,
        Integer orderIndex
) {
    public static MarkerSummaryDto from(Marker marker) {
        return new MarkerSummaryDto(
                marker.getId(),
                marker.getGlobalPlace().getPlaceName(),
                marker.getGlobalPlace().getLatitude(),
                marker.getGlobalPlace().getLongitude(),
                marker.getPhotoCount(),
                null
        );
    }

    // 순서 포함 정보 반환
    public static MarkerSummaryDto fromWithOrder(Marker marker, Integer orderIndex) {
        return new MarkerSummaryDto(
                marker.getId(),
                marker.getGlobalPlace().getPlaceName(),
                marker.getGlobalPlace().getLatitude(),
                marker.getGlobalPlace().getLongitude(),
                marker.getPhotoCount(),
                orderIndex
        );
    }
}
