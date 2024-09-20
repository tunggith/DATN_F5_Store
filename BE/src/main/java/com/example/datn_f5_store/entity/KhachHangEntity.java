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
@Table(name = ConfigContanst.KhachHang.TABLE)
@Entity
public class KhachHangEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    @ManyToOne
    @JoinColumn(name = ConfigContanst.KhachHang.ID_DIA_CHI)
    private DiaChiKhachHangEntity diaChiKhachHang;
    @Column(name = ConfigContanst.KhachHang.MA)
    private String ma;
    @Column(name = ConfigContanst.KhachHang.HO_TEN)
    private String ten;
    @Column(name = ConfigContanst.KhachHang.GIOI_TINH)
    private String gioiTinh;
    @Column(name = ConfigContanst.KhachHang.NGAY_THANG_NAM_SINH)
    private Date ngayThangNamSinh;
    @Column(name = ConfigContanst.KhachHang.EMAIL)
    private String email;
    @Column(name = ConfigContanst.KhachHang.ANH)
    private String anh;
    @Column(name = ConfigContanst.KhachHang.SDT)
    private String sdt;
    @Column(name = ConfigContanst.KhachHang.USERNAME)
    private String userName;
    @Column(name = ConfigContanst.KhachHang.PASSWORD)
    private String password;
    @Column(name = ConfigContanst.KhachHang.TRANG_THAI)
    private String trangThai;
}
