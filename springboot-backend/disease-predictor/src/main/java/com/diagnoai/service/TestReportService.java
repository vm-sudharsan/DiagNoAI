package com.diagnoai.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.diagnoai.entity.DiseaseType;
import com.diagnoai.entity.TestReport;
import com.diagnoai.entity.User;
import com.diagnoai.entity.UserRole;
import com.diagnoai.repository.TestReportRepository;
import com.diagnoai.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class TestReportService {

    private final TestReportRepository testReportRepository;
    private final UserRepository userRepository;

    public TestReport saveTestReport(Long userId, DiseaseType diseaseType,
            Integer predictionResult, Double probability,
            String inputData, String predictionMessage) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        TestReport testReport = new TestReport(user, diseaseType, predictionResult,
                probability, inputData, predictionMessage);

        return testReportRepository.save(testReport);
    }

    public List<TestReport> getUserTestReports(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return testReportRepository.findByUserOrderByCreatedAtDesc(user);
    }

    public List<TestReport> getUserTestReportsByDisease(Long userId, DiseaseType diseaseType) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return testReportRepository.findByUserAndDiseaseTypeOrderByCreatedAtDesc(user, diseaseType);
    }

    public List<TestReport> getAccessibleTestReports(Long requesterId) {
        try {
            User requester = userRepository.findById(requesterId)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            Set<Long> accessibleUserIds = new HashSet<>();

            // Always include the requester's own ID
            accessibleUserIds.add(requesterId);

            // If user is a main USER, add their relatives' IDs
            if (requester.getRole() == UserRole.USER) {
                try {
                    List<User> relatives = userRepository.findRelativesByUserId(requesterId);
                    if (relatives != null) {
                        for (User relative : relatives) {
                            accessibleUserIds.add(relative.getId());
                        }
                    }
                } catch (Exception e) {
                    System.err.println("Error getting relatives for user " + requesterId + ": " + e.getMessage());
                }
            }

            // If user is a RELATIVE, add IDs of users who added them as relative
            if (requester.getRole() == UserRole.RELATIVE) {
                try {
                    List<User> mainUsers = userRepository.findUsersWhoHaveAsRelative(requesterId);
                    if (mainUsers != null) {
                        for (User mainUser : mainUsers) {
                            accessibleUserIds.add(mainUser.getId());
                        }
                    }
                } catch (Exception e) {
                    System.err.println("Error getting main users for relative " + requesterId + ": " + e.getMessage());
                }
            }

            // Get all reports for accessible user IDs in one query
            if (accessibleUserIds.isEmpty()) {
                return new ArrayList<>();
            }

            List<Long> userIdsList = new ArrayList<>(accessibleUserIds);
            List<TestReport> reports = testReportRepository.findByUserIdsOrderByCreatedAtDesc(userIdsList);

            return reports != null ? reports : new ArrayList<>();

        } catch (Exception e) {
            System.err.println("Error getting accessible test reports for user " + requesterId + ": " + e.getMessage());
            e.printStackTrace();
            return new ArrayList<>();
        }
    }

    public Optional<TestReport> getTestReportById(Long reportId) {
        return testReportRepository.findById(reportId);
    }

    public boolean hasAccessToReport(Long userId, Long reportId) {
        Optional<TestReport> reportOpt = testReportRepository.findById(reportId);
        if (reportOpt.isEmpty()) {
            return false;
        }

        TestReport report = reportOpt.get();
        Long reportUserId = report.getUser().getId();

        // Check if user owns the report
        if (userId.equals(reportUserId)) {
            return true;
        }

        // Check if user has access through relatives relationship
        List<Long> relativeIds = userRepository.findRelativesByUserId(userId).stream()
                .map(User::getId)
                .collect(Collectors.toList());

        return relativeIds.contains(reportUserId);
    }

    public Long getUserTestCount(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return testReportRepository.countByUser(user);
    }

    /**
     * Get count of accessible test reports based on user role
     *
     * @param userId The user ID
     * @return Count of accessible reports
     */
    public Long getAccessibleTestReportsCount(Long userId) {
        try {
            List<TestReport> accessibleReports = getAccessibleTestReports(userId);
            return accessibleReports != null ? (long) accessibleReports.size() : 0L;
        } catch (Exception e) {
            // Log the error and return 0 instead of throwing
            System.err.println("Error getting accessible test reports count for user " + userId + ": " + e.getMessage());
            e.printStackTrace();
            return 0L;
        }
    }

    public Long getUserTestCountByDisease(Long userId, DiseaseType diseaseType) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return testReportRepository.countByUserAndDiseaseType(user, diseaseType);
    }

    public List<TestReport> getUserTestReportsByDateRange(Long userId, LocalDateTime startDate, LocalDateTime endDate) {
        return testReportRepository.findByUserIdAndDateRangeOrderByCreatedAtDesc(userId, startDate, endDate);
    }
}
