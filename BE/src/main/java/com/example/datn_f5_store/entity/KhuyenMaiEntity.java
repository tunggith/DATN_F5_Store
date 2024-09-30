package com.example.datn_f5_store.entity;

import com.example.datn_f5_store.contanst.ConfigContanst;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

import java.util.Date;

@Data
@Table(name = ConfigContanst.KhuyenMai.TABLE)
@Entity
public class KhuyenMaiEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    @Column(name = ConfigContanst.KhuyenMai.MA)
    private String ma;
    @Column(name = ConfigContanst.KhuyenMai.TEN)
    private String ten;
    @Column(name = ConfigContanst.KhuyenMai.KIEU_KHUYEN_MAI)
    private String kieuKhuyenMai;
    @Column(name = ConfigContanst.KhuyenMai.MO_TA)
    private String moTa;
    @Column(name = ConfigContanst.KhuyenMai.SO_LUONG)
    private Integer soLuong;

    @Column(name = ConfigContanst.KhuyenMai.GIA_TRI_KHUYEN_MAI)
    private Integer giaTriKhuyenMai;
    @Column(name = ConfigContanst.KhuyenMai.THOI_GIAN_BAT_DAU)
    private Date thoiGianBatDau;
    @Column(name = ConfigContanst.KhuyenMai.THOI_GIAN_KET_THUC)
    private Date thoiGianKetThuc;
    @Column(name = ConfigContanst.KhuyenMai.THOI_GIAN_TAO)
    private Date thoiGianTao;
    @Column(name = ConfigContanst.KhuyenMai.THOI_GIAN_SUA)
    private Date thoiGianSua;
    @Column(name = ConfigContanst.KhuyenMai.NGUOI_TAO)
    private String nguoiTao;
    @Column(name = ConfigContanst.KhuyenMai.NGUOI_SUA)
    private String nguoiSua;
    @Column(name = ConfigContanst.KhuyenMai.TRANG_THAI)
    private String trangThai;
}
