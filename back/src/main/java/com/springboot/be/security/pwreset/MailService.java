package com.springboot.be.security.pwreset;

import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class MailService {
    private final JavaMailSender mailSender;

    public void sendPasswordResetMail(String to, String link, int minutes) {
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

    }
}
