package com.example.datn_f5_store.request;

import jakarta.persistence.Column;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class DiaChiKhachHangResquest {
    private Integer id;
    private Integer idKhachHang;
    private String soNha;

    private String sdt;
    private String duong;
    private String phuongXa;

    private String quanHuyen;

    private String tinhThanh;

    private String quocGia;

    private String loaiDiaChi;

    private String trangThai;
}
