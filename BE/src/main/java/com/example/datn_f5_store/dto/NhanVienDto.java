package com.example.datn_f5_store.dto;

import com.example.datn_f5_store.contanst.ConfigContanst;
import jakarta.persistence.Column;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class NhanVienDto {

    private Integer id;
    private String ma;
    private String ten;
    private String gioiTinh;
    private Date ngayThangNamSinh;
    private String email;
    private String sdt;
    private String diaChi;
    private String anh;
    private String roles;
    private String username;
    private String password;
    private String nguoiTao;
    private Date thoiGianTao;
    private String nguoiSua;
    private Date thoiGianSua;
    private String trangThai;

//    public NhanVienDto(Integer id, String ma, String ten, String gioiTinh, Date ngayThangNamSinh, String email, String sdt, String diaChi, String anh, String username, String username1, String password, String nguoiTao, Date thoiGianTao, String nguoiSua, Date thoiGianSua, String trangThai) {
//    }
}
