package com.example.datn_f5_store.service;

import com.example.datn_f5_store.dto.KhachHangDto;
import com.example.datn_f5_store.entity.KhachHangEntity;
import com.example.datn_f5_store.request.KhachHangRequest;
import com.example.datn_f5_store.response.DataResponse;
import org.apache.coyote.BadRequestException;
import org.springframework.data.domain.Page;

import java.util.List;

public interface KhachHangService {

    // Phương thức lấy danh sách khách hàng với phân trang
    Page<KhachHangDto> getAllKhachHang(int page, int size, String search);

    // Phương thức thêm khách hàng mới
    Boolean addKhachHang(KhachHangRequest khachHangRequest);
    DataResponse create(KhachHangRequest request) throws BadRequestException;

    // Phương thức cập nhật thông tin khách hàng
    Boolean updateKhachHang(Integer id, KhachHangRequest khachHangRequest);

    // Phương thức tìm kiếm khách hàng theo tên
    List<KhachHangEntity> searchKhachHang(String name, String email, String sdt);
    List<KhachHangDto> getAllKhachHangKhongPhanTrang(String search);
    Page<KhachHangDto> findByTenContainingOrMaContainingOrEmailContainingOrSdtContaining(
            int page, int size, String ten, String ma, String email, String sdt);
    DataResponse updateTrangThai(Integer id);
}
