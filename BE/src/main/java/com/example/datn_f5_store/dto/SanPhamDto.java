package com.example.datn_f5_store.dto;

import com.example.datn_f5_store.entity.TheLoaiEntity;
import com.example.datn_f5_store.entity.ThuongHieuEntity;
import com.example.datn_f5_store.entity.XuatXuEntity;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SanPhamDto {
    private Integer id;
    private String ma;
    private String ten;
    private XuatXuEntity xuatXu;
    private ThuongHieuEntity thuongHieu;
    private TheLoaiEntity theLoai;
    private String trangThai;
}
