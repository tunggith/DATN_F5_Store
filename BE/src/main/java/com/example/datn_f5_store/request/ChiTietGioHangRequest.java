package com.example.datn_f5_store.request;

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
public class ChiTietGioHangRequest {
    private Integer id;
    private Integer idGioHang;
    private Integer idChiTietSanPham;
    private Integer soLuong;
}
