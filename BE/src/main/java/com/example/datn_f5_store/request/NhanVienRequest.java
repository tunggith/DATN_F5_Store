package com.example.datn_f5_store.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.util.Date;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class NhanVienRequest {
    private Integer id;
    private String ma;
    private String ten;
    private String gioiTinh;
    private Date ngayThangNamSinh;
    private String email;
    private String sdt;
    private String diaChi;
    private String anh;
    private String username;
    private String password;
    private String nguoiTao;
    private Date thoiGianTao;
    private String nguoiSua;
    private Date thoiGianSua;
    private String trangThai;
}
