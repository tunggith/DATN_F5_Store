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
import jakarta.persistence.criteria.CriteriaBuilder;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = ConfigContanst.ChiTietSanPham.TABLE)
@Entity
public class ChiTietSanPhamEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    @ManyToOne
    @JoinColumn(name = ConfigContanst.ChiTietSanPham.ID_SAN_PHAM)
    private SanPhamEntity sanPham;
    @ManyToOne
    @JoinColumn(name = ConfigContanst.ChiTietSanPham.ID_MAU_SAC)
    private MauSacEntity mauSac;
    @ManyToOne
    @JoinColumn(name = ConfigContanst.ChiTietSanPham.ID_SIZE)
    private SizeEntity size;
    @Column(name = ConfigContanst.ChiTietSanPham.MA)
    private String ma;
    @Column(name = ConfigContanst.ChiTietSanPham.TEN)
    private String ten;
    @Column(name = ConfigContanst.ChiTietSanPham.DON_GIA)
    private Double donGia;
    @Column(name = ConfigContanst.ChiTietSanPham.SO_LUONG)
    private Integer soLuong;
    @Column(name = ConfigContanst.ChiTietSanPham.TRANG_THAI)
    private String trangThai;
}
