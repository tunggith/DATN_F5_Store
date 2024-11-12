package com.example.datn_f5_store.service.impl;

import com.example.datn_f5_store.entity.AnhChiTietSanPham;
import com.example.datn_f5_store.repository.IAnhChiTietSanPhamRepository;
import com.example.datn_f5_store.service.ISanPhamClientservice;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
@Service
public class SanPhamClientImpl implements ISanPhamClientservice {

    @Autowired
    private IAnhChiTietSanPhamRepository repoAnh;
    @Override
    public Page<AnhChiTietSanPham> getSanPham(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return repoAnh.getallAnhSanPham( "Đang hoạt động", pageable);
    }


}
