package com.springboot.be.dto.response;

import com.springboot.be.entity.Photo;
import com.springboot.be.entity.Post;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public record PostSummaryDto(
        Long postId,
        String title,
        String thumbnailUrl,
        String period,
        String authorName,
        String authorProfileImage
) {
    public static PostSummaryDto from(Post post) {
        String thumbnail = post.getPhotos().isEmpty() ? null
                : post.getPhotos().get(0).getImageUrl();

        LocalDate minDate = null, maxDate = null;
        for (Photo photo : post.getPhotos()) {
            LocalDateTime ta = photo.getTakenAt();
            if (ta == null) continue;
            LocalDate d = ta.toLocalDate();
            if (minDate == null || d.isBefore(minDate)) minDate = d;
            if (maxDate == null || d.isAfter(maxDate)) maxDate = d;
        }
        String period = null;
        if (minDate != null && maxDate != null) {
            DateTimeFormatter formatter = DateTimeFormatter.ISO_DATE;
            period = minDate.format(formatter) + " ~ " + maxDate.format(formatter);
        }

        return new PostSummaryDto(
                post.getId(),
                post.getTitle(),
                thumbnail,
                period,
                post.getUser().getUsername(),
                post.getUser().getProfileImage()
        );
    }
}
