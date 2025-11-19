package com.springboot.be.service;

import com.springboot.be.dto.request.SurveyRequestDto;
import com.springboot.be.entity.PlaceInfo;
import com.springboot.be.entity.Survey;
import com.springboot.be.repository.SurveyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SurveyService {

    private final SurveyRepository surveyRepository;
    private final AiService aiService;

    public List<PlaceInfo> processSurvey(SurveyRequestDto requestDto) {
        // 1️⃣ 설문 저장
        Survey survey = Survey.builder()
                .regions(String.join(",", requestDto.getRegions()))
                .theme(String.join(",", requestDto.getTheme()))
                .companionType(requestDto.getCompanionType())
                .build();
        surveyRepository.save(survey);

        // 2️⃣ AI로부터 추천받기
        return aiService.getRecommendations(requestDto);
    }
}
