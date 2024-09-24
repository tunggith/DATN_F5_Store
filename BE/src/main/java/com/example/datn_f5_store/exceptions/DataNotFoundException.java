package com.example.datn_f5_store.exceptions;

public class  DataNotFoundException extends Exception{
    public DataNotFoundException(String message) {
        super(message);
    }
    public class VoucherAlreadyExistsException extends RuntimeException {
        public VoucherAlreadyExistsException(String message) {
            super(message);
        }
    }
}
