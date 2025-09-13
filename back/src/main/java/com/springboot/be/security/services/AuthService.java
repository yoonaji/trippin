package com.springboot.be.security.services;

import com.springboot.be.dto.response.JwtResponse;
import com.springboot.be.entity.RefreshEntity;
import com.springboot.be.entity.User;
import com.springboot.be.repository.RefreshRepository;
import com.springboot.be.repository.UserRepository;
import com.springboot.be.security.jwt.JwtUtils;
import com.sun.jdi.request.DuplicateRequestException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;


@Service
@RequiredArgsConstructor
public class AuthService {
    private final AuthenticationManager authenticationManager; // 로그인 인증 처리

    private final UserRepository userRepository; // 사용자 정보를 DB에서 조회/저장하기 위한 JPA Repository

    private final PasswordEncoder encoder; // 비밀번호 암호화를 위한 PasswordEncoder

    private final JwtUtils jwtUtils; // JWT 토큰 생성 및 검증 유틸리티

    private final RefreshRepository refreshRepository;

    @Transactional
    public void logout(String authorization) {
        if (authorization == null || !authorization.toLowerCase().startsWith("bearer ")) {
            throw new IllegalArgumentException("Authorization 헤더 형식 오류");
        }
        String accessToken = authorization.substring(7).trim();
        jwtUtils.validateJwtToken(accessToken);

        String email = jwtUtils.getEmailFromJwtToken(accessToken);
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("유저를 찾을 수 없음"));

        refreshRepository.deleteByUser(user);
    }

    @Transactional
    public JwtResponse signin(String email, String password) {

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(email, password));
        SecurityContextHolder.getContext().setAuthentication(authentication);

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        String username = userDetails.getUsername();
        String userEmail = userDetails.getEmail();
        Long userId = userDetails.getId();

        //token 발급 로직 분리?
        String accessToken = jwtUtils.generateToken(userEmail, "access", 1000 * 60 * 15);
        String refreshToken = jwtUtils.generateToken(userEmail, "refresh", 1000L * 60 * 60 * 24 * 30);

        User user = userRepository.findByEmail(userEmail).orElseThrow();
//        refreshRepository.findByUser(user).ifPresent(refreshRepository::delete);

        LocalDateTime expUtc = jwtUtils.getExpirationInstant(refreshToken)
                .atZone(java.time.ZoneOffset.UTC)
                .toLocalDateTime();

        refreshRepository.findByUser(user)
                .ifPresentOrElse(
                        existing -> existing.updateToken(refreshToken, expUtc), // JPA dirty checking → update
                        () -> refreshRepository.save(
                                RefreshEntity.ofUserToken(user, refreshToken, expUtc) // 새 엔티티 생성
                        )
                );

//        RefreshEntity tokenEntity = RefreshEntity.builder()
//                .user(user)
//                .token(refreshToken)
//                .expiryDate(expUtc)
//                .build();
//
//        refreshRepository.save(tokenEntity);

        return new JwtResponse(
                accessToken,
                refreshToken,
                userId,
                username,
                userDetails.getEmail()
        );
    }

    @Transactional
    public void signup(String username, String email, String password, String gender, LocalDate birthDate) {
        if (userRepository.existsByEmail(email)) {
            throw new DuplicateRequestException(email);
        }

        User user = new User(username,
                encoder.encode(password),
                email,
                gender,
                birthDate
        );
        userRepository.save(user);

    }
}
