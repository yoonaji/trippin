package com.springboot.be.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class FriendSearchResponse {
    private Long id;
    private String username;
    private String email;
    private String profileImage;
}