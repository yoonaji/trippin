package com.springboot.be.controller;

import com.springboot.be.dto.common.ApiResponse;
import com.springboot.be.dto.request.PostCreateRequest;
import com.springboot.be.dto.response.PostDetailDto;
import com.springboot.be.security.services.UserDetailsImpl;
import com.springboot.be.service.PostService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
public class PostController {
    private final PostService postService;

    @PostMapping
    public ApiResponse<Void> createPost(@RequestBody PostCreateRequest request, @AuthenticationPrincipal UserDetailsImpl me) {
        postService.createPost(request, me.getId());
        return ApiResponse.<Void>created("게시글 생성 성공", null);
    }

    @GetMapping("/{postId}")
    public ApiResponse<PostDetailDto> getPostDetail(@PathVariable Long postId) {
        PostDetailDto post = postService.getPostDetails(postId);
        return ApiResponse.success("게시글 상세 조회 성공", post);
    }

    @PutMapping("/{postId}")
    public ApiResponse<Void> updatePost(
            @PathVariable Long postId,
            @RequestBody PostCreateRequest request,
            @AuthenticationPrincipal UserDetailsImpl me
    ) {
        postService.updatePost(postId, request, me.getId());
        return ApiResponse.success("게시글 수정 성공");
    }

    @DeleteMapping("/{postId}")
    public ApiResponse<Void> deletePost(
            @PathVariable Long postId,
            @AuthenticationPrincipal UserDetailsImpl me
    ) {
        postService.deletePost(postId, me.getId());
        return ApiResponse.success("게시글 삭제 성공");
    }
}
