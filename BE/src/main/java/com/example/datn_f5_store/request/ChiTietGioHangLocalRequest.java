package com.example.datn_f5_store.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChiTietGioHangLocalRequest {
    private Integer idGioHang;
    private Integer idChiTietSanPham;
    private Integer soLuong;
    private String trangThai;
}
