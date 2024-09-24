package com.example.datn_f5_store.dto;

import jakarta.persistence.Column;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class VoucherDto {

    private Integer id;

    private String ma;

    private String ten;

    private Integer giaTriVoucher;

    private String kieuGiamGia;

    private Double soTienHoaDonToiThieu;

    private Integer giaTriGiamToiDa;

    private Integer giaTriGiamToiThieu;

    private Date thoiGianBatDau;

    private Date thoiGianKetThuc;

    private String moTa;

    private Integer soLuong;

    private String nguoiTao;

    private Date thoiGianTao;

    private String nguoiSua;

    private Date thoiGianSua;

    private String trangThai;
}
