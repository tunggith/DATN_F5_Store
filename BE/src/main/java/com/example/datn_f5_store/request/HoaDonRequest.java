package com.example.datn_f5_store.request;

import com.example.datn_f5_store.entity.KhachHangEntity;
import com.example.datn_f5_store.entity.KhuyenMaiEntity;
import com.example.datn_f5_store.entity.NhanVienEntity;
import com.example.datn_f5_store.entity.ThanhToanEntity;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class HoaDonRequest {

    private Integer id; // ID của hóa đơn

    // private KhachHangEntity khachHang; // Thông tin khách hàng (đã chuyển thành ID)
    private Integer idKhachHang; // ID của khách hàng

    // private NhanVienEntity nhanVien; // Thông tin nhân viên (đã chuyển thành ID)
    private Integer idNhanVien; // ID của nhân viên

    private Integer idVoucher; // ID của voucher (nếu có)

    private Integer idThanhToan; // ID của phương thức thanh toán

    private String ma; // Mã của hóa đơn

    private Double tongTienBanDau; // Tổng tiền ban đầu trước khi áp dụng voucher

    private Double tongTienSauVoucher; // Tổng tiền sau khi áp dụng voucher

    private String tenNguoiNhan; // Tên của người nhận

    private String sdtNguoiNhan; // Số điện thoại của người nhận

    private String emailNguoiNhan; // Email của người nhận

    private String diaChiNhanHang; // Địa chỉ giao hàng

    private Date ngayNhanDuKien; // Ngày nhận hàng dự kiến

    private Date thoiGianTao; // Thời gian tạo hóa đơn

    private String ghiChu; // Ghi chú thêm

    private String trangThai; // Trạng thái của hóa đơn
}
