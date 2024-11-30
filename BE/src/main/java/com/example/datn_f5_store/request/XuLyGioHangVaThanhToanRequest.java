package com.example.datn_f5_store.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
@Data
@NoArgsConstructor
@AllArgsConstructor
public class XuLyGioHangVaThanhToanRequest {

    private List<ChiTietGioHangRequest> gioHangRequests; // Danh sách sản phẩm giỏ hàng
    private ThanhToanRequest thanhToanRequest; // Thông tin thanh toán
}

