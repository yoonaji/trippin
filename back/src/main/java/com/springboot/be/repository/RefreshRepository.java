package com.springboot.be.repository;

import com.springboot.be.entity.RefreshEntity;
import com.springboot.be.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RefreshRepository extends JpaRepository<RefreshEntity, Long> {

    Optional<RefreshEntity> findByUser(User user);
    void deleteByUser(User user);

}
