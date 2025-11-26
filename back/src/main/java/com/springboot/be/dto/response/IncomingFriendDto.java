package com.springboot.be.dto.response;

public record IncomingFriendDto(
        Long id,
        String email,
        String nickname
) {}
