package com.example.datn_f5_store.request;


import com.example.datn_f5_store.entity.MauSacEntity;
import com.example.datn_f5_store.entity.SanPhamEntity;
import com.example.datn_f5_store.entity.SizeEntity;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.util.Date;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ChiTietSanphamRequest {

    private Integer id;

    @NotNull(message = "Sản phẩm không được để trống.")
    private SanPhamEntity idSanPham;

    @NotNull(message = "Màu sắc không được để trống.")
    private MauSacEntity idMauSac;

    @NotNull(message = "Kích thước không được để trống.")
    private SizeEntity idSize;

    @NotBlank(message = "Mã không được để trống.")
    private String ma;

    @NotBlank(message = "Tên không được để trống.")
    private String ten;

    @NotNull(message = "Đơn giá không được để trống.")
    private Double donGia;

    @NotNull(message = "Số lượng không được để trống.")
    private Integer soLuong;

    @NotBlank(message = "Trạng thái không được để trống.")
    private String trangThai; // Nếu cần để là String
}
