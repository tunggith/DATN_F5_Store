package com.example.datn_f5_store.dto;

import com.example.datn_f5_store.contanst.ConfigContanst;
import jakarta.persistence.Column;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class MauSacDto {
    private Integer id;
    private String ma;
    private String ten;
}
