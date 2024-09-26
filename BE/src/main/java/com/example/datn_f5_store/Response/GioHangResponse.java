package com.example.datn_f5_store.response;

import lombok.*;

import java.util.Date;

@Data
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class GioHangResponse {
    private Integer id;
    private String khachHang;
    private Date thoiGianTao;
}
