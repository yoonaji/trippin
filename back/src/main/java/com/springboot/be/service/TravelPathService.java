package com.springboot.be.service;

import com.springboot.be.dto.response.MarkerSummaryDto;
import com.springboot.be.dto.response.MyTravelPathDto;
import com.springboot.be.dto.response.TravelPathWithMarkersDto;
import com.springboot.be.entity.TravelPath;
import com.springboot.be.repository.TravelPathPointRepository;
import com.springboot.be.repository.TravelPathRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TravelPathService {
    private final TravelPathRepository travelPathRepository;
    private final TravelPathPointRepository travelPathPointRepository;

    public List<TravelPathWithMarkersDto> getRecommendedRoutes(double lat, double lng, double radius) {
        return travelPathRepository.findRecommendedByLocation(lat, lng, radius)
                .stream()
                .limit(3)
                .map(path -> {
                    List<MarkerSummaryDto> markers =
                            travelPathPointRepository.findMarkerByTravelPath(path.getId());
                    return TravelPathWithMarkersDto.from(path, markers);
                })
                .toList();
    }

    public List<MarkerSummaryDto> getMarkersByRoute(Long routeId) {
        return travelPathPointRepository.findMarkerByTravelPath(routeId);
    }

    @Transactional(readOnly = true)
    public List<MyTravelPathDto> getMyTravelPaths(Long userId) {
        List<TravelPath> paths = travelPathRepository.findByUser_Id(userId);

        return paths.stream().map(path -> {
            var post = path.getPost();
            var photos = post.getPhotos().stream()
                    .filter(p -> p.getTakenAt() != null)
                    .sorted(Comparator.comparing(p -> p.getTakenAt()))
                    .toList();

            LocalDate startDate = photos.isEmpty() ? null : photos.get(0).getTakenAt().toLocalDate();
            LocalDate endDate = photos.isEmpty() ? null : photos.get(photos.size() - 1).getTakenAt().toLocalDate();

            List<MarkerSummaryDto> markers = travelPathPointRepository.findMarkerByTravelPath(path.getId());

            return new MyTravelPathDto(
                    path.getId(),
                    path.getPathName(),
                    post.getTitle(),
                    startDate,
                    endDate,
                    markers
            );
        }).toList();
    }
}
