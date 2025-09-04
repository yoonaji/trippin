package com.springboot.be.security.pwreset;

import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class MailService {
    private final JavaMailSender mailSender;

    public void sendPasswordResetMail(String to, String link, int minutes) {
        SimpleMailMessage msg = new SimpleMailMessage();
        msg.setTo(to);
        msg.setSubject("Trippin 비밀번호 재설정 안내");
        msg.setText("""
                아래 링크에서 %d분 이내에 비밀번호를 재설정하세요.
                %s
                """.formatted(minutes, link));
        mailSender.send(msg);
    }
}
