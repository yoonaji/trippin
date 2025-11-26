package com.springboot.be.service;

import com.springboot.be.dto.response.FavoriteMarkerDto;
import com.springboot.be.dto.response.MarkerDetailDto;
import com.springboot.be.dto.response.MarkerSummaryDto;
import com.springboot.be.entity.Marker;
import com.springboot.be.entity.Photo;
import com.springboot.be.entity.PlaceInfo;
import com.springboot.be.exception.NotFoundException;
import com.springboot.be.exception.UnauthorizedException;
import com.springboot.be.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MarkerService {
    private final MarkerRepository markerRepository;
    private final PostRepository postRepository;
    private final GlobalPlaceRepository globalPlaceRepository;
    private final PhotoLikeRepository photoLikeRepository;
    private final PhotoRepository photoRepository;
    private final GeoCodingService geoCodingService;

    public List<MarkerSummaryDto> searchPlace(String keyword) {
        if (keyword == null || keyword.isBlank()) {
            throw new NotFoundException("검색 키워드를 입력하세요.");
        }
        return markerRepository.findByGlobalPlace_PlaceNameContaining(keyword)
                .stream()
                .map(MarkerSummaryDto::from)
                .toList();
    }

    public List<MarkerSummaryDto> searchRegion(String region, Double lat, Double lng, Double radius) {
        // region 이름 기반 검색
        if (region != null && (lat == null || lng == null)) {
            PlaceInfo geo = geoCodingService.forwardGeocoding(region);
            lat = geo.getLatitude();
            lng = geo.getLongitude();
        }

        // 좌표 기반 검색
        if (lat != null && lng != null) {
            return convertToDto(markerRepository.findWithinRadius(lat, lng, radius));
        }

        throw new NotFoundException("검색할 지역 정보를 입력하세요.");
    }

    public List<MarkerSummaryDto> getPopularMarkers() {
        return convertToDto(markerRepository.findTop10ByOrderByPhotoCountDesc());
    }

    public List<FavoriteMarkerDto> getFavoriteMarkers(Long userId) {
        if (userId == null) {
            throw new UnauthorizedException("사용자를 찾을 수 없습니다.");
        }
        List<Marker> markers = photoLikeRepository.findDistinctMarkersByUserId(userId);

        return markers.stream()
                .map(marker -> {
                    List<Photo> photos = photoRepository
                            .findTop3ByMarker_IdOrderByCreatedAtDesc(marker.getId());
                    return FavoriteMarkerDto.from(marker, photos);
                })
                .toList();
    }

    public MarkerDetailDto getMarkerDetail(Long markerId) {
        Marker marker = markerRepository.findById(markerId)
                .orElseThrow(() -> new NotFoundException("해당 마커를 찾을 수 없습니다."));
        List<Photo> photos = photoRepository.findByMarker_IdOrderByCreatedAtDesc(markerId);
        return MarkerDetailDto.from(marker, photos);
    }

    private List<MarkerSummaryDto> convertToDto(List<Marker> markers) {
        return markers.stream()
                .map(MarkerSummaryDto::from)
                .toList();
    }
}
