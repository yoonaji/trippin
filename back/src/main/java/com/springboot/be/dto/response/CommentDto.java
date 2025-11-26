package com.springboot.be.dto.response;

import com.springboot.be.entity.Comment;

import java.time.LocalDateTime;

public record CommentDto(
        Long commentId,
        String comment,
        LocalDateTime createdAt,
        String authorName,
        String authorProfileImage
) {
    public static CommentDto from(Comment comment) {
        return new CommentDto(
                comment.getId(),
                comment.getComment(),
                comment.getCreatedAt(),
                comment.getUser().getUsername(),
                comment.getUser().getProfileImage()
        );
    }
}
