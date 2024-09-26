package com.example.datn_f5_store.request;

import com.example.datn_f5_store.contanst.ConfigContanst;
import jakarta.persistence.Column;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ThanhToanRequest {
    private Integer id;
    private String tenPhuongThuc;
    private Date thoiGianThanhToan;
    private String trangThai;
}
