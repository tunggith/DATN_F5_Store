package com.example.datn_f5_store.request;

import com.example.datn_f5_store.contanst.ConfigContanst;
import com.example.datn_f5_store.entity.KhachHangEntity;
import com.example.datn_f5_store.entity.KhuyenMaiEntity;
import com.example.datn_f5_store.entity.NhanVienEntity;
import com.example.datn_f5_store.entity.ThanhToanEntity;
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
    private KhachHangEntity khachHang;
    private NhanVienEntity nhanVien;
    private KhuyenMaiEntity khuyenMai;
    private ThanhToanEntity thanhToan;
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