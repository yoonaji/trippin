package com.springboot.be.dto.response;

import com.springboot.be.entity.TravelPath;

import java.time.LocalDate;
import java.util.List;

public record TravelPathWithMarkersDto(
        Long routeId,
        String routeName,
        String postTitle,
        String authorName,
        String authorProfileImage,
        String period,
        List<MarkerSummaryDto> markers
) {
    public static TravelPathWithMarkersDto from(TravelPath path, List<MarkerSummaryDto> markers) {
        var post = path.getPost();
        var user = post != null ? post.getUser() : null;

        LocalDate startDate = null;
        LocalDate endDate = null;
        if (post != null && post.getPhotos() != null && !post.getPhotos().isEmpty()) {
            var sorted = post.getPhotos().stream()
                    .filter(p -> p.getTakenAt() != null)
                    .sorted((a, b) -> a.getTakenAt().compareTo(b.getTakenAt()))
                    .toList();
            if (!sorted.isEmpty()) {
                startDate = sorted.get(0).getTakenAt().toLocalDate();
                endDate = sorted.get(sorted.size() - 1).getTakenAt().toLocalDate();
            }
        }

        String period = (startDate != null && endDate != null)
                ? startDate + " ~ " + endDate
                : null;

        return new TravelPathWithMarkersDto(
                path.getId(),
                path.getPathName(),
                post != null ? post.getTitle() : null,
                user != null ? user.getUsername() : null,
                user != null ? user.getProfileImage() : null,
                period,
                markers
        );
    }
}
