package com.diagnoai.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LoginRequest {

    @NotBlank
    private String username;

    @NotBlank
    private String password;

    @NotBlank
    private String role; // "USER" or "RELATIVE"
}
