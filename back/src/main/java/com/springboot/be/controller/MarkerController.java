package com.springboot.be.controller;

import com.springboot.be.dto.common.ApiResponse;
import com.springboot.be.dto.response.FavoriteMarkerDto;
import com.springboot.be.dto.response.MarkerDetailDto;
import com.springboot.be.dto.response.MarkerSummaryDto;
import com.springboot.be.security.services.UserDetailsImpl;
import com.springboot.be.service.MarkerService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/map")
@RequiredArgsConstructor
public class MarkerController {
    private final MarkerService markerService;

    @GetMapping("/search")
    public ApiResponse<List<MarkerSummaryDto>> searchPlace(@RequestParam String keyword) {
        List<MarkerSummaryDto> markers = markerService.searchPlace(keyword);
        return ApiResponse.success("장소 검색 결과", markers);
    }

    @GetMapping(value = "/region", params = "region")
    public ApiResponse<List<MarkerSummaryDto>> searchByRegionName(
            @RequestParam String region,
            @RequestParam(defaultValue = "5000") Double radius) {
        List<MarkerSummaryDto> markers = markerService.searchRegion(region, null, null, radius);
        return ApiResponse.success("지역명 기반 마커 검색 결과", markers);
    }

    @GetMapping(value = "/region", params = {"lat", "lng"})
    public ApiResponse<List<MarkerSummaryDto>> searchRegion(
            @RequestParam Double lat,
            @RequestParam Double lng,
            @RequestParam(defaultValue = "5000") Double radius) {
        List<MarkerSummaryDto> markers = markerService.searchRegion(null, lat, lng, radius);
        return ApiResponse.success("좌표 기반 마커 검색 결과", markers);
    }

    @GetMapping("/markers/popular")
    public ApiResponse<List<MarkerSummaryDto>> getPopularMarkers() {
        return ApiResponse.success("인기 마커 조회 성공", markerService.getPopularMarkers());
    }

    @GetMapping("/markers/favorites")
    public ApiResponse<List<FavoriteMarkerDto>> getFavoriteMarkers(@AuthenticationPrincipal UserDetailsImpl me) {
        return ApiResponse.success("찜한 마커 조회 성공", markerService.getFavoriteMarkers(me.getId()));
    }

    @GetMapping("/markers/{markerId}/posts")
    public ApiResponse<MarkerDetailDto> getMarkerDetail(@PathVariable Long markerId) {
        return ApiResponse.success("마커 게시글 조회 성공", markerService.getMarkerDetail(markerId));
    }
}
