package com.example.datn_f5_store.request;

import lombok.Data;

import java.util.Date;
@Data
public class ThongKeDoanhThuRequest {

    private Date startDate;
    private Date endDate;
    private Integer month; // Danh cho thong ke theo thang
    private Integer year;  // Danh cho thong ke theo nam
    private Integer quarter; // Danh cho thong ke theo quy
}
