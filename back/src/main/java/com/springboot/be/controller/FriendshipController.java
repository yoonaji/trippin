package com.springboot.be.controller;

import com.springboot.be.dto.response.FriendSummaryResponse;
import com.springboot.be.dto.response.IdResponse;
import com.springboot.be.dto.response.MessageResponse;

import com.springboot.be.dto.common.ApiResponse;
import com.springboot.be.dto.request.SendFriendRequest;
import com.springboot.be.dto.response.*;
import com.springboot.be.security.services.UserDetailsImpl;
import com.springboot.be.service.FriendshipService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import com.springboot.be.dto.request.SendFriendRequest;

import java.util.List;

@RestController
@RequestMapping("/api/friends")
@RequiredArgsConstructor
public class FriendshipController {
    private final FriendshipService service;
    private final FriendshipService friendshipService;

    // 친구 요청 보내기
    @PostMapping("/requests")
    public IdResponse send(@AuthenticationPrincipal UserDetailsImpl principal, @RequestBody SendFriendRequest req) {
        return service.sendRequest(principal.getEmail(), req.toEmail());
    }

    // 수락
    @PostMapping("/requests/{id}/accept")
    public MessageResponse accept(@PathVariable Long id, @AuthenticationPrincipal UserDetailsImpl principal) {
        return service.accept(id, principal.getEmail());
    }

    // 거절
    @PostMapping("/requests/{id}/reject")
    public MessageResponse reject(@PathVariable Long id, @AuthenticationPrincipal UserDetailsImpl principal) {
        return service.reject(id, principal.getEmail());
    }

    // 친구 삭제
    @DeleteMapping("/{friendEmail}")
    public MessageResponse unfriend(@AuthenticationPrincipal UserDetailsImpl principal, @PathVariable String friendEmail) {
        return service.unfriend(principal.getEmail(), friendEmail);
    }

    // 목록 조회
    @GetMapping
    public List<FriendSummaryResponse> list(@AuthenticationPrincipal UserDetailsImpl principal) {
        return service.listFriends(principal.getEmail());
    }

    // 요청 목록 조회
    @GetMapping("/requests/incoming")
    public List<IncomingFriendDto> incoming(@AuthenticationPrincipal UserDetailsImpl principal) {
        return service.listIncoming(principal.getEmail());
    }

    // 친구 검색
    @GetMapping("/search")
    public ResponseEntity<?> searchByEmail(@RequestParam String email) {
        var result = service.searchByEmail(email);
        if (result.isPresent()) {
            return ResponseEntity.ok(result.get());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("해당 이메일의 사용자를 찾을 수 없습니다.");
        }
    }

    @GetMapping("/feed")
    public ApiResponse<List<PostSummaryDto>> getFriendsFeed(
            @AuthenticationPrincipal UserDetailsImpl me
    ) {
        List<PostSummaryDto> list = friendshipService.getFriendsPosts(me.getEmail());
        return ApiResponse.success("친구 피드 조회 성공", list);
    }

}
