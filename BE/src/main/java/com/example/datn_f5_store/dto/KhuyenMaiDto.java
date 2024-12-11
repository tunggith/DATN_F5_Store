package com.example.datn_f5_store.dto;

import jakarta.persistence.TemporalType;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


import java.time.LocalDateTime;
import java.util.Date;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class KhuyenMaiDto {
    private Integer id;
    private String ma;
    private String ten;

    private String kieuKhuyenMai;
    private String moTa;
    private Integer soLuong;

    private Integer giaTriKhuyenMai;


    private LocalDateTime thoiGianBatDau;
    private LocalDateTime thoiGianKetThuc;
    private LocalDateTime thoiGianTao;
    private Date thoiGianSua;
    private String nguoiTao;
    private String nguoiSua;
    private String trangThai;
}
