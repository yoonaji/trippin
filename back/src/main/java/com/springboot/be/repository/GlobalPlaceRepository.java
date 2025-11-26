package com.springboot.be.repository;

import com.springboot.be.entity.GlobalPlace;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface GlobalPlaceRepository extends JpaRepository<GlobalPlace, Long> {
    Optional<GlobalPlace> findByPlaceNameIgnoreCase(String placeName);
}
