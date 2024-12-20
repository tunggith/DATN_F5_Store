package com.example.datn_f5_store.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.Date;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "VOUCHER")
public class VoucherEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    @Column(name = "MA")
    private String ma;
    @Column(name = "TEN")
    private String ten;
    @Column(name = "GIA_TRI_VOUCHER")
    private Integer giaTriVoucher;
    @Column(name = "KIEU_GIAM_GIA")
    private String kieuGiamGia;
    @Column(name = "GIA_TRI_GIAM_TOI_DA")
    private Integer giaTriGiamToiDa;
    @Column(name = "GIA_TRI_HOA_DON_TOI_THIEU")
    private Integer giaTriHoaDonToiThieu;
    @Column(name = "THOI_GIAN_BAT_DAU")
    private LocalDateTime thoiGianBatDau;
    @Column(name = "THOI_GIAN_KET_THUC")
    private LocalDateTime thoiGianKetThuc;
    @Column(name = "MOTA")
    private String moTa;
    @Column(name = "SO_LUONG")
    private Integer soLuong;
    @Column(name = "NGUOI_TAO")
    private String nguoiTao;
    @Column(name = "THOI_GIAN_TAO")
    private Date thoiGianTao;
    @Column(name = "NGUOI_SUA")
    private String nguoiSua;
    @Column(name = "THOI_GIAN_SUA")
    private Date thoiGianSua;
    @Column(name = "TRANG_THAI")
    private String trangThai;
}