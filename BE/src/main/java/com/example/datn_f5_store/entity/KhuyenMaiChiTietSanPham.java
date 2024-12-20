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
import javax.persistence.Version;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "KHUYEN_MAI_CHI_TIET_SAN_PHAM")

public class KhuyenMaiChiTietSanPham {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    @ManyToOne
    @JoinColumn(name = "ID_KHUYEN_MAI")
    private KhuyenMaiEntity khuyenMai;
    @ManyToOne
    @JoinColumn(name = "ID_CHI_TIET_SAN_PHAM")
    private ChiTietSanPhamEntity chiTietSanPham;
    @Column(name = "TRANG_THAI")
    private String trangThai;


}
