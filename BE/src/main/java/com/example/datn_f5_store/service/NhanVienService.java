package com.example.datn_f5_store.service;

import com.example.datn_f5_store.Response.DataResponse;
import com.example.datn_f5_store.dto.NhanVienDto;
import com.example.datn_f5_store.request.NhanVienRequest;
import com.example.datn_f5_store.entity.NhanVienEntity;
import org.springframework.data.domain.Page;

public interface NhanVienService {
    Page<NhanVienDto> getAll(int page, int size);
    Page<NhanVienDto> findByTenOrMa(int page, int size, String ten, String ma);
    public DataResponse create(NhanVienRequest nhanVienRequest);
    DataResponse update(NhanVienRequest nhanVienRequest, Integer id);
}
