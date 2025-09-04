package com.springboot.be.dto.response;

import java.util.List;

public record TravelPathWithMarkersDto(
        Long routeId,
        String routeName,
        List<MarkerSummaryDto> markers
) {
}
