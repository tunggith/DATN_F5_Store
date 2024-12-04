package com.example.datn_f5_store.dto;

import lombok.*;

import java.util.Date;
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class ChiTietSanPhamDto {

    private Integer id;

    private String Ten_san_pham;

    private String  mauSac;

    private String size;

    private String ma;

    private String ten;

    private Double donGia;

    private Integer soLuong;

    private String trangThai;

    private Boolean checkKm;

    public ChiTietSanPhamDto(Integer id, String ma,Integer soLuong) {
        this.id = id;
        this.ma = ma;
        this.soLuong = soLuong;
    }
}
