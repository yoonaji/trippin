package com.springboot.be.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;

import java.time.LocalDateTime;

@Entity
@Getter
@NoArgsConstructor
@IdClass(PhotoLikeId.class)
public class PhotoLike {
    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "photo_id")
    private Photo photo;

    @CreatedDate
    private LocalDateTime createdAt;

    public PhotoLike(User user, Photo photo) {
        this.user = user;
        this.photo = photo;
    }
}
