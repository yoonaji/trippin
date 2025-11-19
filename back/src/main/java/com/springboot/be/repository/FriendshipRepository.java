package com.springboot.be.repository;

import com.springboot.be.dto.response.IncomingFriendDto;
import com.springboot.be.entity.Friendship;
import com.springboot.be.entity.FriendshipStatus;
import com.springboot.be.entity.Post;
import com.springboot.be.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface FriendshipRepository extends JpaRepository<Friendship, Long> {
    @Query("""
            select f from Friendship f
            where (f.fromUser.email = :a and f.toUser.email = :b)
               or (f.fromUser.email = :b and f.toUser.email = :a)
            """)
    Optional<Friendship> findBetween(@Param("a") String emailA, @Param("b") String emailB);

    // 내 친구(상대 User만 뽑기)
    @Query(value = """
              (select u.* 
                 from friendship f 
                 join users u on u.id = f.to_user_id
                where f.status = 'ACCEPTED' and exists(
                      select 1 from users fu where fu.id=f.from_user_id and fu.email = :email
                ))
              UNION
              (select u.* 
                 from friendship f 
                 join users u on u.id = f.from_user_id
                where f.status = 'ACCEPTED' and exists(
                      select 1 from users tu where tu.id=f.to_user_id and tu.email = :email
                ))
            """, nativeQuery = true)
    List<User> findFriendsUnion(@Param("email") String email);

    @Query(value = """
              SELECT * FROM post p
              WHERE p.user_id IN (:friendIds)
                AND p.is_shared = true
                AND p.is_deleted = false
              ORDER BY p.created_at DESC, p.id DESC
              LIMIT :limit OFFSET :offset
            """, nativeQuery = true)
    List<Post> findFriendsPostsPage(
            @Param("friendIds") List<Long> friendIds,
            @Param("limit") int limit,
            @Param("offset") int offset
    );

    @Query("""
                select new com.springboot.be.dto.response.IncomingFriendDto(
                    f.id, fu.email, fu.username
                )
                from Friendship f
                join f.fromUser fu
                where f.toUser.email = :email
                  and f.status = :status
            """)
    List<IncomingFriendDto> findIncomingSummaries(
            @Param("email") String email,
            @Param("status") FriendshipStatus status
    );

}
