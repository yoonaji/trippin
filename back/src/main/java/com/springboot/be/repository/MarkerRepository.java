package com.springboot.be.repository;

import com.springboot.be.entity.GlobalPlace;
import com.springboot.be.entity.Marker;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface MarkerRepository extends JpaRepository<Marker, Long> {

    List<Marker> findByGlobalPlace_PlaceNameContaining(String keyword);

    @Query(value = """
            SELECT m.* FROM marker m
            JOIN global_place gp ON m.global_place_id = gp.id
            WHERE ST_DistanceSphere(
                ST_MakePoint(gp.longitude, gp.latitude),
                ST_MakePoint(:lng, :lat)
            ) < :radius
            """, nativeQuery = true)
    List<Marker> findWithinRadius(@Param("lat") double lat, @Param("lng") double lng, @Param("radius") double radius);
    
    List<Marker> findTop10ByOrderByPhotoCountDesc();

    Optional<Marker> findByGlobalPlace(GlobalPlace globalPlace);

}
