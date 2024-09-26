package com.example.datn_f5_store.request;

import com.example.datn_f5_store.contanst.ConfigContanst;
import com.example.datn_f5_store.entity.KhachHangEntity;
import lombok.Data;

import java.util.Date;

import jakarta.validation.constraints.NotNull;
import java.util.Date;

@Data
public class GioHangRequest {
    @NotNull(message = "Khách hàng không được để trống")
    private KhachHangEntity KhachHang;

    @NotNull(message = "Thời gian tạo không được để trống")
    private Date thoiGianTao;
}
