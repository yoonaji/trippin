package com.springboot.be.security.dto;


import lombok.NoArgsConstructor;

@NoArgsConstructor
public class TokenRequestDto {
    private String refreshToken;

    public TokenRequestDto(String refreshToken) {
        this.refreshToken = refreshToken;
    }

    public String getRefreshToken() {
        return refreshToken;
    }

    public void setRefreshToken(String refreshToken) {
        this.refreshToken = refreshToken;
    }
}
