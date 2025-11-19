package com.springboot.be.dto.response;

import com.springboot.be.entity.TravelPath;

import java.util.List;

public record TravelPathDto(
        Long pathId,
        String pathName,
        List<Coordinate> coordinates) {
    public record Coordinate(double lat, double lng) {
    }

    public static TravelPathDto from(TravelPath path) {
        return new TravelPathDto(
                path.getId(),
                path.getPathName(),
                path.getPoints().stream().map(p -> new Coordinate(p.getLatitude(), p.getLongitude())).toList()
        );
    }
}