package com.springboot.be.repository;

import com.springboot.be.dto.response.MarkerSummaryDto;
import com.springboot.be.entity.TravelPathPoint;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TravelPathPointRepository extends JpaRepository<TravelPathPoint, Long> {

    @Query("""
                SELECT new com.springboot.be.dto.response.MarkerSummaryDto(
                            m.id,
                            gp.placeName,
                            gp.latitude,
                            gp.longitude,
                            m.photoCount,
                            tpp.sequence
                )
                FROM TravelPathPoint tpp
                JOIN tpp.marker m
                JOIN m.globalPlace gp
                WHERE tpp.travelPath.id = :travelPathId
                ORDER BY tpp.sequence ASC
            """)
    List<MarkerSummaryDto> findMarkerByTravelPath(@Param("travelPathId") Long travelPathId);

    boolean existsByMarker_Id(Long markerId);
}
