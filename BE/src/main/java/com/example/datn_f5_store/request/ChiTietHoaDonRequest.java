package com.example.datn_f5_store.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.web.bind.annotation.GetMapping;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ChiTietHoaDonRequest {
    private Integer id;
    private Integer hoaDon;
    private Integer chiTietSanPham;
    private String ma;
    private Integer soLuong;
    private Double giaSpctHienTai;
    private String trangThai;
}
