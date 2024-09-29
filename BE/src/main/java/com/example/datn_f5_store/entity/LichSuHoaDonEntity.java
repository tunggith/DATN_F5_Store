package com.example.datn_f5_store.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "LICH_SU_HOA_DON")
public class LichSuHoaDonEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    @ManyToOne
    @JoinColumn(name = "ID_HOA_DON")
    private HoaDonEntity hoaDon;
    @ManyToOne
    @JoinColumn(name = "ID_NHAN_VIEN")
    private NhanVienEntity nhanVien;
    @Column(name = "GI_CHU")
    private String ghiChu;
    @Column(name = "THOI_GIAN_THUC_HIEN")
    private Date thoiGianThucHien;
    @Column(name = "TRANG_THAI_CU")
    private String trangThaiCu;
    @Column(name = "TRANG_THAI_MOI")
    private String trangThaiMoi;
    @Column(name = "LOAI_THAY_DOI")
    private String loaiThayDoi;
}
