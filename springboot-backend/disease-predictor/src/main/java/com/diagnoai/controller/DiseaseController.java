package com.diagnoai.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import com.diagnoai.entity.DiseaseType;
import com.diagnoai.service.TestReportService;
import com.diagnoai.service.UserPrincipal;
import com.fasterxml.jackson.databind.ObjectMapper;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/predict")
public class DiseaseController {

    private final RestTemplate restTemplate;

    @Autowired(required = false)
    private TestReportService testReportService;

    @Autowired(required = false)
    private ObjectMapper objectMapper;

    public DiseaseController(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    @PostMapping("/diabetes")
    public ResponseEntity<?> predictDiabetes(@RequestBody Map<String, Object> input) {
        return forwardToFlask("/predict/diabetes", input, DiseaseType.DIABETES);
    }

    @PostMapping("/heart")
    public ResponseEntity<?> predictHeart(@RequestBody Map<String, Object> input) {
        return forwardToFlask("/predict/heart", input, DiseaseType.HEART);
    }

    @PostMapping("/stroke")
    public ResponseEntity<?> predictStroke(@RequestBody Map<String, Object> input) {
        return forwardToFlask("/predict/stroke", input, DiseaseType.STROKE);
    }

    @PostMapping("/parkinsons")
    public ResponseEntity<?> predictParkinsons(@RequestBody Map<String, Object> input) {
        return forwardToFlask("/predict/parkinsons", input, DiseaseType.PARKINSONS);
    }

    private ResponseEntity<?> forwardToFlask(String path, Map<String, Object> payload, DiseaseType diseaseType) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<Map<String, Object>> request = new HttpEntity<>(payload, headers);
            String flaskBaseUrl = "http://127.0.0.1:5000";
            ResponseEntity<Map> response = restTemplate.postForEntity(flaskBaseUrl + path, request, Map.class);

            // Try to save to database if user is authenticated and services are available
            try {
                Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
                if (authentication != null && authentication.isAuthenticated()
                        && !"anonymousUser".equals(authentication.getPrincipal())
                        && testReportService != null && objectMapper != null) {

                    UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
                    Map<String, Object> flaskResponse = response.getBody();

                    if (flaskResponse != null && flaskResponse.containsKey("prediction")) {
                        Integer predictionResult = (Integer) flaskResponse.get("prediction");
                        Double probability = flaskResponse.get("probability") != null
                                ? ((Number) flaskResponse.get("probability")).doubleValue() : null;

                        String predictionMessage = createPredictionMessage(diseaseType, predictionResult, probability);
                        String inputDataJson;
                        try {
                            inputDataJson = objectMapper.writeValueAsString(payload);
                        } catch (com.fasterxml.jackson.core.JsonProcessingException e) {
                            inputDataJson = payload.toString();
                        }

                        testReportService.saveTestReport(
                                userPrincipal.getId(),
                                diseaseType,
                                predictionResult,
                                probability,
                                inputDataJson,
                                predictionMessage
                        );

                        // Add message to response
                        flaskResponse.put("message", predictionMessage);
                    }
                }
            } catch (DataAccessException | IllegalArgumentException saveException) {
                // Log the error but don't fail the prediction
                System.err.println("Failed to save test report: " + saveException.getMessage());
            }

            return ResponseEntity.ok(response.getBody());
        } catch (org.springframework.web.client.RestClientException e) {
            String errorMessage = "Failed to call Flask ML API. Please ensure the Flask server is running on port 5000. Error: " + e.getMessage();
            System.err.println("Flask API Error: " + errorMessage);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.<String, String>of("error", errorMessage,
                            "suggestion", "Please start the Flask ML API server by running 'python app.py' in the flask-ml-api/ml directory"));
        } catch (RuntimeException e) {
            String errorMessage = "Unexpected error occurred: " + e.getMessage();
            System.err.println("Unexpected Error: " + errorMessage);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.<String, String>of("error", errorMessage));
        }
    }

    private String createPredictionMessage(DiseaseType diseaseType, Integer prediction, Double probability) {
        String diseaseName = diseaseType.name().toLowerCase();
        if (prediction == 1) {
            String probText = probability != null ? String.format(" (%.1f%% probability)", probability * 100) : "";
            return "Based on the provided data, there are indicators suggesting a risk for " + diseaseName + probText
                    + ". Please consult with a healthcare professional for proper diagnosis and treatment.";
        } else {
            String probText = probability != null ? String.format(" (%.1f%% probability)", (1 - probability) * 100) : "";
            return "Based on the provided data, the risk for " + diseaseName + " appears to be low" + probText
                    + ". However, regular health checkups are always recommended.";
        }
    }
}
