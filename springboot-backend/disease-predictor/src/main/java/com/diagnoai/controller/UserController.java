package com.diagnoai.controller;

import com.diagnoai.dto.MessageResponse;
import com.diagnoai.entity.User;
import com.diagnoai.service.UserPrincipal;
import com.diagnoai.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {
    
    private final UserService userService;
    
    @GetMapping("/profile")
    public ResponseEntity<?> getUserProfile() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
            
            User user = userService.findById(userPrincipal.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));
            
            // Create a safe user response without password
            UserResponse userResponse = new UserResponse(user);
            
            return ResponseEntity.ok(userResponse);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new MessageResponse("Error: " + e.getMessage()));
        }
    }
    
    @GetMapping("/relatives")
    public ResponseEntity<?> getUserRelatives() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
            
            List<User> relatives = userService.getRelatives(userPrincipal.getId());
            List<UserResponse> relativeResponses = relatives.stream()
                .map(UserResponse::new)
                .collect(Collectors.toList());
            
            return ResponseEntity.ok(relativeResponses);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new MessageResponse("Error: " + e.getMessage()));
        }
    }
    
    @PostMapping("/relatives/{relativeId}/remove")
    public ResponseEntity<?> removeRelative(@PathVariable Long relativeId) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
            
            userService.removeRelative(userPrincipal.getId(), relativeId);
            
            return ResponseEntity.ok(new MessageResponse("Relative removed successfully!"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new MessageResponse("Error: " + e.getMessage()));
        }
    }
    
    @GetMapping("/search")
    public ResponseEntity<?> searchUsers(@RequestParam String name) {
        try {
            List<User> users = userService.searchUsersByName(name);
            List<UserResponse> userResponses = users.stream()
                .map(UserResponse::new)
                .collect(Collectors.toList());
            
            return ResponseEntity.ok(userResponses);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new MessageResponse("Error: " + e.getMessage()));
        }
    }
    
    // Inner class for safe user response
    public static class UserResponse {
        public Long id;
        public String username;
        public String fullName;
        public String email;
        public String phoneNumber;
        public String gender;
        public Integer age;
        public String role;
        public String createdAt;
        
        public UserResponse(User user) {
            this.id = user.getId();
            this.username = user.getUsername();
            this.fullName = user.getFullName();
            this.email = user.getEmail();
            this.phoneNumber = user.getPhoneNumber();
            this.gender = user.getGender();
            this.age = user.getAge();
            this.role = user.getRole().name();
            this.createdAt = user.getCreatedAt() != null ? user.getCreatedAt().toString() : null;
        }
    }
}
