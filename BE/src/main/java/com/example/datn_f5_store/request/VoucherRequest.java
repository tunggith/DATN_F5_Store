package com.example.datn_f5_store.request;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.util.Date;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class VoucherRequest {

    private Integer id;

    @NotEmpty(message = "Mã không được để trống.")
    @Pattern(regexp = "^[a-zA-Z0-9]+$", message = "Mã phải chỉ bao gồm ký tự và số.")
    private String ma;

    @NotEmpty(message = "Tên không được để trống.")
    @Pattern(regexp = "^[\\p{L}\\p{M}\\p{Z}0-9\\s\"-?]+$", message = "Tên không được chứa ký tự không hợp lệ.")
    private String ten;

    @NotNull(message = "Giá trị voucher không được để trống.")
    private Integer giaTriVoucher;  // or Integer depending on your business logic

    @NotEmpty(message = "Kiểu giảm giá không được để trống.")
    private String kieuGiamGia;

    private Integer giaTriGiamToiDa;

    private Integer giaTriHoaDonToiThieu;

    private Date thoiGianBatDau;

    private Date thoiGianKetThuc;

    private String moTa;

    private Integer soLuong;

    @NotEmpty(message = "Người tạo không được để trống.")
    private String nguoiTao;

    private Date thoiGianTao;

    private String nguoiSua;

    private Date thoiGianSua;

    @NotEmpty(message = "Trạng thái không được để trống.")
    private String trangThai;
}