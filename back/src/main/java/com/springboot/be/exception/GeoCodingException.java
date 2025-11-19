package com.springboot.be.exception;

public class GeoCodingException extends RuntimeException {
    public GeoCodingException(String message) {
        super(message);
    }

    public GeoCodingException(String message, Throwable cause) {
        super(message, cause);
    }
}
