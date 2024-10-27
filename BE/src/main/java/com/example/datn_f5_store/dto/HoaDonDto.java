package com.example.datn_f5_store.dto;

import com.example.datn_f5_store.entity.KhachHangEntity;
import com.example.datn_f5_store.entity.NhanVienEntity;
import com.example.datn_f5_store.entity.PhuongThucThanhToanEntity;
import com.example.datn_f5_store.entity.VoucherEntity;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class HoaDonDto {
    private Integer id;
    private KhachHangEntity khachHang;
    private NhanVienEntity nhanVien;
    private VoucherEntity voucher;
    private PhuongThucThanhToanEntity thanhToan;
    private Integer hinhThucThanhToan;
    private String ma;
    private Double tongTienBanDau;
    private Double phiShip;
    private Double tongTienSauVoucher;
    private String tenNguoiNhan;
    private String sdtNguoiNhan;
    private String emailNguoiNhan;
    private String diaChiNhanHang;
    private Date ngayNhanDuKien;
    private Date thoiGianTao;
    private Integer giaoHang;
    private String ghiChu;
    private String trangThai;
}
