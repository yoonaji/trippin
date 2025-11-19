package com.springboot.be.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.springboot.be.entity.PlaceInfo;
import com.springboot.be.exception.GeoCodingException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

@Service
public class GeoCodingService {

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Value("${google.api.key}")
    private String googleApiKey;

    public String reverseGeocoding(Double lat, Double lon) {
        try {
            String url = UriComponentsBuilder
                    .fromUriString("https://maps.googleapis.com/maps/api/geocode/json")
                    .queryParam("latlng", lat + "," + lon)
                    .queryParam("language", "ko")
                    .queryParam("key", googleApiKey)
                    .build()
                    .toUriString();

            ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);
            JsonNode root = objectMapper.readTree(response.getBody());

            String status = root.path("status").asText();
            String errMsg = root.path("error_message").asText("");

            if (!"OK".equals(status)) {
                throw new GeoCodingException("reverse Geocoding 실패: " + status + ", error = " + errMsg);
            }

            JsonNode results = root.path("results");
            if (results.isArray() && !results.isEmpty()) {
                return results.get(0).path("formatted_address").asText();
            }

            throw new GeoCodingException("주소를 찾을 수 없습니다.");

        } catch (GeoCodingException e) {
            throw e;
        } catch (Exception e) {
            throw new GeoCodingException("주소 변환 중 오류", e);
        }
    }

    public PlaceInfo forwardGeocoding(String address) {
        try {
            String url = UriComponentsBuilder
                    .fromUriString("https://maps.googleapis.com/maps/api/geocode/json")
                    .queryParam("address", address)
                    .queryParam("language", "ko")
                    .queryParam("key", googleApiKey)
                    .build().toUriString();

            ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);
            JsonNode root = objectMapper.readTree(response.getBody());

            String status = root.path("status").asText();
            String errMsg = root.path("error_message").asText();

            if (!"OK".equals(status)) {
                throw new GeoCodingException("Geocoding 실패: " + status + ", error = " + errMsg);
            }

            JsonNode results = root.path("results");
            if (!results.isArray() || results.isEmpty()) {
                throw new GeoCodingException("Geocoding 결과가 비었습니다.");
            }

            JsonNode loc = results.get(0).path("geometry").path("location");
            if (!loc.hasNonNull("lat") || !loc.hasNonNull("lng")) {
                throw new GeoCodingException("Geocoding 응답에 좌표가 없습니다.");
            }

            double lat = loc.get("lat").asDouble();
            double lng = loc.get("lng").asDouble();
            String formatted = results.get(0).path("formatted_address").asText(address);

            return new PlaceInfo(formatted, lat, lng);
        } catch (GeoCodingException e) {
            throw e;
        } catch (Exception e) {
            throw new GeoCodingException("좌표 변환 중 오류", e);
        }
    }
}
