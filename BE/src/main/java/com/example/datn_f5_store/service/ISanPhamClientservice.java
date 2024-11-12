package com.example.datn_f5_store.service;

import com.example.datn_f5_store.entity.AnhChiTietSanPham;
import org.springframework.data.domain.Page;

public interface ISanPhamClientservice {
    Page<AnhChiTietSanPham> getSanPham(int page, int size);
}
