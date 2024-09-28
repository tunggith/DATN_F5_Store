package com.example.datn_f5_store.request;

import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ThanhToanRequest {

    private Integer id; // ID của phương thức thanh toán

    @NotEmpty(message = "Tên phương thức không được để trống.")
    private String tenPhuongThuc; // Tên của phương thức thanh toán

    private Date thoiGianThanhToan; // Thời gian thanh toán (uncomment nếu cần thiết)

    @NotEmpty(message = "Trạng thái không được để trống.")
    private String trangThai; // Trạng thái của phương thức thanh toán


}
