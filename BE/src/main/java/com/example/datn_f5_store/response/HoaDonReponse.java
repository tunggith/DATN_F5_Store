package com.example.datn_f5_store.response;

import com.example.datn_f5_store.contanst.ConfigContanst;
import com.example.datn_f5_store.entity.KhachHangEntity;
import com.example.datn_f5_store.entity.NhanVienEntity;
import com.example.datn_f5_store.entity.PhuongThucThanhToanEntity;
import com.example.datn_f5_store.entity.VoucherEntity;
import lombok.Data;

import java.util.Date;
@Data
public class HoaDonReponse {

        private Integer id;

        private KhachHangEntity khachHang;

        private NhanVienEntity nhanVien;

        private VoucherEntity voucher;

        private PhuongThucThanhToanEntity thanhToan;

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



