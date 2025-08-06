package com.diagnoai.repository;

import com.diagnoai.entity.DiseaseType;
import com.diagnoai.entity.TestReport;
import com.diagnoai.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TestReportRepository extends JpaRepository<TestReport, Long> {
    
    List<TestReport> findByUserOrderByCreatedAtDesc(User user);
    
    List<TestReport> findByUserAndDiseaseTypeOrderByCreatedAtDesc(User user, DiseaseType diseaseType);
    
    @Query("SELECT tr FROM TestReport tr WHERE tr.user.id = :userId ORDER BY tr.createdAt DESC")
    List<TestReport> findByUserIdOrderByCreatedAtDesc(@Param("userId") Long userId);
    
    @Query("SELECT tr FROM TestReport tr WHERE tr.user.id IN :userIds ORDER BY tr.createdAt DESC")
    List<TestReport> findByUserIdsOrderByCreatedAtDesc(@Param("userIds") List<Long> userIds);
    
    @Query("SELECT tr FROM TestReport tr WHERE tr.user.id = :userId AND tr.createdAt BETWEEN :startDate AND :endDate ORDER BY tr.createdAt DESC")
    List<TestReport> findByUserIdAndDateRangeOrderByCreatedAtDesc(
        @Param("userId") Long userId, 
        @Param("startDate") LocalDateTime startDate, 
        @Param("endDate") LocalDateTime endDate
    );
    
    Long countByUser(User user);
    
    Long countByUserAndDiseaseType(User user, DiseaseType diseaseType);
}
