package com.springboot.be.security.pwreset;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j; // 1. 로그 임포트
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j // 2. 로그 어노테이션 추가
public class MailService {
    private final JavaMailSender mailSender;

    public void sendPasswordResetMail(String to, String link, int minutes) {

        // 3. try-catch 문으로 감싸기
        try {
            mailSender.send(mimeMessage -> {
                MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, "UTF-8"); // multipart X
                helper.setTo(to);
                helper.setSubject("Trippin 비밀번호 재설정 안내");
                String html = """
            <p>아래 버튼을 눌러 <b>%d분</b> 이내에 비밀번호를 재설정하세요.</p>
            <p><a href="%s" target="_blank">비밀번호 재설정하기</a></p>
            <p>안 되면 링크 복사: <a href="%s">%s</a></p>
            """.formatted(minutes, link, link, link);
                // ✅ HTML 단독
                helper.setText(html, true);
            });

        } catch (Exception e) {
            // 4. 오류 발생 시, Cloud Run 로그에 "스택 트레이스" 전체를 기록
            log.error("비밀번호 재설정 이메일 발송 실패. 수신자: {}", to, e);

            // 5. 오류를 컨트롤러로 다시 던져서 500 에러 반환
            throw new RuntimeException("이메일 발송 중 오류가 발생했습니다.", e);
        }
    }
}