package com.springboot.be.controller;

import com.springboot.be.dto.common.ApiResponse;
import com.springboot.be.dto.response.MarkerSummaryDto;
import com.springboot.be.dto.response.TravelPathWithMarkersDto;
import com.springboot.be.service.TravelPathService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/map/routes")
@RequiredArgsConstructor
public class TravelPathController {
    private final TravelPathService travelPathService;

    @GetMapping("/recommended")
    public ApiResponse<List<TravelPathWithMarkersDto>> getRecommendedRoutes(
            @RequestParam double lat,
            @RequestParam double lng,
            @RequestParam(defaultValue = "5") double radius
    ) {
        List<TravelPathWithMarkersDto> routes = travelPathService.getRecommendedRoutes(lat, lng, radius);
        return ApiResponse.success("추천 여행 경로 조회 성공", routes);
    }

    @GetMapping("/{routeId}/markers")
    public ApiResponse<List<MarkerSummaryDto>> getMarkersByRoute(@PathVariable Long routeId) {
        List<MarkerSummaryDto> markers = travelPathService.getMarkersByRoute(routeId);
        return ApiResponse.success("특정 여행 경로 마커 조회 성공", markers);
    }
}
