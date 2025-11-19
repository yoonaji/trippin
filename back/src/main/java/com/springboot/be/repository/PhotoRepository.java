package com.springboot.be.repository;

import com.springboot.be.dto.response.PopularPhotoDto;
import com.springboot.be.entity.Photo;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Map;

public interface PhotoRepository extends JpaRepository<Photo, Long> {

    @EntityGraph(attributePaths = {"post", "post.user"})
    @Query("""
                SELECT p
                FROM Photo p
                WHERE p.marker.id = :markerId
                ORDER BY p.createdAt DESC, p.id DESC
            """)
    List<Photo> findByMarker_IdOrderByCreatedAtDesc(@Param("markerId") Long markerId);

    boolean existsByMarker_Id(Long markerId);

    @Query("""
        SELECT p
        FROM Photo p
        JOIN FETCH p.post post
        JOIN FETCH post.user u
        JOIN FETCH p.marker m
        JOIN FETCH m.globalPlace gp
        ORDER BY (p.likeCount * 2 +
                 (SELECT COUNT(c) FROM Comment c WHERE c.photo.id = p.id)
        ) DESC
    """)
    List<Photo> findTopPopularPhotos();


    List<Photo> findTop3ByMarker_IdOrderByCreatedAtDesc(Long markerId);
}
