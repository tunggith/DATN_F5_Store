package com.example.datn_f5_store.entity;

import com.example.datn_f5_store.contanst.ConfigContanst;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;

import java.util.Date;

@Data
@Table(name = ConfigContanst.HoaDon.TABLE)
@Entity
public class HoaDonEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    @ManyToOne
    @JoinColumn(name = ConfigContanst.HoaDon.ID_KHACH_HANG)
    private KhachHangEntity khachHang;
    @ManyToOne
    @JoinColumn(name = ConfigContanst.HoaDon.ID_NHAN_VIEN)
    private NhanVienEntity nhanVien;
    @ManyToOne
    @JoinColumn(name = ConfigContanst.HoaDon.ID_VOUCHER)
    private VoucherEntity voucher;
    @ManyToOne
    @JoinColumn(name = ConfigContanst.HoaDon.ID_THANH_TOAN)
    private PhuongThucThanhToanEntity thanhToan;
    @Column(name = ConfigContanst.HoaDon.HINH_THUC_THANH_TOAN)
    private Integer hinhThucThanhToan;
    @Column(name = ConfigContanst.HoaDon.MA)
    private String ma;
    @Column(name = ConfigContanst.HoaDon.TONG_TIEN_BAN_DAU)
    private Double tongTienBanDau;
    @Column(name = "PHI_SHIP")
    private Double phiShip;
    @Column(name = ConfigContanst.HoaDon.TONG_TIEN_SAU_VOUCHER)
    private Double tongTienSauVoucher;
    @Column(name = ConfigContanst.HoaDon.TEN_NGUOI_NHAN)
    private String tenNguoiNhan;
    @Column(name = ConfigContanst.HoaDon.SDT_NGUOI_NHAN)
    private String sdtNguoiNhan;
    @Column(name = ConfigContanst.HoaDon.EMAIL_NGUOI_NHAN)
    private String emailNguoiNhan;
    @Column(name = ConfigContanst.HoaDon.DIA_CHI_NHAN_HANG)
    private String diaChiNhanHang;
    @Column(name = ConfigContanst.HoaDon.NGAY_NHAN_DU_KIEN)
    private Date ngayNhanDuKien;
    @Column(name = ConfigContanst.HoaDon.THOI_GIAN_TAO)
    private Date thoiGianTao;
    @Column(name = "GIAO_HANG")
    private Integer giaoHang;
    @Column(name = ConfigContanst.HoaDon.GHI_CHU)
    private String ghiChu;
    @Column(name = ConfigContanst.HoaDon.TRANG_THAI)
    private String trangThai;
}
