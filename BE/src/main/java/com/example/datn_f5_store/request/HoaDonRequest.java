package com.example.datn_f5_store.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class HoaDonRequest {
    private Integer id;
    private Integer idKhachHang;
    private Integer idNhanVien;
    private Integer idVoucher;
    private Integer idThanhToan;
    private String ma;
    private Double tongTienBanDau;
    private Double tongTienSauVoucher;
    private String tenNguoiNhan;
    private String sdtNguoiNhan;
    private String emailNguoiNhan;
    private String diaChiNhanHang;
    private Date ngayNhanDuKien;
    private Date thoiGianTao;
    private String ghiChu;
    private String trangThai;
}
