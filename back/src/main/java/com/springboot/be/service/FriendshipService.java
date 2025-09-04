package com.springboot.be.service;

import com.springboot.be.dto.request.SendFriendRequest;
import com.springboot.be.dto.request.UnfriendRequest;
import com.springboot.be.dto.response.FriendSearchResponse;
import com.springboot.be.dto.response.FriendSummaryResponse;
import com.springboot.be.dto.response.IdResponse;
import com.springboot.be.dto.response.MessageResponse;
import com.springboot.be.entity.Friendship;
import com.springboot.be.entity.FriendshipStatus;
import com.springboot.be.entity.User;
import com.springboot.be.repository.FriendshipRepository;
import com.springboot.be.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import com.springboot.be.security.exception.ApiException;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class FriendshipService {
    private final FriendshipRepository friendshipRepo;
    private final UserRepository userRepo;

    private User getUserOrThrow(String email) {
        return userRepo.findByEmail(email)
                .orElseThrow(() ->  ApiException.notFound("USER_NOT_FOUND", "존재하지 않는 사용자: " + email));
    }

    @Transactional
    public IdResponse sendRequest(String f, String t) {

        if (f.equalsIgnoreCase(t))
            throw ApiException.badRequest("SELF_REQUEST", "자기 자신에게는 요청할 수 없습니다.");

        User from = getUserOrThrow(f);
        User to   = getUserOrThrow(t);

        friendshipRepo.findBetween(f, t).ifPresent(friendship -> {
            throw ApiException.conflict("RELATION_EXISTS",
                    "이미 관계가 존재합니다(요청/수락/거절)");
        });

        Friendship friendship = new Friendship(); // status 기본값: PENDING
        friendship.setFromTo(from, to);
        try {
            return new IdResponse(friendshipRepo.save(friendship).getId());
        } catch (DataIntegrityViolationException e) { // 동시요청 경합 대비 최종 방어
            throw ApiException.conflict("RELATION_EXISTS_CONCURRENT",
                    "이미 관계가 존재합니다(동시 요청 충돌)");
        }
    }

    @Transactional
    public MessageResponse accept(Long requestId, String toEmail) {
        Friendship f = friendshipRepo.findById(requestId)
                .orElseThrow(() -> ApiException.notFound("REQUEST_NOT_FOUND", "요청 없음: " + requestId));
        if (!f.isReceiver(toEmail)) {
            throw ApiException.forbidden("NO_PERMISSION", "수락 권한이 없습니다.");
        }
        if (!f.isPending()) { throw ApiException.badRequest("NOT_PENDING", "대기 상태가 아닙니다.");
        }
        f.setStatus(FriendshipStatus.ACCEPTED);
        return new MessageResponse("ACCEPTED");
    }

    @Transactional
    public MessageResponse reject(Long requestId, String toEmail) {
        Friendship f = friendshipRepo.findById(requestId)
                .orElseThrow(() -> ApiException.notFound("REQUEST_NOT_FOUND", "요청 없음: " + requestId));
        if (!f.isReceiver(toEmail)) {
            throw ApiException.forbidden("NO_PERMISSION", "거절 권한이 없습니다.");
        }
        if (!f.isPending()) {
            throw ApiException.badRequest("NOT_PENDING", "대기 상태가 아닙니다.");
        }
        f.setStatus(FriendshipStatus.REJECTED);
        return new MessageResponse("REJECTED");
    }

    @Transactional
    public MessageResponse unfriend(String a, String b) {
        var fOpt = friendshipRepo.findBetween(a,b);
        if (fOpt.isEmpty() || !fOpt.get().isAccepted())
            throw ApiException.notFound("FRIEND_NOT_FOUND", "현재 친구 관계가 없습니다.");

        var f = fOpt.get();
        if (!(f.isSender(a) || f.isReceiver(a))) {
            throw ApiException.forbidden("NO_PERMISSION", "권한이 없습니다.");
        }

        friendshipRepo.delete(f);
        return new MessageResponse("UNFRIENDED");
    }

    @Transactional
    public List<FriendSummaryResponse> listFriends(String email) {
        return friendshipRepo.findFriendsUnion(email)
                .stream()
                .map(FriendSummaryResponse::of)
                .toList();
    }

    @Transactional
    public List<FriendSummaryResponse> listIncoming(String email) {
        return friendshipRepo.findByToUser_EmailAndStatus(email, FriendshipStatus.PENDING)
                .stream()
                .map(f -> FriendSummaryResponse
                        .of(f.getFromUser()))
                .toList();
    }

    @Transactional
    public Optional<FriendSearchResponse> searchByEmail(String email) {
        return userRepo.findByEmail(email)
                .map(user -> new FriendSearchResponse(
                        user.getId(),
                        user.getUsername(),
                        user.getEmail(),
                        user.getProfileImage()
                ));
    }
}
