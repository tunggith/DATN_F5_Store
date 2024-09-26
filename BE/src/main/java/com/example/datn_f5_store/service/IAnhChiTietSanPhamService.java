package com.example.datn_f5_store.service;

import com.example.datn_f5_store.dto.AnhChiTietSanPhamDto;
import com.example.datn_f5_store.entity.AnhChiTietSanPham;
import com.example.datn_f5_store.request.AnhChiTietSanPhamRequest;
import org.springframework.data.domain.Page;

public interface IAnhChiTietSanPhamService {
    Page<AnhChiTietSanPhamDto> getAllAnhChiTietSanPham(int page, int size , String search);
    Boolean addAnhChiTietSanPham(AnhChiTietSanPhamRequest anhChiTietSanPhamRequest);
    Boolean updateAnhChiTietSanPham  (Integer id ,AnhChiTietSanPhamRequest anhChiTietSanPhamRequest);
}
