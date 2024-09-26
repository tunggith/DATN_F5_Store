package com.example.datn_f5_store.entity;

import com.example.datn_f5_store.contanst.ConfigContanst;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = ConfigContanst.MauSac.TABLE)
@Entity
public class MauSacEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    @Column(name = ConfigContanst.MauSac.MA)
    private String ma;
    @Column(name = ConfigContanst.MauSac.TEN)
    private String ten;
}
