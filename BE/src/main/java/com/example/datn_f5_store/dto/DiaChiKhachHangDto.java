package com.example.datn_f5_store.dto;

import jakarta.persistence.Column;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
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

public class DiaChiKhachHangDto {
    private Integer id;
    private String soNha;
    private String duong;
    private String sdt;
    private String phuongXa;
    private String quanHuyen;
    private String tinhThanh;
    private String quocGia;

    private String loaiDiaChi;
    private String trangThai;
}
