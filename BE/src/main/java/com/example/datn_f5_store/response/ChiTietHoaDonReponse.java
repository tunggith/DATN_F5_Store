package com.example.datn_f5_store.response;


import com.example.datn_f5_store.entity.ChiTietSanPhamEntity;
import com.example.datn_f5_store.entity.HoaDonEntity;
import lombok.Data;

@Data
public class ChiTietHoaDonReponse {

    private Integer id;

    private HoaDonEntity hoaDon;


    private ChiTietSanPhamEntity chiTietSanPham;

    private String ma;

    private Integer soLuong;

    private Double giaSpctHienTai;

    private String trangThai;
}



