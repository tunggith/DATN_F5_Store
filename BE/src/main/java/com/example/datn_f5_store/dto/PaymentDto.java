package com.example.datn_f5_store.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class PaymentDto {
    public String code;
    public String message;
    public String paymentUrl;
}
