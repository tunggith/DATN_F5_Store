package com.example.datn_f5_store.dto;

import com.example.datn_f5_store.entity.ChiTietSanPhamEntity;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class AnhChiTietSanPhamDto {
    private Integer id;
    private ChiTietSanPhamEntity chiTietSanPham;
    private String urlAnh;
}
