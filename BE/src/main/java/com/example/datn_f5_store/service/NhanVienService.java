package com.example.datn_f5_store.service;

import com.example.datn_f5_store.dto.NhanVienDto;
import com.example.datn_f5_store.request.NhanVienRequest;
import com.example.datn_f5_store.response.DataResponse;
import org.springframework.data.domain.Page;

public interface NhanVienService {
    Page<NhanVienDto> getAll(int page, int size);
    Page<NhanVienDto> findByTenOrMa(int page, int size, String ten, String ma);
    DataResponse create(NhanVienRequest nhanVienRequest);
    DataResponse update(NhanVienRequest nhanVienRequest, Integer id);
    DataResponse delete(Integer id); // Thêm phương thức xóa
}
