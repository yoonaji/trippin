package com.springboot.be.dto.response;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class SurveyResponseDto {
    private int id;
    private Long userId; // User 엔티티 대신 ID 값만 포함
    private List<String> regions; // "서울,부산,제주" -> List<String> 변환
    private List<String> theme;
    private String companionType;
}
