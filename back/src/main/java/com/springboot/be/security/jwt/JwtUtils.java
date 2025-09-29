package com.springboot.be.security.jwt;

import com.springboot.be.security.exception.ApiException;
import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.time.Instant;
import java.util.Date;


@Component
public class JwtUtils {
    private static final Logger logger = LoggerFactory.getLogger(JwtUtils.class);

    @Value("${bezkoder.app.jwtSecret}") //application.yaml 에서 jwt 서명용 키 불러옴
    private String jwtSecret;

    public String generateToken(String username, String category, long expiration) {

        return Jwts.builder().setSubject(username).claim("category", category).setIssuedAt(new Date()).setExpiration(new Date((new Date()).getTime() + expiration)).signWith(key(), SignatureAlgorithm.HS256).compact();
    }

    public Instant getExpirationInstant(String token) {
        return Jwts.parserBuilder().setSigningKey(key()).build().parseClaimsJws(token).getBody().getExpiration().toInstant();
    }


    private Key key() {
        return Keys.hmacShaKeyFor(Decoders.BASE64.decode(jwtSecret));
    }

    public String getEmailFromJwtToken(String token) {
        return Jwts.parserBuilder().setSigningKey(key()).build().parseClaimsJws(token).getBody().getSubject();
    }

    public void validateJwtToken(String authToken) {
        try {
            Jwts.parserBuilder().setSigningKey(key()).build().parseClaimsJws(authToken);
//            return true;
        } catch (ExpiredJwtException e) {
            throw ApiException.unauthorized("TOKEN_EXPIRED", "토큰이 만료되었습니다.");
        } catch (UnsupportedJwtException e) {
            throw ApiException.unauthorized("TOKEN_INVALID", "유효하지 않은 토큰입니다.");
        }
    }

    public String getCategory(String token) {
        return Jwts.parserBuilder().setSigningKey(key()).build().parseClaimsJws(token).getBody().get("category", String.class);
    }
}
