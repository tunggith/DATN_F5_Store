package com.example.datn_f5_store.service;

import com.example.datn_f5_store.dto.AnhChiTietSanPhamDto;
import com.example.datn_f5_store.entity.AnhChiTietSanPham;
import com.example.datn_f5_store.request.AnhChiTietSanPhamRequest;
import com.example.datn_f5_store.response.DataResponse;
import org.springframework.data.domain.Page;

import java.util.List;

public interface IAnhChiTietSanPhamService {
    Page<AnhChiTietSanPhamDto> getBySanPham(Integer page, Integer size,Integer id);
    DataResponse create(AnhChiTietSanPhamRequest request);
    DataResponse update(Integer id,AnhChiTietSanPhamRequest request);
    AnhChiTietSanPham detail(Integer id);
}
