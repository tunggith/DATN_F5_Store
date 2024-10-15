package com.example.datn_f5_store.request;

import jakarta.persistence.Column;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class DiaChiKhachHangResquest {
    private Integer id;

    @Column(name = "HO_TEN")
    @NotBlank(message = "Họ tên không được để trống")
    private String hoTen;

    @Column(name = "SDT")
    @NotBlank(message = "Số điện thoại không được để trống")
    @Size(max = 11, message = "Số điện thoại không được quá 11 số")
    @Pattern(regexp = "^[0-9]+$", message = "Số điện thoại chỉ được chứa các chữ số")
    private String SDT;

    @Column(name = "SO_NHA")
    @NotBlank(message = "Số nhà không được để trống")
    private String soNha;

    @Column(name = "DUONG")
    @NotBlank(message = "Đường không được để trống")
    private String duong;

    @Column(name = "PHUONG_XA")
    @NotBlank(message = "Phường xã không được để trống")
    private String phuongXa;

    @Column(name = "QUAN_HUYEN")
    @NotBlank(message = "Quận huyện không được để trống")
    private String quanHuyen;

    @Column(name = "TINH_THANH")
    @NotBlank(message = "Tỉnh thành không được để trống")
    private String tinhThanh;

    @Column(name = "QUOC_GIA")
    @NotBlank(message = "Quốc gia không được để trống")
    private String quocGia;

    @Column(name = "LOAI_DIA_CHI")
    private String loaiDiaChi;

    @Column(name = "TRANG_THAI")
    private String trangThai;
}
