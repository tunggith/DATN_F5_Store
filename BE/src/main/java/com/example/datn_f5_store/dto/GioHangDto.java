package com.example.datn_f5_store.dto;

import com.example.datn_f5_store.contanst.ConfigContanst;
import com.example.datn_f5_store.entity.KhachHangEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
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
public class GioHangDto {

    private Integer id;

    private KhachHangEntity khachHang;

    private Date thoiGianTao;
}
