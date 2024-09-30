package com.example.datn_f5_store.request;

import com.example.datn_f5_store.entity.ChiTietSanPhamEntity;
import com.example.datn_f5_store.entity.KhuyenMaiEntity;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class KhuyenMaiChiTietSanPhamRequest {
    private Integer id;
    private KhuyenMaiEntity khuyenMai;
    private ChiTietSanPhamEntity chiTietSanPham;
    private String trangThai;
}
