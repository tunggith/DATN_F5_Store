package com.example.datn_f5_store.service;

import com.example.datn_f5_store.dto.VoucherDto;
import com.example.datn_f5_store.entity.AnhChiTietSanPham;
import com.example.datn_f5_store.entity.ChiTietSanPhamEntity;
import com.example.datn_f5_store.entity.MauSacEntity;
import com.example.datn_f5_store.entity.SanPhamEntity;
import com.example.datn_f5_store.entity.SizeEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.Map;

public interface IHomeClientService {
    ResponseEntity<?> getSanPhamnew();
    ResponseEntity<Page<AnhChiTietSanPham>> getSanPhamHot(int page, int size);

    List<Map<String, Object>> getTop5SanPhamTheoThang(int year);
    List<Map<String, Object>> getTop10MostSoldProducts();

    ResponseEntity<Page<AnhChiTietSanPham>> findByChiTietSanPhamId(String id, Pageable pageable);
    Page<VoucherDto> findByTrangThai();

    public List<SanPhamEntity> findBySanPhamId(Integer id);

    String getKhoangGia(Integer idSanPham);

    List<SizeEntity> getDistinctSizes(Integer idSanPham);
    List<MauSacEntity> getDistinctColors(Integer idSanPham);

    List<AnhChiTietSanPham> getAnhChiTietByMauSacAndSizeAndSanPham(Integer idMauSac, Integer idSize, Integer idSanPham);

    List<ChiTietSanPhamEntity> getChiTietByMauSacAndSizeAndSanPham(Integer idMauSac, Integer idSize, Integer idSanPham);

}
