package com.springboot.be.repository;

import com.springboot.be.entity.Comment;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Long> {
    @EntityGraph(attributePaths = "user")
    List<Comment> findByPhoto_IdOrderByCreatedAtAsc(Long photoId);

    List<Comment> findByUserId(Long userId);
}
