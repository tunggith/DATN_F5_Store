package com.example.datn_f5_store.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "DIA_CHI_KHACH_HANG")
public class DiaChiKhachHangEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    @ManyToOne
    @JoinColumn(name = "ID_KHACH_HANG")
    private KhachHangEntity khackHang;
    @Column(name = "SO_NHA")
    private String soNha;
    @Column(name = "DUONG")
    private String duong;
    @Column(name = "PHUONG_XA")
    private String phuongXa;
    @Column(name = "QUAN_HUYEN")
    private String quanHuyen;
    @Column(name = "TINH_THANH")
    private String tinhThanh;
    @Column(name = "QUOC_GIA")
    private String quocGia;
    @Column(name = "LOAI_DIA_CHI")
    private String loaiDiaChi;
    @Column(name = "TRANG_THAI")
    private String trangThai;
}
