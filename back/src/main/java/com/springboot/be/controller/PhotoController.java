package com.springboot.be.controller;

import com.springboot.be.dto.common.ApiResponse;
import com.springboot.be.dto.request.CommentCreateRequest;
import com.springboot.be.dto.response.CommentDto;
import com.springboot.be.dto.response.PhotoDetailDto;
import com.springboot.be.dto.response.PhotoUploadResponse;
import com.springboot.be.security.services.UserDetailsImpl;
import com.springboot.be.service.CommentService;
import com.springboot.be.service.PhotoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/photos")
@RequiredArgsConstructor
public class PhotoController {

    private final PhotoService photoService;
    private final CommentService commentService;

    @GetMapping("/{photoId}")
    public ApiResponse<PhotoDetailDto> getPhoto(@PathVariable Long photoId) {
        return ApiResponse.success("사진 상세 가져오기 성공", photoService.getPhotoDetail(photoId));
    }

    @PostMapping("/{photoId}/comments")
    public ApiResponse<CommentDto> addComment(
            @PathVariable Long photoId,
            @RequestBody CommentCreateRequest request,
            @AuthenticationPrincipal UserDetailsImpl me
    ) {
        CommentDto created = commentService.addComment(photoId, me.getId(), request);
        return ApiResponse.created("댓글 작성 성공", created);
    }

    @DeleteMapping("/{photoId}/comments/{commentId}")
    public ApiResponse<Void> deleteComment(
            @PathVariable Long photoId,
            @PathVariable Long commentId,
            @AuthenticationPrincipal UserDetailsImpl me
    ) {
        commentService.deleteComment(photoId, commentId, me.getId());
        return ApiResponse.success("댓글 삭제 성공");
    }

    public ResponseEntity<String> delete() {
        return ResponseEntity.ok("");
    }

    @PostMapping("/{photoId}/like")
    public ApiResponse<Void> likePhoto(
            @PathVariable Long photoId,
            @AuthenticationPrincipal UserDetailsImpl me
    ) {
        photoService.likePhoto(photoId, me.getId());
        return ApiResponse.success("사진 좋아요 성공");
    }

    @DeleteMapping("/{photoId}/like")
    public ApiResponse<Void> unlikePhoto(
            @PathVariable Long photoId,
            @AuthenticationPrincipal UserDetailsImpl me
    ) {
        photoService.unlikePhoto(photoId, me.getId());
        return ApiResponse.success("사진 좋아요 삭제 성공");
    }

    @PostMapping("/upload")
    public ApiResponse<List<PhotoUploadResponse>> uploadImages(@RequestParam("images") List<MultipartFile> images) {
        List<PhotoUploadResponse> responses = photoService.uploadImages(images);
        return ApiResponse.success("이미지 업로드 및 메타데이터 추출 성공", responses);
    }
}
