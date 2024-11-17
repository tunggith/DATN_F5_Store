package com.example.datn_f5_store.service;
import com.example.datn_f5_store.dto.ChiTietGioHangDto;
import com.example.datn_f5_store.dto.GioHangDto;
import com.example.datn_f5_store.entity.AnhChiTietSanPham;
import com.example.datn_f5_store.entity.ChiTietGioHangEntity;
import com.example.datn_f5_store.entity.GioHangEntity;
import com.example.datn_f5_store.request.ChiTietGioHangRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
public interface IGioHangClientService {
    ChiTietGioHangEntity addOrUpdateChiTietGioHang(ChiTietGioHangRequest chiTietGioHangRequest);
    ChiTietGioHangEntity addOrUpdateChiTietGioHang2(ChiTietGioHangRequest chiTietGioHangRequest);
    Page<ChiTietGioHangDto> findByGioHang(int page, int size, Integer idgh);

    Page<GioHangDto> findByKhachHang(int page, int size, Integer idgh);
}
