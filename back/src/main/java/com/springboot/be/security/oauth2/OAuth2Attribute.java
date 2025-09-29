package com.springboot.be.security.oauth2;

import lombok.Getter;

import java.time.LocalDate;
import java.time.Period;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Map;


@Getter
public class OAuth2Attribute {
    public String provider;
    public String providerId;
    public String email;
    private final String name;
    private final LocalDate birthDate;
    private final String gender;
    private final Integer age;
    private final Map<String, Object> attributes;

    private OAuth2Attribute(String provider, String providerId, String email, String name, LocalDate birthDate, String gender, Integer age, Map<String, Object> attributes) {
        this.provider = provider;
        this.providerId = providerId;
        this.email = email;
        this.name = name;
        this.birthDate = birthDate;
        this.gender = gender;
        this.age = age;
        this.attributes = attributes;
    }

    public static OAuth2Attribute of(String provider, String userNameAttributeName, Map<String, Object> attributes) {
        switch (provider) {
            case "google":
                return ofGoogle(userNameAttributeName, attributes);

            case "naver":
                return ofNaver(userNameAttributeName, (Map<String, Object>) attributes.get("response"));
            case "kakao":
                return ofKaKao(userNameAttributeName, attributes);
            default:
                throw new IllegalArgumentException("Unknown provider " + provider);
        }
    }

    private static OAuth2Attribute ofGoogle(String userNameAttributeName, Map<String, Object> attributes) {
        return new OAuth2Attribute("google",
                (String) attributes.get("sub"),
                (String) attributes.get("email"),
                (String) attributes.get("name"),
                null,
                null,
                null,
                attributes);
    }

    private static OAuth2Attribute ofNaver(String userNameAttributeName, Map<String, Object> response) {
        String birthyear = (String) response.get("birthyear"); // "2003"
        String birthday = ((String) response.get("birthday")).replace("-", ""); // "07-27" → "0727"
        LocalDate birthDate = null;
        Integer age = null;

        if (birthyear != null && birthday != null) {
            birthDate = LocalDate.parse(birthyear + birthday, DateTimeFormatter.ofPattern("yyyyMMdd"));
            age = Period.between(birthDate, LocalDate.now()).getYears();
        }

        String gender = (String) response.get("gender"); // "M" or "F"

        return new OAuth2Attribute("naver",
                (String) response.get("id"),
                (String) response.get("email"),
                (String) response.get("name"),
                birthDate,
                gender,
                age,
                response);
    }

    private static OAuth2Attribute ofKaKao(String userNameAttributeName, Map<String, Object> attributes) {
        Map<String, Object> kakaoAccount = (Map<String, Object>) attributes.get("kakao_account");
        Map<String, Object> profile = (Map<String, Object>) kakaoAccount.get("profile");

        String birthyear = (String) kakaoAccount.get("birthyear"); // "2003"
        String birthday = (String) kakaoAccount.get("birthday");   // "0727"
        LocalDate birthDate = null;
        Integer age = null;

        if (birthyear != null && birthday != null) {
            birthDate = LocalDate.parse(birthyear + birthday, DateTimeFormatter.ofPattern("yyyyMMdd"));
            age = Period.between(birthDate, LocalDate.now()).getYears();
        }

        String gender = (String) kakaoAccount.get("gender"); // "male" or "female"


        return new OAuth2Attribute("kakao",
                String.valueOf(attributes.get("id")),
                (String) kakaoAccount.get("email"),
                (String) profile.get("nickname"),
                birthDate,
                gender,
                age,
                attributes);
    }

    public Map<String, Object> convertToMap(){
        Map<String, Object> map = new HashMap<>();
        map.put("provider", provider);
        map.put("providerId", providerId);
        map.put("email", email);
        map.put("name", name);
        map.put("birthDate", birthDate);
        map.put("gender", gender);
        map.put("age", age);
        return map;
    }

}

