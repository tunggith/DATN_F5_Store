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
@Table(name = ConfigContanst.GiaoHang.TABLE)
@Entity
public class GiaoHangEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    @Column(name = ConfigContanst.GiaoHang.NGAY_GIAO)
    private Date ngayGiao;
    @Column(name = ConfigContanst.GiaoHang.NGAY_NHAN)
    private Date ngayNhan;
    @Column(name = ConfigContanst.GiaoHang.DIA_CHI)
    private String diaChi;
    @Column(name = ConfigContanst.GiaoHang.PHI_GIAO_HANG)
    private Double phiGiaoHang;
    @Column(name = ConfigContanst.GiaoHang.TRANG_THAI)
    private String trangThai;
}
