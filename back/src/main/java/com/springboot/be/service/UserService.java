package com.springboot.be.service;

import com.springboot.be.dto.request.ProfileImageUpdateRequest;
import com.springboot.be.dto.request.UsernameUpdateRequest;
import com.springboot.be.dto.response.CommentDto;
import com.springboot.be.dto.response.PhotoSummaryDto;
import com.springboot.be.dto.response.PostSummaryDto;
import com.springboot.be.dto.response.UserDto;
import com.springboot.be.entity.Post;
import com.springboot.be.entity.User;
import com.springboot.be.exception.NotFoundException;
import com.springboot.be.repository.CommentRepository;
import com.springboot.be.repository.PhotoLikeRepository;
import com.springboot.be.repository.PostRepository;
import com.springboot.be.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PostRepository postRepository;
    private final CommentRepository commentRepository;
    private final PhotoLikeRepository photoLikeRepository;

    @Transactional(readOnly = true)
    public UserDto getUser(Long userId) {
        return userRepository.findById(userId)
                .map(UserDto::from)
                .orElseThrow(() -> new NotFoundException("사용자를 찾을 수 없습니다."));
    }

    @Transactional
    public void updateUsername(Long userId, UsernameUpdateRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("사용자를 찾을 수 없습니다."));
        user.setUsername(request.username());
    }

    @Transactional
    public void updateProfileImage(Long userId, ProfileImageUpdateRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("사용자를 찾을 수 없습니다."));
        user.setProfileImage(request.profileImage());
    }

    @Transactional(readOnly = true)
    public List<PostSummaryDto> getPostsByUser(Long userId) {
        List<Post> posts = postRepository.findByUserIdOrderByCreatedAtAsc(userId);
        return posts.stream()
                .map(PostSummaryDto::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<CommentDto> getCommentsByUser(Long userId) {
        return commentRepository.findByUserId(userId)
                .stream()
                .map(CommentDto::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<PhotoSummaryDto> getFavoritePhotos(Long userId) {
        return photoLikeRepository.findPhotoLikedByUser(userId)
                .stream().map(PhotoSummaryDto::from).toList();
    }
}
