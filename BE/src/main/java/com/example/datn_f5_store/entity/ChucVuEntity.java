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
@Table(name = ConfigContanst.ChucVu.TABLE)
@Entity
public class ChucVuEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    @Column(name = ConfigContanst.ChucVu.MA)
    private String ma;
    @Column(name = ConfigContanst.ChucVu.TEN_CHUC_VU)
    private String tenChucVu;
    @Column(name = ConfigContanst.ChucVu.TRANG_THAI)
    private String trangThai;
}
