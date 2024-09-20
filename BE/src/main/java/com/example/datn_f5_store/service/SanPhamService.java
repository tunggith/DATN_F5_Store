package com.example.datn_f5_store.service;

import com.example.datn_f5_store.Response.DataResponse;
import com.example.datn_f5_store.dto.SanPhamDto;
import com.example.datn_f5_store.entity.SanPhamEntity;
import org.springframework.data.domain.Page;

import java.util.List;

public interface SanPhamService {
    Page<SanPhamDto> getAll(int page, int size);
}
