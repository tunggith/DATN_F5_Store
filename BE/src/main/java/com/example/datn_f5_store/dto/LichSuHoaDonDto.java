package com.example.datn_f5_store.dto;

import com.example.datn_f5_store.entity.HoaDonEntity;
import com.example.datn_f5_store.entity.NhanVienEntity;
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

import java.util.Date;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor

public class LichSuHoaDonDto {
    private Integer id;
    private HoaDonEntity hoaDon;
    private NhanVienEntity nhanVien;
    private String ghiChu;
    private Date thoiGianThucHien;
    private String trangThaiCu;
    private String trangThaiMoi;
    private String loaiThayDoi;
}
