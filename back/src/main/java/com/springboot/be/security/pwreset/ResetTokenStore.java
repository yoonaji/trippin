package com.springboot.be.security.pwreset;

import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class ResetTokenStore {

    private static final String KEY_PREFIX = "pwrest: ";
    private final StringRedisTemplate redis;

    public void save(String tokenHash, Long userId, Duration ttl) {
        String key = KEY_PREFIX + tokenHash;
        redis.opsForValue().set(key, String.valueOf(userId), ttl);
    }

    public Optional<Long> load(String tokenHash) {
        String key = KEY_PREFIX + tokenHash;
        String v = redis.opsForValue().get(key);
        return (v == null) ? Optional.empty() : Optional.of(Long.valueOf(v));
    }

    public void delete(String tokenHash) {
        redis.delete(KEY_PREFIX + tokenHash);
    }
}
