package com.springboot.be.controller;

import com.springboot.be.dto.common.ApiResponse;
import com.springboot.be.dto.request.PostCreateRequest;
import com.springboot.be.dto.request.PostUpdateRequest;
import com.springboot.be.dto.response.PopularPhotoDto;
import com.springboot.be.dto.response.PostCreateResponse;
import com.springboot.be.dto.response.PostDetailDto;
import com.springboot.be.security.services.UserDetailsImpl;
import com.springboot.be.service.PhotoService;
import com.springboot.be.service.PostService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
public class PostController {
    private final PostService postService;
    private final PhotoService photoService;

    @PostMapping
    public ApiResponse<PostCreateResponse> createPost(@Valid @RequestBody PostCreateRequest request, @AuthenticationPrincipal UserDetailsImpl me) {
        PostCreateResponse res = postService.createPost(request, me.getId());
        return ApiResponse.created("게시글 생성 성공", res);
    }

    @GetMapping("/{postId}")
    public ApiResponse<PostDetailDto> getPostDetail(@PathVariable Long postId) {
        PostDetailDto post = postService.getPostDetails(postId);
        return ApiResponse.success("게시글 상세 조회 성공", post);
    }

    @PutMapping("/{postId}")
    public ApiResponse<PostCreateResponse> updatePost(
            @PathVariable Long postId,
            @RequestBody PostUpdateRequest request,
            @AuthenticationPrincipal UserDetailsImpl me
    ) {
        PostCreateResponse res = postService.updatePost(postId, request, me.getId());
        return ApiResponse.<PostCreateResponse>success("게시글 수정 성공", res);
    }

    @DeleteMapping("/{postId}")
    public ApiResponse<Void> deletePost(
            @PathVariable Long postId,
            @AuthenticationPrincipal UserDetailsImpl me
    ) {
        postService.deletePost(postId, me.getId());
        return ApiResponse.success("게시글 삭제 성공");
    }

    @GetMapping("/popular")
    public ApiResponse<List<PopularPhotoDto>> getPopularPhotos() {
        return ApiResponse.success("인기 게시글 조회 성공", photoService.getPopularPhotos());
    }
}
