package com.diagnoai.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.diagnoai.dto.MessageResponse;
import com.diagnoai.entity.DiseaseType;
import com.diagnoai.entity.TestReport;
import com.diagnoai.entity.User;
import com.diagnoai.entity.UserRole;
import com.diagnoai.repository.UserRepository;
import com.diagnoai.service.TestReportService;
import com.diagnoai.service.UserPrincipal;

import lombok.RequiredArgsConstructor;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class TestReportController {

    private final TestReportService testReportService;
    private final UserRepository userRepository;

    @GetMapping("/my-reports")
    public ResponseEntity<?> getMyTestReports() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();

            // Use role-based access: relatives can see reports of users who added them
            List<TestReport> reports = testReportService.getAccessibleTestReports(userPrincipal.getId());

            if (reports == null) {
                reports = new ArrayList<>();
            }

            List<TestReportResponse> reportResponses = reports.stream()
                    .map(TestReportResponse::new)
                    .collect(Collectors.toList());

            return ResponseEntity.ok(reportResponses);
        } catch (Exception e) {
            System.err.println("Error in getMyTestReports: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error retrieving reports: " + e.getMessage()));
        }
    }

    @GetMapping("/accessible-reports")
    public ResponseEntity<?> getAccessibleTestReports() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();

            List<TestReport> reports = testReportService.getAccessibleTestReports(userPrincipal.getId());
            List<TestReportResponse> reportResponses = reports.stream()
                    .map(TestReportResponse::new)
                    .collect(Collectors.toList());

            return ResponseEntity.ok(reportResponses);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error: " + e.getMessage()));
        }
    }

    @GetMapping("/by-disease/{diseaseType}")
    public ResponseEntity<?> getTestReportsByDisease(@PathVariable String diseaseType) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();

            DiseaseType disease = DiseaseType.valueOf(diseaseType.toUpperCase());
            List<TestReport> reports = testReportService.getUserTestReportsByDisease(userPrincipal.getId(), disease);
            List<TestReportResponse> reportResponses = reports.stream()
                    .map(TestReportResponse::new)
                    .collect(Collectors.toList());

            return ResponseEntity.ok(reportResponses);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error: " + e.getMessage()));
        }
    }

    @GetMapping("/{reportId}")
    public ResponseEntity<?> getTestReport(@PathVariable Long reportId) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();

            if (!testReportService.hasAccessToReport(userPrincipal.getId(), reportId)) {
                return ResponseEntity.badRequest()
                        .body(new MessageResponse("Error: Access denied to this report"));
            }

            TestReport report = testReportService.getTestReportById(reportId)
                    .orElseThrow(() -> new RuntimeException("Report not found"));

            return ResponseEntity.ok(new TestReportResponse(report));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error: " + e.getMessage()));
        }
    }

    @GetMapping("/stats/count")
    public ResponseEntity<?> getTestCount() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();

            // Use role-based count that includes accessible reports
            Long count = testReportService.getAccessibleTestReportsCount(userPrincipal.getId());

            if (count == null) {
                count = 0L;
            }

            return ResponseEntity.ok(new TestCountResponse(count));
        } catch (Exception e) {
            System.err.println("Error in getTestCount: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.ok(new TestCountResponse(0L));
        }
    }

    @PostMapping("/save")
    public ResponseEntity<?> saveTestReport(@RequestBody SaveReportRequest request) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();

            // Check if user is a main user (only main users can save reports)
            User user = userRepository.findById(userPrincipal.getId())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            if (user.getRole() != UserRole.USER) {
                return ResponseEntity.badRequest()
                        .body(new MessageResponse("Error: Only main users can save health assessments."));
            }

            DiseaseType diseaseType = DiseaseType.valueOf(request.diseaseType.toUpperCase());

            TestReport savedReport = testReportService.saveTestReport(
                    userPrincipal.getId(),
                    diseaseType,
                    request.predictionResult,
                    request.probability,
                    request.inputData,
                    request.predictionMessage
            );

            return ResponseEntity.ok(new TestReportResponse(savedReport));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error: " + e.getMessage()));
        }
    }

    // Response DTOs
    public static class TestReportResponse {

        public Long id;
        public String diseaseType;
        public Integer predictionResult;
        public Double probability;
        public String inputData;
        public String predictionMessage;
        public String createdAt;
        public String userName;
        public String userEmail;

        public TestReportResponse(TestReport report) {
            this.id = report.getId();
            this.diseaseType = report.getDiseaseType().name();
            this.predictionResult = report.getPredictionResult();
            this.probability = report.getProbability();
            this.inputData = report.getInputData();
            this.predictionMessage = report.getPredictionMessage();
            this.createdAt = report.getCreatedAt().toString();
            this.userName = report.getUser().getFullName();
            this.userEmail = report.getUser().getEmail();
        }
    }

    public static class TestCountResponse {

        public Long count;

        public TestCountResponse(Long count) {
            this.count = count;
        }
    }

    public static class SaveReportRequest {

        public String diseaseType;
        public Integer predictionResult;
        public Double probability;
        public String inputData;
        public String predictionMessage;
    }
}
