package com.springboot.be.dto.response;
import com.springboot.be.entity.User;

public record FriendSummaryResponse(Long id, String email, String nickname) {
    public static FriendSummaryResponse of(User u) {
        return new FriendSummaryResponse(u.getId(), u.getEmail(), u.getUsername());
    }
}