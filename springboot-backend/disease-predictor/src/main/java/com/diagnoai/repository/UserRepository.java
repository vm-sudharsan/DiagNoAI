package com.diagnoai.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.diagnoai.entity.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByUsername(String username);

    Optional<User> findByEmail(String email);

    Boolean existsByUsername(String username);

    Boolean existsByEmail(String email);

    List<User> findByIsActiveTrue();

    @Query("SELECT u FROM User u WHERE u.fullName LIKE %:name% AND u.isActive = true")
    List<User> findByFullNameContainingAndIsActiveTrue(@Param("name") String name);

    @Query("SELECT r FROM User u JOIN u.relatives r WHERE u.id = :userId")
    List<User> findRelativesByUserId(@Param("userId") Long userId);

    @Query("SELECT u FROM User u JOIN u.relatives r WHERE r.id = :userId")
    List<User> findUsersWhoHaveAsRelative(@Param("userId") Long userId);

    @Query("SELECT u FROM User u LEFT JOIN FETCH u.relatives WHERE u.id = :userId")
    Optional<User> findByIdWithRelatives(@Param("userId") Long userId);

    @Modifying
    @Query(value = "INSERT INTO user_relatives (user_id, relative_id) VALUES (:userId, :relativeId)", nativeQuery = true)
    void addRelativeRelationship(@Param("userId") Long userId, @Param("relativeId") Long relativeId);
}
