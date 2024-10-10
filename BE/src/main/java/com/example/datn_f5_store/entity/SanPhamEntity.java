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
@Data
@Table(name = ConfigContanst.SanPham.TABLE)
@Entity
public class SanPhamEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    @ManyToOne
    @JoinColumn(name = ConfigContanst.SanPham.ID_XUAT_XU)
    private XuatXuEntity xuatXu;
    @ManyToOne
    @JoinColumn(name = ConfigContanst.SanPham.ID_THUONG_HIEU)
    private ThuongHieuEntity thuongHieu;
    @ManyToOne
    @JoinColumn(name = ConfigContanst.SanPham.ID_GIOI_TINH)
    private GioiTinhEntity gioiTinh;
    @Column(name = ConfigContanst.SanPham.MA)
    private String ma;
    @Column(name = ConfigContanst.SanPham.TEN)
    private String ten;
    @Column(name = ConfigContanst.SanPham.TRANG_THAI)
    private String trangThai;
}
