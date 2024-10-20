package com.example.datn_f5_store.configuration;

import org.apache.coyote.BadRequestException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<String> handleIllegalArgument(IllegalArgumentException ex) {
        return new ResponseEntity<>(ex.getMessage(), HttpStatus.BAD_REQUEST);
    }
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<String> runtime(RuntimeException re){
        return new ResponseEntity<>(re.getMessage(),HttpStatus.BAD_REQUEST);
    }
    @ExceptionHandler(NullPointerException.class)
    public ResponseEntity<String> handleAuthenticationException(NullPointerException ex) {
        return new ResponseEntity<>(ex.getMessage(), HttpStatus.NOT_FOUND);
    }
    @ExceptionHandler(BadRequestException.class)
    public ResponseEntity<String> badRequest(BadRequestException be){
        return new ResponseEntity<>(be.getMessage(),HttpStatus.BAD_REQUEST);
    }
}
