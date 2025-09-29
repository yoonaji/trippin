package com.springboot.be.security.exception;

import org.springframework.http.HttpStatus;

public abstract class ApiException extends RuntimeException {

    private final int status;
    private final String code;

    protected ApiException(String msg, int status, String code) {
        super(msg); this.status = status; this.code = code;
    }

    public int getStatus() { return status; }
    public String getCode() { return code; }

    public static ApiException badRequest(String code, String msg) {
        return new SimpleApiException(msg, HttpStatus.BAD_REQUEST.value(), code);
    }

    public static ApiException notFound(String code, String msg) {
        return new SimpleApiException(msg, HttpStatus.NOT_FOUND.value(), code);
    }

    public static ApiException conflict(String code, String msg) {
        return new SimpleApiException(msg, HttpStatus.CONFLICT.value(), code);
    }

    public static ApiException forbidden(String code, String msg) {
        return new SimpleApiException(msg, HttpStatus.FORBIDDEN.value(), code);
    }

    public static ApiException unauthorized(String code, String msg) {
        return new SimpleApiException(msg, HttpStatus.UNAUTHORIZED.value(), code);
    }

    public static ApiException internal(String code, String msg) {
        return new SimpleApiException(msg, HttpStatus.INTERNAL_SERVER_ERROR.value(), code);
    }

    // 내부적으로 쓸 간단한 구현체
    private static class SimpleApiException extends ApiException {
        private SimpleApiException(String msg, int status, String code) {
            super(msg, status, code);
        }
    }
}