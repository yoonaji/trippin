package com.springboot.be.dto.response;

import java.time.LocalDate;

public record MyTravelPathDto(
        Long routeId,
        String routeName,
        String title,
        LocalDate startDate,
        LocalDate endDate,
        java.util.List<MarkerSummaryDto> markers
) {}