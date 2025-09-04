package com.springboot.be.service;

import com.springboot.be.dto.request.CommentCreateRequest;
import com.springboot.be.dto.response.CommentDto;
import com.springboot.be.entity.Comment;
import com.springboot.be.entity.Photo;
import com.springboot.be.entity.User;
import com.springboot.be.exception.ForbiddenException;
import com.springboot.be.exception.NotFoundException;
import com.springboot.be.repository.CommentRepository;
import com.springboot.be.repository.PhotoRepository;
import com.springboot.be.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


@Service
@RequiredArgsConstructor
public class CommentService {
    private final PhotoRepository photoRepository;
    private final CommentRepository commentRepository;
    private final UserRepository userRepository;

    @Transactional
    public CommentDto addComment(Long photoId, Long userId, CommentCreateRequest request) {
        Photo photo = photoRepository.findById(photoId)
                .orElseThrow(() -> new NotFoundException("사진을 찾을 수 없습니다."));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("사용자를 찾을 수 없습니다."));
        Comment comment = new Comment(photo, user, request.getComment());
        Comment saved = commentRepository.save(comment);
        return CommentDto.from(saved);
    }

    @Transactional
    public void deleteComment(Long photoId, Long commentId, Long userId) {
        Photo photo = photoRepository.findById(photoId)
                .orElseThrow(() -> new NotFoundException("사진을 찾을 수 없습니다."));
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new NotFoundException("댓글을 찾을 수 없습니다."));

        if (!comment.getPhoto().getId().equals(photo.getId())) {
            throw new IllegalArgumentException("해당 사진에 속하지 않는 댓글입니다.");
        }

        if (!comment.getUser().getId().equals(userId) && !photo.getPost().getUser().getId().equals(userId)) {
            throw new ForbiddenException("댓글 삭제 권한이 없습니다.");
        }

        commentRepository.delete(comment);
    }
}
