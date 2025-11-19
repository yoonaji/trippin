package com.springboot.be.controller;

import com.springboot.be.dto.request.SurveyRequestDto;
import com.springboot.be.entity.PlaceInfo;
import com.springboot.be.service.SurveyService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/survey")
public class SurveyController {

    private final SurveyService surveyService;

    @PostMapping
    public ResponseEntity<List<PlaceInfo>> handleSurvey(@RequestBody SurveyRequestDto requestDto) {
        List<PlaceInfo> recommendations = surveyService.processSurvey(requestDto);
        return ResponseEntity.ok(recommendations);
    }
}
