package com.springboot.be.dto.response;

import com.springboot.be.entity.Marker;
import com.springboot.be.entity.Photo;

import java.util.List;

public record MarkerDetailDto(
        Long id,
        String placeName,
        double latitude,
        double longitude,
        List<PhotoSummaryDto> photos) {
    public static MarkerDetailDto from(Marker marker, List<Photo> photos) {
        return new MarkerDetailDto(
                marker.getId(),
                marker.getGlobalPlace().getPlaceName(),
                marker.getGlobalPlace().getLatitude(),
                marker.getGlobalPlace().getLongitude(),
                photos.stream().map(PhotoSummaryDto::from).toList()
        );
    }
}
