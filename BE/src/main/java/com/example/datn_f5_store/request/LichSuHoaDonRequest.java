package com.example.datn_f5_store.request;

import com.example.datn_f5_store.entity.HoaDonEntity;
import com.example.datn_f5_store.entity.NhanVienEntity;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class LichSuHoaDonRequest {
    private Integer id;
    private HoaDonEntity hoaDon;
    private NhanVienEntity nhanVien;
    private String ghiChu;
    private Date thoiGianThucHien;
    private String trangThaiCu;
    private String trangThaiMoi;
    private String loaiThayDoi;
}
