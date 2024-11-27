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
@Table(name = ConfigContanst.ChiTietGioHang.TABLE)
@Entity
public class ChiTietGioHangEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    @ManyToOne
    @JoinColumn(name = ConfigContanst.ChiTietGioHang.ID_GIO_HANG)
    private GioHangEntity gioHang;
    @ManyToOne
    @JoinColumn(name = ConfigContanst.ChiTietGioHang.ID_CHI_TIET_SAN_PHAM)
    private ChiTietSanPhamEntity chiTietSanPham;
    @Column(name = ConfigContanst.ChiTietGioHang.SO_LUONG)
    private Integer soLuong;
    @Column(name = ConfigContanst.ChiTietGioHang.TRANG_THAI)
    private String trangThai;

}
