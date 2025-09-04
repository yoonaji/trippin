package com.springboot.be.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.time.LocalDateTime;


@Entity
@Getter //@setter 삭제
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RefreshEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    int id;

   @OneToOne(fetch = FetchType.LAZY)
   @JoinColumn(name = "user_id")
   private User user;

   @Column(nullable = false, unique = true)
    private String token;

   @Column(nullable = false)
    private LocalDateTime expiryDate;

    public RefreshEntity(User user, String token, LocalDateTime expiryDate) {
        this.user = user;
        this.token = token;
        this.expiryDate = expiryDate;
    }

    public void updateToken(String newToken, LocalDateTime expiryDate) {
        this.token = newToken;
        this.expiryDate = expiryDate;
    }

    public static RefreshEntity ofUserToken(User user, String token, LocalDateTime exp) {
        RefreshEntity r = new RefreshEntity();
        r.user = user; r.token = token; r.expiryDate = exp;
        return r;
    }

}
