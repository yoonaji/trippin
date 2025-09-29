package com.springboot.be.security.pwreset;

public record PasswordResetConfirmDto(String token, String newPassword) {}