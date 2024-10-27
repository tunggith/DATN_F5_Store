package com.example.datn_f5_store.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.util.Date;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class NhanVienRequest {

    private Integer id;

    @NotEmpty(message = "Mã không được để trống")
    private String ma;

    @NotEmpty(message = "Tên không được để trống")
    private String ten;

    private String gioiTinh;

    @NotNull(message = "Ngày sinh không được để trống")
        private Date ngayThangNamSinh;

    @Email(message = "Email không hợp lệ")
    @NotEmpty(message = "Email không được để trống")
    private String email;

    @NotEmpty(message = "Số điện thoại không được để trống")
    private String sdt;

    @NotEmpty(message = "Địa chỉ không được để trống")
    private String diaChi;

    private String anh;

    private String username;

    private String password;

    private String nguoiTao;
    private Date thoiGianTao;
    private String nguoiSua;
    private Date thoiGianSua;
    private String trangThai;
}
