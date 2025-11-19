package com.springboot.be.controller;

import com.springboot.be.dto.common.ApiResponse;
import com.springboot.be.dto.request.ProfileImageUpdateRequest;
import com.springboot.be.dto.request.UsernameUpdateRequest;
import com.springboot.be.dto.response.*;
import com.springboot.be.security.services.UserDetailsImpl;
import com.springboot.be.service.TravelPathService;
import com.springboot.be.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;
    private final TravelPathService travelPathService;

    @GetMapping("/me")
    public ApiResponse<UserDto> getMyInfo(@AuthenticationPrincipal UserDetailsImpl me) {
        return ApiResponse.success("내 정보 조회 성공", userService.getUser(me.getId()));
    }

    @PatchMapping("/me/username")
    public ApiResponse<Void> updateUsername(
            @AuthenticationPrincipal UserDetailsImpl me,
            @RequestBody UsernameUpdateRequest request
    ) {
        userService.updateUsername(me.getId(), request);
        return ApiResponse.success("닉네임 변경 성공");
    }

    @PatchMapping("/me/profile-image")
    public ApiResponse<Void> updateProfileImage(
            @AuthenticationPrincipal UserDetailsImpl me,
            @RequestBody ProfileImageUpdateRequest request
    ) {
        userService.updateProfileImage(me.getId(), request);
        return ApiResponse.success("프로필 사진 변경 성공");
    }

    @GetMapping("/me/posts")
    public ApiResponse<List<PostSummaryDto>> getMyPosts(@AuthenticationPrincipal UserDetailsImpl me) {
        return ApiResponse.success("내 게시글 조회 성공", userService.getPostsByUser(me.getId()));
    }

    @GetMapping("/{userId}/posts")
    public ApiResponse<List<PostSummaryDto>> getPosts(@PathVariable Long userId) {
        return ApiResponse.success("타인 게시글 조회 성공", userService.getPostsByUser(userId));
    }

    @GetMapping("/me/comments")
    public ApiResponse<List<CommentDto>> getMyComments(@AuthenticationPrincipal UserDetailsImpl me) {
        return ApiResponse.success("내 댓글 조회 성공", userService.getCommentsByUser(me.getId()));
    }

    @GetMapping("/me/favorites")
    public ApiResponse<List<PhotoSummaryDto>> getMyFavorites(@AuthenticationPrincipal UserDetailsImpl me) {
        return ApiResponse.success("내가 좋아요한 사진 조회 성공", userService.getFavoritePhotos(me.getId()));
    }

    @GetMapping("/me/routes")
    public ApiResponse<List<MyTravelPathDto>> getMyTravelPaths(@AuthenticationPrincipal UserDetailsImpl me) {
        return ApiResponse.success("내 여행 경로 조회 성공", travelPathService.getMyTravelPaths(me.getId()));
    }
}
