package com.springboot.be.service;

import com.springboot.be.entity.PlaceInfo;
import com.springboot.be.dto.request.SurveyRequestDto;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
@RequiredArgsConstructor
public class AiService {

    @Value("${openai.api.key}")
    private String openaiApiKey;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    public List<PlaceInfo> getRecommendations(SurveyRequestDto dto) {
        // 1️⃣ 프롬프트 구성
        String prompt = buildPrompt(dto);

        // 2️⃣ 요청 헤더 구성
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(openaiApiKey);

        // 3️⃣ 요청 바디 구성
        Map<String, Object> body = Map.of(
                "model", "gpt-4o-mini",
                "messages", List.of(
                        Map.of("role", "system", "content", "You are a helpful travel recommendation assistant. Respond ONLY in valid JSON."),
                        Map.of("role", "user", "content", prompt)
                )
        );

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);

        // 4️⃣ OpenAI API 호출
        ResponseEntity<Map> response = restTemplate.postForEntity(
                "https://api.openai.com/v1/chat/completions",
                request,
                Map.class
        );

        // 5️⃣ 응답 파싱
        List<Map<String, Object>> choices = (List<Map<String, Object>>) response.getBody().get("choices");
        Map<String, Object> message = (Map<String, Object>) choices.get(0).get("message");
        String content = (String) message.get("content");

        if (content == null || content.isEmpty()) {
            throw new RuntimeException("AI 응답이 비어 있습니다.");
        }

        // 6️⃣ JSON → PlaceInfo 변환
        return parsePlaces(content);
    }

    private String buildPrompt(SurveyRequestDto dto) {
        return String.format("""
                사용자의 여행 설문 결과:
                - 선호 지역: %s
                - 선호 테마: %s
                - 동반자 유형: %s

                위 조건에 맞는 한국 여행지 3곳을 추천해줘.
                각 여행지는 아래 JSON 배열 형식으로만 반환해.
                [
                  {"formattedAddress": "서울특별시 성동구 서울숲길 1", "latitude": 37.5446, "longitude": 127.0370},
                  {"formattedAddress": "강릉시 안목해변", "latitude": 37.7724, "longitude": 128.9484}
                ]
                """,
                dto.getRegions(), dto.getTheme(), dto.getCompanionType());
    }

    private List<PlaceInfo> parsePlaces(String content) {
        try {
            // content가 JSON 문자열이므로 바로 DTO 리스트로 변환
            return Arrays.asList(objectMapper.readValue(content, PlaceInfo[].class));
        } catch (Exception e) {
            throw new RuntimeException("AI 응답 파싱 실패: " + e.getMessage() + "\n응답 내용: " + content);
        }
    }
}
