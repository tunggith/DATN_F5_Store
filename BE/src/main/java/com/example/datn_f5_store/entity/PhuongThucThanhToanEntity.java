package com.example.datn_f5_store.entity;

import com.example.datn_f5_store.contanst.ConfigContanst;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Table(name = ConfigContanst.ThanhToan.TABLE)
@Entity
public class PhuongThucThanhToanEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    @Column(name = ConfigContanst.ThanhToan.TEN_PHUONG_THUC)
    private String tenPhuongThuc;
//    @Column(name = ConfigContanst.ThanhToan.)
//    private Date thoiGianThanhToan;
    @Column(name = ConfigContanst.ThanhToan.TRANG_THAI)
    private String trangThai;
}
