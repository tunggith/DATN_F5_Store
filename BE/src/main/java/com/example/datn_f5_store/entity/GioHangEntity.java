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
@Table(name = ConfigContanst.GioHang.TABLE)
@Entity
public class GioHangEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    @ManyToOne
    @JoinColumn(name = ConfigContanst.GioHang.ID_KHACH_HANG)
    private KhachHangEntity khachHang;
    @Column(name = ConfigContanst.GioHang.THOI_GIAN_TAO)
    private Date thoiGianTao;
}
