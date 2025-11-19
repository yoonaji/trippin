package com.springboot.be.security.services;

import com.springboot.be.entity.RefreshEntity;
import com.springboot.be.entity.User;
import com.springboot.be.repository.RefreshRepository;
import com.springboot.be.repository.UserRepository;
import com.springboot.be.security.dto.TokenResponseDto;
import com.springboot.be.security.exception.ApiException;
import com.springboot.be.security.jwt.JwtUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class TokenService {

    private final UserRepository userRepository; // 사용자 정보를 DB에서 조회/저장하기 위한 JPA Repository

    private final JwtUtils jwtUtils; // JWT 토큰 생성 및 검증 유틸리티

    private final RefreshRepository refreshRepository;

    @Transactional
    public TokenResponseDto reissue(String refreshToken) {

        // 1. RefreshToken 유효성 검사
        jwtUtils.validateJwtToken(refreshToken);

        if (!Objects.equals(jwtUtils.getCategory(refreshToken), "refresh")) {
            throw ApiException.unauthorized("NOT_REFRESH_TOKEN", "Refresh Token이 아닙니다.");
        }
        // 2. RefreshToken에서 email 추출 → User 조회
        String email = jwtUtils.getEmailFromJwtToken(refreshToken);
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> ApiException.notFound("USER_NOT_FOUND", "유저를 찾을 수 없습니다."));

        // 3. RefreshEntity 조회
        RefreshEntity refreshEntity = refreshRepository.findByUser(user)
                .orElseThrow(() -> ApiException.notFound("REFRESH_NOT_FOUND", "RefreshToken이 존재하지 않습니다."));

        // 4. RefreshToken 일치 여부 확인
        if (!refreshEntity.getToken().equals(refreshToken)) {
            throw ApiException.unauthorized("REFRESH_MISMATCH", "Refresh Token 불일치");
        }

        // 5. 새로운 토큰 발급
        String newAccessToken = jwtUtils.generateToken(email, "access", 1000 * 60 * 15);
        String newRefreshToken = jwtUtils.generateToken(email, "refresh", 1000L * 60 * 60 * 24 * 30);

        LocalDateTime expUtc = jwtUtils.getExpirationInstant(newRefreshToken)
                .atZone(java.time.ZoneOffset.UTC)
                .toLocalDateTime();


        // 6. DB 갱신. exp도 수정 완료
        refreshEntity.updateToken(newRefreshToken, expUtc);
        refreshRepository.save(refreshEntity);

        // 7. 응답
        return new TokenResponseDto(newAccessToken, newRefreshToken);
    }
}

