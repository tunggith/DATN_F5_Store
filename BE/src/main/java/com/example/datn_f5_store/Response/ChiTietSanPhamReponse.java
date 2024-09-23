package com.example.datn_f5_store.Response;

import com.example.datn_f5_store.contanst.ConfigContanst;
import com.example.datn_f5_store.entity.MauSacEntity;
import com.example.datn_f5_store.entity.SanPhamEntity;
import com.example.datn_f5_store.entity.SizeEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ChiTietSanPhamReponse {


    private Integer id;

    private String Ten_san_pham;

    private String  mauSac;

    private String size;

    private String ma;

    private String ten;

    private Double donGia;

    private Integer soLuong;

    private Date ngayNhap;

    private String trangThai;
}
