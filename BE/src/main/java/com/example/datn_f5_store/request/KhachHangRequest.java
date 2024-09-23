package com.example.datn_f5_store.request;

import com.example.datn_f5_store.contanst.ConfigContanst;
import com.example.datn_f5_store.entity.DiaChiKhachHangEntity;
import jakarta.persistence.Column;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
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
public class KhachHangRequest {

    private Integer id;
    @NotNull(message = "Địa chỉ khách hàng không được để trống")
    private DiaChiKhachHangEntity diaChiKhachHang;

    @NotBlank(message = "Mã không được để trống")
    private String ma;

    @NotBlank(message = "Tên không được để trống")
    @Size(min = 3, message = "Tên phải có ít nhất 3 ký tự")
    private String ten;

    @NotBlank(message = "Giới tính không được để trống")
    private String gioiTinh;

    @NotNull(message = "Ngày sinh không được để trống")
    private Date ngayThangNamSinh;

    @NotBlank(message = "Email không được để trống")
    @Email(message = "Email không hợp lệ")
    private String email;

    private String anh;

    @NotBlank(message = "Số điện thoại không được để trống")
    @Size(min = 10, max = 11, message = "Số điện thoại phải có từ 10 đến 11 ký tự")
    private String sdt;

    @NotBlank(message = "Username không được để trống")
    private String userName;

    @NotBlank(message = "Password không được để trống")
    @Size(min = 6, message = "Mật khẩu phải có ít nhất 6 ký tự")
    private String password;

    private String trangThai;
}
