package com.springboot.be.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@Table(uniqueConstraints = @UniqueConstraint(name="uk_friend_from_to", columnNames = {"from_user_id","to_user_id"}),
        indexes = {
                @Index(name="idx_friend_to_status", columnList = "to_user_id,status"),
                @Index(name="idx_friend_from_status", columnList = "from_user_id,status")
        })
@NoArgsConstructor
public class Friendship {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "from_user_id", nullable = false)
    private User fromUser;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "to_user_id", nullable = false)
    private User toUser;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 16)
    private FriendshipStatus status = FriendshipStatus.PENDING;

    public void setFromTo(User from, User to) { this.fromUser = from; this.toUser = to; }
    public void setStatus(FriendshipStatus s) { this.status = s; }

    public boolean isReceiver(String email) { return toUser.getEmail().equalsIgnoreCase(email); }
    public boolean isSender(String email)   { return fromUser.getEmail().equalsIgnoreCase(email); }
    public boolean isPending()              { return status == FriendshipStatus.PENDING; }
    public boolean isAccepted()             { return status == FriendshipStatus.ACCEPTED; }
}
