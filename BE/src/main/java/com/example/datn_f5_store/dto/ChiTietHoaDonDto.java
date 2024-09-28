package com.example.datn_f5_store.dto;

import com.example.datn_f5_store.entity.ChiTietSanPhamEntity;
import com.example.datn_f5_store.entity.HoaDonEntity;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ChiTietHoaDonDto {
    private Integer id;
    private HoaDonEntity hoaDon;
    private ChiTietSanPhamEntity chiTietSanPham;
    private String ma;
    private Integer soLuong;
    private Double giaSpctHienTai;
    private String trangThai;
}
