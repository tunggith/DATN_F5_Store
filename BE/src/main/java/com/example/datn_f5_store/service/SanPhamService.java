package com.example.datn_f5_store.service;

import com.example.datn_f5_store.dto.SanPhamDto;
import com.example.datn_f5_store.entity.KhachHangEntity;
import com.example.datn_f5_store.request.KhachHangRequest;
import org.springframework.data.domain.Page;

public interface SanPhamService {
    Page<SanPhamDto> getAll(int page, int size);
}
