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
@Table(name = ConfigContanst.ChiTietHoaDon.TABLE)
@Entity
public class ChiTietHoaDonEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    @ManyToOne
    @JoinColumn(name = ConfigContanst.ChiTietHoaDon.ID_HOA_DON)
    private HoaDonEntity hoaDon;
    @ManyToOne
    @JoinColumn(name = ConfigContanst.ChiTietHoaDon.ID_CHI_TIET_SAN_PHAM)
    private ChiTietSanPhamEntity chiTietSanPham;
    @Column(name = ConfigContanst.ChiTietHoaDon.MA)
    private String ma;
    @Column(name = ConfigContanst.ChiTietHoaDon.SO_LUONG)
    private Integer soLuong;
    @Column(name = ConfigContanst.ChiTietHoaDon.GIA_SPCT_HIEN_TAI)
    private Double giaSpctHienTai;
    @Column(name = ConfigContanst.ChiTietHoaDon.TRANG_THAI)
    private String trangThai;
}
