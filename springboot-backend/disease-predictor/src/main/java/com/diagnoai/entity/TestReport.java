package com.diagnoai.entity;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "test_reports")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TestReport {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(name = "disease_type", nullable = false)
    private DiseaseType diseaseType;

    @Column(name = "prediction_result", nullable = false)
    private Integer predictionResult; // 0 or 1

    @Column(name = "probability")
    private Double probability;

    @Column(name = "input_data", columnDefinition = "TEXT")
    private String inputData; // JSON string of input parameters

    @Column(name = "prediction_message", columnDefinition = "TEXT")
    private String predictionMessage;

    @CreationTimestamp
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    // Constructor for creating new test report
    public TestReport(User user, DiseaseType diseaseType, Integer predictionResult,
            Double probability, String inputData, String predictionMessage) {
        this.user = user;
        this.diseaseType = diseaseType;
        this.predictionResult = predictionResult;
        this.probability = probability;
        this.inputData = inputData;
        this.predictionMessage = predictionMessage;
    }

    // Custom equals and hashCode to avoid issues with lazy-loaded collections
    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        TestReport that = (TestReport) o;
        return id != null && id.equals(that.id);
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }
}
