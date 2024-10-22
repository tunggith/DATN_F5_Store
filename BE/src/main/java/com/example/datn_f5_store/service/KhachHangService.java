package com.example.datn_f5_store.service;

import com.example.datn_f5_store.dto.KhachHangDto;
import com.example.datn_f5_store.entity.KhachHangEntity;
import com.example.datn_f5_store.request.KhachHangRequest;
import com.example.datn_f5_store.response.DataResponse;
import org.apache.coyote.BadRequestException;
import org.springframework.data.domain.Page;

import java.util.List;

public interface KhachHangService {

    Page<KhachHangDto> getAllKhachHang(int page, int size, String search);
    DataResponse addKhachHang(KhachHangRequest khachHangRequest) throws BadRequestException;
    DataResponse create(KhachHangRequest request) throws BadRequestException;

    DataResponse updateKhachHang(Integer id, KhachHangRequest khachHangRequest) throws BadRequestException;
    List<KhachHangEntity> searchKhachHang(String name, String email, String sdt);
    List<KhachHangDto> getAllKhachHangKhongPhanTrang(String search);
    Page<KhachHangDto> findByTenContainingOrMaContainingOrEmailContainingOrSdtContaining(
            int page, int size, String ten, String ma, String email, String sdt);
    DataResponse updateTrangThai(Integer id);
    List<KhachHangDto> getByTrangThai();
    KhachHangEntity detail(Integer id);
}
