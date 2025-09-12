package com.springboot.be.security.pwreset;

import com.springboot.be.repository.UserRepository;
import com.springboot.be.security.exception.ApiException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.SecureRandom;
import java.time.Duration;
import java.util.Base64;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PasswordResetService {
    private static final Duration TOKEN_TTL = Duration.ofMinutes(5);
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final ResetTokenStore tokenStore;
    private final MailService mailService;

    @Transactional
    public void requestReset(String email, String baseUrl) {
        userRepository.findByEmail(email).ifPresent(user -> {
            String rawToken = generateToken();
            String tokenHash = sha256(rawToken);
            tokenStore.save(tokenHash, user.getId(), TOKEN_TTL);

            String link = baseUrl + "/api/auth/reset?token=" + rawToken;
            mailService.sendPasswordResetMail(user.getEmail(), link, (int) TOKEN_TTL.toMinutes());

            System.out.println("로컬 개발용 토큰 확인 링크 : " + link + "배포 시에 제외할 것");
        });

    }

    @Transactional
    public void confirmReset(String rawToken, String newPassword) {
        String tokenHash = sha256(rawToken);
        var userIdOpt = tokenStore.load(tokenHash);

        if (userIdOpt.isEmpty()) {
            throw ApiException.badRequest("RESET_TOKEN_INVALID", "비밀번호 재설정 토큰이 만료되었거나 유효하지 않습니다.");
        }

        validatePasswordPolicy(newPassword);

        var user = userRepository.findById(userIdOpt.get())
                .orElseThrow(() -> ApiException.notFound("USER_NOT_FOUND", "사용자를 찾을 수 없습니다."));
        user.setPassword(passwordEncoder.encode(newPassword));

        tokenStore.delete(tokenHash);
    }

    private void validatePasswordPolicy(String pw) {
        if (pw == null || pw.length() > 45) {
            throw ApiException.badRequest("PASSWORD_LENGTH", "비밀번호 길이가 허용 범위를 벗어났습니다.");
        }
        if (pw.contains(" ")) {
            throw ApiException.badRequest("PASSWORD_SPACE", "비밀번호에 공백은 허용되지 않습니다.");
        }
    }

    private String generateToken() {
        byte[] buf = new byte[32];
        new SecureRandom().nextBytes(buf);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(buf);

    }

    private String sha256(String raw) {
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            byte[] d = md.digest(raw.getBytes(StandardCharsets.UTF_8));
            return Base64.getUrlEncoder().withoutPadding().encodeToString(d);
        } catch (Exception e) {
            throw ApiException.internal("HASH_ERROR", "토큰 해시 생성 중 오류가 발생했습니다.");
        }
    }

}
