package com.springboot.be.dto.response;

import com.springboot.be.entity.User;

import java.time.LocalDate;

public record UserDto(
        Long id,
        String email,
        String username,
        String role,
        String profileImage,
        LocalDate birthDate,
        Integer age,
        String gender
) {
    public static UserDto from(User user) {
        return new UserDto(
                user.getId(),
                user.getEmail(),
                user.getUsername(),
                user.getRole(),
                user.getProfileImage(),
                user.getBirthDate(),
                user.getAge(),
                user.getGender()
        );
    }
}
