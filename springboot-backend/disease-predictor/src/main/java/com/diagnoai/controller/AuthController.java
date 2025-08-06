package com.diagnoai.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.diagnoai.dto.AddRelativeRequest;
import com.diagnoai.dto.JwtResponse;
import com.diagnoai.dto.LoginRequest;
import com.diagnoai.dto.MessageResponse;
import com.diagnoai.dto.SignupRequest;
import com.diagnoai.entity.User;
import com.diagnoai.security.JwtUtils;
import com.diagnoai.service.UserPrincipal;
import com.diagnoai.service.UserService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserService userService;
    private final JwtUtils jwtUtils;

    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            // Validate role
            if (!loginRequest.getRole().equals("USER") && !loginRequest.getRole().equals("RELATIVE")) {
                return ResponseEntity.badRequest()
                        .body(new MessageResponse("Error: Invalid role specified!"));
            }

            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword())
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);

            UserPrincipal userDetails = (UserPrincipal) authentication.getPrincipal();
            User user = userService.findByUsername(userDetails.getUsername())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            // Check if the user's actual role matches the requested role
            if (!user.getRole().name().equals(loginRequest.getRole())) {
                return ResponseEntity.badRequest()
                        .body(new MessageResponse("Error: Invalid role for this account! Please select the correct role."));
            }

            // For relatives, check if they have access to any main user's data
            if (user.getRole().name().equals("RELATIVE")) {
                boolean hasAccess = userService.hasRelativeAccess(user.getId());
                if (!hasAccess) {
                    return ResponseEntity.badRequest()
                            .body(new MessageResponse("Error: No family members have added you as a relative yet."));
                }
            }

            String jwt = jwtUtils.generateJwtToken(authentication);

            return ResponseEntity.ok(new JwtResponse(jwt,
                    userDetails.getId(),
                    userDetails.getUsername(),
                    userDetails.getEmail(),
                    user.getFullName(),
                    user.getRole().name()));
        } catch (BadCredentialsException e) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error: Invalid username or password!"));
        } catch (org.springframework.security.core.AuthenticationException e) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error: Authentication failed!"));
        }
    }

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
        try {
            // Check if username already exists
            if (userService.findByUsername(signUpRequest.getUsername()).isPresent()) {
                return ResponseEntity.badRequest()
                        .body(new MessageResponse("Error: Username '" + signUpRequest.getUsername() + "' is already taken!"));
            }

            // Check if email already exists
            if (userService.findByEmail(signUpRequest.getEmail()).isPresent()) {
                return ResponseEntity.badRequest()
                        .body(new MessageResponse("Error: Email '" + signUpRequest.getEmail() + "' is already in use!"));
            }

            User user = userService.createUser(
                    signUpRequest.getUsername(),
                    signUpRequest.getFullName(),
                    signUpRequest.getEmail(),
                    signUpRequest.getPassword()
            );

            // Set additional fields if provided
            if (signUpRequest.getPhoneNumber() != null && !signUpRequest.getPhoneNumber().trim().isEmpty()) {
                user.setPhoneNumber(signUpRequest.getPhoneNumber());
            }
            if (signUpRequest.getGender() != null && !signUpRequest.getGender().trim().isEmpty()) {
                user.setGender(signUpRequest.getGender());
            }
            if (signUpRequest.getAge() != null) {
                user.setAge(signUpRequest.getAge());
            }
            if (signUpRequest.getMedicalHistory() != null && !signUpRequest.getMedicalHistory().trim().isEmpty()) {
                user.setMedicalHistory(signUpRequest.getMedicalHistory());
            }

            userService.updateUser(user);

            return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error: " + e.getMessage()));
        }
    }

    @PostMapping("/add-relative")
    public ResponseEntity<?> addRelative(@Valid @RequestBody AddRelativeRequest addRelativeRequest) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication == null || !authentication.isAuthenticated()
                    || "anonymousUser".equals(authentication.getPrincipal())) {
                return ResponseEntity.badRequest()
                        .body(new MessageResponse("Error: User must be authenticated to add relatives"));
            }

            UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();

            // Check if username already exists
            if (userService.findByUsername(addRelativeRequest.getUsername()).isPresent()) {
                return ResponseEntity.badRequest()
                        .body(new MessageResponse("Error: Username '" + addRelativeRequest.getUsername() + "' is already taken!"));
            }

            // Check if email already exists
            if (userService.findByEmail(addRelativeRequest.getEmail()).isPresent()) {
                return ResponseEntity.badRequest()
                        .body(new MessageResponse("Error: Email '" + addRelativeRequest.getEmail() + "' is already in use!"));
            }

            User mainUser = userService.findById(userPrincipal.getId())
                    .orElseThrow(() -> new RuntimeException("Main user not found"));

            User relative = userService.createRelativeUser(
                    addRelativeRequest.getUsername(),
                    addRelativeRequest.getFullName(),
                    addRelativeRequest.getEmail(),
                    addRelativeRequest.getPassword(),
                    mainUser
            );

            // Set additional fields if provided
            if (addRelativeRequest.getPhoneNumber() != null && !addRelativeRequest.getPhoneNumber().trim().isEmpty()) {
                relative.setPhoneNumber(addRelativeRequest.getPhoneNumber());
            }
            if (addRelativeRequest.getGender() != null && !addRelativeRequest.getGender().trim().isEmpty()) {
                relative.setGender(addRelativeRequest.getGender());
            }
            if (addRelativeRequest.getAge() != null) {
                relative.setAge(addRelativeRequest.getAge());
            }

            userService.updateUser(relative);

            return ResponseEntity.ok(new MessageResponse("Relative added successfully!"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error: " + e.getMessage()));
        }
    }
}
