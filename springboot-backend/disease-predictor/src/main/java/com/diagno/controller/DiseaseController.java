package com.diagno.controller;

import org.springframework.http.*;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import java.util.Map;
@RestController
@RequestMapping("/api/predict")
public class DiseaseController {
    private final RestTemplate restTemplate;

    public DiseaseController(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    @PostMapping("/diabetes")
    public ResponseEntity<?> predictDiabetes(@RequestBody Map<String, Object> input) {
        return forwardToFlask("/predict/diabetes", input);
    }

    @PostMapping("/heart")
    public ResponseEntity<?> predictHeart(@RequestBody Map<String, Object> input) {
        return forwardToFlask("/predict/heart", input);
    }

    @PostMapping("/stroke")
    public ResponseEntity<?> predictStroke(@RequestBody Map<String, Object> input) {
        return forwardToFlask("/predict/stroke", input);
    }

    @PostMapping("/parkinsons")
    public ResponseEntity<?> predictParkinsons(@RequestBody Map<String, Object> input) {
        return forwardToFlask("/predict/parkinsons", input);
    }

    private ResponseEntity<?> forwardToFlask(String path, Map<String, Object> payload) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<Map<String, Object>> request = new HttpEntity<>(payload, headers);
            String flaskBaseUrl = "http://127.0.0.1:5000";
            ResponseEntity<Map> response = restTemplate.postForEntity(flaskBaseUrl + path, request, Map.class);
            return ResponseEntity.ok(response.getBody());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to call Flask: " + e.getMessage()));
        }
    }
}
