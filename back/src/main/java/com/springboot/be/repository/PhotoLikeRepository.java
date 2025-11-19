package com.springboot.be.repository;

import com.springboot.be.entity.Marker;
import com.springboot.be.entity.Photo;
import com.springboot.be.entity.PhotoLike;
import com.springboot.be.entity.User;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface PhotoLikeRepository extends JpaRepository<PhotoLike, Long> {

    @Query("""
                    SELECT distinct m
                    FROM PhotoLike pl
                    JOIN pl.photo p
                    JOIN p.marker m
                    WHERE pl.user.id = :userId
            """)
    List<Marker> findDistinctMarkersByUserId(@Param("userId") Long userId);

    @EntityGraph(attributePaths = {"photo.post", "photo.post.user"})
    @Query("""
                SELECT p
                FROM PhotoLike pl
                JOIN pl.photo p
                WHERE pl.user.id = :userId
                ORDER BY p.createdAt DESC, p.id DESC
            """)
    List<Photo> findPhotoLikedByUser(@Param("userId") Long userId);

    boolean existsByUserAndPhoto(User user, Photo photo);

    int deleteByUserAndPhoto(User user, Photo photo);
}
