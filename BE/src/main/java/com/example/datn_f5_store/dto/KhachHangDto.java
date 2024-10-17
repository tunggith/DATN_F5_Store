package com.example.datn_f5_store.dto;

import com.example.datn_f5_store.entity.DiaChiKhachHangEntity;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class KhachHangDto {
    private Integer id;
    private String ma;
    private String ten;
    private String gioiTinh;
    private Date ngayThangNamSinh;
    private String email;
    private String anh;
    private String sdt;
    private String userName;
    private String password;
    private String trangThai;
}
