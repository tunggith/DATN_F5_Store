package com.example.datn_f5_store.request;

import com.example.datn_f5_store.contanst.ConfigContanst;
import jakarta.persistence.Column;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Positive;
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
public class KhuyenMaiRequest {


    private Integer id;

    @NotEmpty(message = "Mã không được để trống.")
    @Pattern(regexp = "^[a-zA-Z0-9]+$", message = "Mã phải chỉ bao gồm các chữ cái và số.")
    private String ma;

    @NotEmpty(message = "Tên không được để trống.")
    @Pattern(regexp = "^[\\p{L}\\p{M}\\p{Z}0-9\\s\"-?]+$", message = "Tên không được chứa ký tự không hợp lệ.")
    private String ten;

    @NotNull(message = "Kiểu khuyến mãi không được trống.")
    private String kieuKhuyenMai;

    @NotNull(message = "Mô tả không được trống.")
    private String moTa;

    @Positive(message = "Số lượng phải lớn hơn 0.")
    private Integer soLuong;

    @Positive(message = "Giá trị khuyến mãi phải lớn hơn 0.")
    private Integer giaTriKhuyenMai;

    @NotNull(message = "Thời gian bắt đầu không được trống.")
    private Date thoiGianBatDau;

    @NotNull(message = "Thời gian kết thúc không được trống.")
    private Date thoiGianKetThuc;

    @NotNull(message = "Thời gian tạo không được trống.")
    private Date thoiGianTao;

    private Date thoiGianSua;

    @NotNull(message = "Người tạo không được trống.")
    private String nguoiTao;


    private String nguoiSua;

    @NotNull(message = "Trạng thái không được trống.")
    private String trangThai;
}
