package com.springboot.be.security.controller;

import com.springboot.be.dto.request.LoginRequest;
import com.springboot.be.dto.request.SignupRequest;
import com.springboot.be.dto.response.JwtResponse;
import com.springboot.be.dto.response.MessageResponse;
import com.springboot.be.security.dto.TokenRequestDto;
import com.springboot.be.security.dto.TokenResponseDto;
import com.springboot.be.security.oauth2.OneTimeCodeService;
import com.springboot.be.security.pwreset.PasswordResetConfirmDto;
import com.springboot.be.security.pwreset.PasswordResetRequestDto;
import com.springboot.be.security.pwreset.PasswordResetService;
import com.springboot.be.security.services.AuthService;
import com.springboot.be.security.services.TokenService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@CrossOrigin(origins = "*", maxAge = 3600) // 모든 도메인에서의 CORS 요청 허용, 캐시 시간 3600초
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    private final PasswordResetService service;
    private final OneTimeCodeService oneTimeCodeService;
    private final TokenService tokenService;

    //로그인
    @PostMapping("/signin")
    public ResponseEntity<JwtResponse> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        JwtResponse jwtResponse = authService.signin(loginRequest.getEmail(), loginRequest.getPassword());
        return ResponseEntity.ok(jwtResponse);
    }

    //회원가입
    @PostMapping("/signup")
    public ResponseEntity<MessageResponse> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
        authService.signup(signUpRequest.getUsername(), signUpRequest.getEmail(), signUpRequest.getPassword(),
                signUpRequest.getGender(), signUpRequest.getBirthDate());
        return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
    }

    //로그아웃
    @PostMapping("/logout")
    public ResponseEntity<MessageResponse> logout(@RequestHeader("Authorization") String authorization) {
        authService.logout(authorization);
        return ResponseEntity.ok(new MessageResponse("로그아웃 완료"));
    }

    //토큰 재발급
    @PostMapping("/token/reissue")
    public ResponseEntity<TokenResponseDto> reissue(@RequestBody TokenRequestDto request) {
        TokenResponseDto reissue = tokenService.reissue(request.getRefreshToken());
        return ResponseEntity.ok(reissue);
    }

    //비밀번호 재설정 요청 -> 프론트 서버 3000번 포트로 띄우고 확인 필요
    //배포 시에 링크 수정
    @PostMapping("/pwreset/request")
    public ResponseEntity<MessageResponse> request(@Valid @RequestBody PasswordResetRequestDto dto,
                                                   HttpServletRequest req) {
        String baseUrl = Optional.ofNullable(req.getHeader("X-Reset-Base-Url"))
                .orElse("http://localhost:3000");
        service.requestReset(dto.email(), baseUrl);
        return ResponseEntity.ok(new MessageResponse("If the email exists, we’ve sent a password reset link."));
    }

    //비밀번호 재설정 로직
    @PostMapping("/pwreset/confirm")
    public ResponseEntity<Void> confirm(@RequestBody PasswordResetConfirmDto dto) {
        service.confirmReset(dto.token(), dto.newPassword());
        return ResponseEntity.noContent().build();
    }

    // 소셜로그인 코드 교환
    @PostMapping("/exchange")
    public ResponseEntity<JwtResponse> exchange(@RequestBody ExchangeRequest req) {
        return ResponseEntity.ok(oneTimeCodeService.consume(req.code())); // JSON으로 토큰/유저정보 내려감
    }

    public record ExchangeRequest(String code) {
    }

}

