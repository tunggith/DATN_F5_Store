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
import jakarta.validation.constraints.NotEmpty;
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

    private String ma;
    @NotEmpty(message = "Tên không được để trống")

    private String ten;
    private String gioiTinh;
    @NotNull(message = "Ngày sinh không được để trống")

    private Date ngayThangNamSinh;

    @Email(message = "Email không hợp lệ")
    @NotEmpty(message = "Email không được để trống")
    private String email;

    private String roles;
    private String anh;
    @NotEmpty(message = "Số điện thoại không được để trống")
    private String sdt;

    private String userName;
    private String password;

    private String trangThai;
}
