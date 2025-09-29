package com.springboot.be.repository;

import com.springboot.be.entity.TravelPath;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TravelPathRepository extends JpaRepository<TravelPath, Long> {
    @Query(value = """
                SELECT DISTINCT t.*
                FROM travel_path t
                JOIN travel_path_point tp ON t.id = tp.travel_path_id
                JOIN marker m ON tp.marker_id = m.id
                JOIN global_place g ON m.global_place_id = g.id
                WHERE (
                    6371 * acos(
                        cos(radians(:lat)) * cos(radians(g.latitude)) *
                        cos(radians(g.longitude) - radians(:lng)) +
                        sin(radians(:lat)) * sin(radians(g.latitude))
                    )
                ) <= :radius
            """, nativeQuery = true)
    List<TravelPath> findRecommendedByLocation(@Param("lat") double lat,
                                               @Param("lng") double lng,
                                               @Param("radius") double radius);

    Optional<TravelPath> findByPost_Id(Long postId);

    boolean existsByPost_Id(Long postId);
}
