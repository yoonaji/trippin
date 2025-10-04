package com.springboot.be.config;

import com.springboot.be.entity.*;
import com.springboot.be.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Slf4j
@Component
@Profile("dev")
@RequiredArgsConstructor
public class DevSeeder implements CommandLineRunner {

    private final PasswordEncoder passwordEncoder;

    private final UserRepository userRepository;
    private final FriendshipRepository friendshipRepository;
    private final PostRepository postRepository;
    private final PhotoRepository photoRepository;
    private final PhotoLikeRepository photoLikeRepository;
    private final CommentRepository commentRepository;

    private final MarkerRepository markerRepository;
    private final GlobalPlaceRepository globalPlaceRepository;

    private final TravelPathRepository travelPathRepository;
    private final TravelPathPointRepository travelPathPointRepository;

    @Override
    @Transactional
    public void run(String... args) {
        if (userRepository.count() > 0) {
            log.info("Dev seeding skipped (existing data detected).");
            return;
        }

        User admin = User.builder()
                .username("admin")
                .email("admin@example.com")
                .password(passwordEncoder.encode("1234"))
                .role("ADMIN")
                .profileImage("https://picsum.photos/seed/admin/200/200")
                .birthDate(LocalDate.of(1990, 1, 1))
                .age(35)
                .gender("male")
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        User user = User.builder()
                .username("user")
                .email("user@example.com")
                .password(passwordEncoder.encode("1234"))
                .role("USER")
                .profileImage("https://picsum.photos/seed/user/200/200")
                .birthDate(LocalDate.of(1995, 5, 20))
                .age(29)
                .gender("female")
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        User pendingUser = User.builder()
                .username("waiting")
                .email("waiting@example.com")
                .password(passwordEncoder.encode("1234"))
                .role("USER")
                .profileImage("https://picsum.photos/seed/waiting/200/200")
                .birthDate(LocalDate.of(2000, 3, 15))
                .age(24)
                .gender("male")
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        userRepository.saveAll(List.of(admin, user, pendingUser));

        Friendship accepted1 = new Friendship();
        accepted1.setFromTo(admin, user);
        accepted1.setStatus(FriendshipStatus.ACCEPTED);

        Friendship accepted2 = new Friendship();
        accepted2.setFromTo(user, admin);
        accepted2.setStatus(FriendshipStatus.ACCEPTED);

        Friendship pending1 = new Friendship();
        pending1.setFromTo(admin, pendingUser);
        pending1.setStatus(FriendshipStatus.PENDING);

        Friendship pending2 = new Friendship();
        pending2.setFromTo(pendingUser, admin);
        pending2.setStatus(FriendshipStatus.PENDING);

        friendshipRepository.saveAll(List.of(accepted1, accepted2, pending1, pending2));

        Post post = new Post();
        post.setUser(user);
        post.setTitle("첫 번째 여행 기록");
        post.setIsShared(true);
        post = postRepository.save(post);

        int photoCount = 5;
        double startLat = 37.5665;
        double startLng = 126.9780;
        double stepLng = 0.015;

        List<Photo> photos = new ArrayList<>(photoCount);
        List<Marker> markers = new ArrayList<>(photoCount);

        for (int i = 0; i < photoCount; i++) {
            double lat = startLat + (i % 2 == 0 ? 0.002 : -0.002);
            double lng = startLng + stepLng * i;

            GlobalPlace gp = new GlobalPlace();
            gp.setPlaceName("샘플 장소 #" + (i + 1));
            gp.setPlaceId("place-" + UUID.randomUUID());
            gp.setLatitude(lat);
            gp.setLongitude(lng);
            gp = globalPlaceRepository.save(gp);

            Marker marker = new Marker();
            marker.setGlobalPlace(gp);
            marker = markerRepository.save(marker);
            markers.add(marker);

            Photo photo = new Photo();
            photo.setPost(post);
            photo.setMarker(marker);
            photo.setImageUrl("https://picsum.photos/seed/p" + (i + 1) + "/1200/800");
            photo.setContent("샘플 사진 " + (i + 1));
            photo.setLatitude(lat);
            photo.setLongitude(lng);
            photo.setSequence(i);
            photo.setTakenAt(LocalDateTime.now().minusDays(photoCount - i));
            photo = photoRepository.save(photo);
            photos.add(photo);

            marker.increasePhotoCount();
            markerRepository.save(marker);
        }

        if (!photos.isEmpty()) {
            Photo target = photos.get(0);
            Comment c1 = new Comment(target, user, "와, 여기 너무 예쁘다!");
            Comment c2 = new Comment(target, admin, "담번엔 같이 가요 :)");
            commentRepository.saveAll(List.of(c1, c2));
        }

        TravelPath path = new TravelPath();
        path.setUser(user);
        path.setPathName("첫 번째 여행 경로");
        path.setPost(post);
        path.setCreatedAt(LocalDateTime.now());
        path.setUpdatedAt(LocalDateTime.now());
        path = travelPathRepository.save(path);

        List<TravelPathPoint> points = new ArrayList<>(photoCount);
        for (int i = 0; i < photos.size(); i++) {
            Photo ph = photos.get(i);
            TravelPathPoint pt = new TravelPathPoint();
            pt.setTravelPath(path);
            pt.setMarker(ph.getMarker());
            pt.setLatitude(ph.getLatitude());
            pt.setLongitude(ph.getLongitude());
            pt.setSequence(i);
            points.add(travelPathPointRepository.save(pt));
        }

        if (!photos.isEmpty()) {
            Photo firstPhoto = photos.get(0);

            PhotoLike like1 = new PhotoLike(admin, firstPhoto);
            firstPhoto.increaseLike();

            PhotoLike like2 = new PhotoLike(pendingUser, firstPhoto);
            firstPhoto.increaseLike();

            photoLikeRepository.saveAll(List.of(like1, like2));
            photoRepository.save(firstPhoto);
        }

        log.info("Seeded users: 3 (admin/user/pending), friendships: 4, post: 1, photos: {}, markers: {}, comments: 2, travelPath: 1, points: {}, likes: {}",
                photos.size(), markers.size(), 2, points.size(), 2);
    }
}
