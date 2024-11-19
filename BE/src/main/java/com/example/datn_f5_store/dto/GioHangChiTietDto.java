package com.example.datn_f5_store.dto;

import com.example.datn_f5_store.entity.AnhChiTietSanPham;
import com.example.datn_f5_store.entity.ChiTietSanPhamEntity;
import com.example.datn_f5_store.entity.GioHangEntity;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class GioHangChiTietDto {
    private Integer id;

    private GioHangEntity gioHang;

    private ChiTietSanPhamEntity chiTietSanPham;

    private Integer soLuong;
    private AnhChiTietSanPham urlAnh;
}
