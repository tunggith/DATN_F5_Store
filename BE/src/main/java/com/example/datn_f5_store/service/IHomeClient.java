package com.example.datn_f5_store.service;

import com.example.datn_f5_store.dto.KhuyenMaiDto;
import com.example.datn_f5_store.entity.AnhChiTietSanPham;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.Map;

public interface IHomeClient {
    ResponseEntity<?> getSanPhamnew();
    ResponseEntity<Page<AnhChiTietSanPham>> getSanPhamHot(int page, int size);

    List<Map<String, Object>> getTop5SanPhamTheoThang(int year);
    List<Map<String, Object>> getTop10MostSoldProducts();

    ResponseEntity<Page<AnhChiTietSanPham>> findByChiTietSanPhamId(String id, Pageable pageable);
    Page<KhuyenMaiDto> findByTrangThai();
}
