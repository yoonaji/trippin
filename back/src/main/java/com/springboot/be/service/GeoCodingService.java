package com.springboot.be.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.springboot.be.entity.PlaceInfo;
import com.springboot.be.exception.GeoCodingException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.net.URLEncoder;

@Service
public class GeoCodingService {

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    @Value("${google.api.key}")
    private String googleApiKey;

    public GeoCodingService() {
        this.restTemplate = new RestTemplate();
        this.objectMapper = new ObjectMapper();
    }

    public String reverseGeocoding(Double lat, Double lon) {
        try {
            String url = String.format(
                    "https://maps.googleapis.com/maps/api/geocode/json?latlng=%f,%f&key=%s",
                    lat, lon, googleApiKey
            );

            ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);
            JsonNode root = objectMapper.readTree(response.getBody());

            String status = root.path("status").asText();
            if (!"OK".equals(status)) {
                throw new GeoCodingException("Google API status: " + status);
            }

            JsonNode results = root.path("results");
            if (results.isArray() && !results.isEmpty()) {
                return results.get(0).path("formatted_address").asText();
            }

            throw new GeoCodingException("주소를 찾을 수 없습니다.");

        } catch (Exception e) {
            throw new GeoCodingException("주소 변환 중 오류", e);
        }
    }

    public PlaceInfo forwardGeocoding(String address) {
        try {
            String url = String.format(
                    "https://maps.googleapis.com/maps/api/geocode/json?address=%s&key=%s",
                    URLEncoder.encode(address, "UTF-8"), googleApiKey
            );
            ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);
            JsonNode root = objectMapper.readTree(response.getBody());

            String status = root.path("status").asText();
            if (!"OK".equals(status)) {
                throw new GeoCodingException("Google API status: " + status);
            }

            JsonNode results = root.path("results");
            if (results.isArray() && !results.isEmpty()) {
                JsonNode location = results.get(0).path("geometry").path("location");
                double lat = location.get("lat").asDouble();
                double lng = location.get("lng").asDouble();

                String formattedAddress = results.get(0).path("formatted_address").asText();
                return new PlaceInfo(formattedAddress, lat, lng);
            }

            throw new GeoCodingException("좌표를 찾을 수 없습니다.");
        } catch (Exception e) {
            throw new GeoCodingException("좌표 변환 중 오류", e);
        }
    }
}
