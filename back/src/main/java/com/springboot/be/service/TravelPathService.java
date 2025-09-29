package com.springboot.be.service;

import com.springboot.be.dto.response.MarkerSummaryDto;
import com.springboot.be.repository.TravelPathPointRepository;
import com.springboot.be.repository.TravelPathRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TravelPathService {
    private final TravelPathRepository travelPathRepository;
    private final TravelPathPointRepository travelPathPointRepository;

    public List<List<MarkerSummaryDto>> getRecommendedRoutes(double lat, double lng, double radius) {
        return travelPathRepository.findRecommendedByLocation(lat, lng, radius)
                .stream()
                .limit(3)
                .map(path -> travelPathPointRepository.findMarkerByTravelPath(path.getId()))
                .toList();
    }

    public List<MarkerSummaryDto> getMarkersByRoute(Long routeId) {
        return travelPathPointRepository.findMarkerByTravelPath(routeId);
    }
}
