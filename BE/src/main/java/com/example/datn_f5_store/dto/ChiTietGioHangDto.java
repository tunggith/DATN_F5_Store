package com.example.datn_f5_store.dto;

import com.example.datn_f5_store.contanst.ConfigContanst;
import com.example.datn_f5_store.entity.ChiTietSanPhamEntity;
import com.example.datn_f5_store.entity.GioHangEntity;
import jakarta.persistence.Column;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ChiTietGioHangDto {

    private Integer id;

    private GioHangEntity gioHang;

    private ChiTietSanPhamEntity chiTietSanPham;

    private Integer soLuong;
}
