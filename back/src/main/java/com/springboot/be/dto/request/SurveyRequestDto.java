package com.springboot.be.dto.request;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class SurveyRequestDto {
    private List<String> regions; // API 스펙은 List<String>으로 정의
    private List<String> theme;
    private String companionType;
}
