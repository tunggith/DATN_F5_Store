package com.example.datn_f5_store.service;

import com.example.datn_f5_store.dto.DiaChiKhachHangDto;
import com.example.datn_f5_store.dto.KhachHangDto;
import com.example.datn_f5_store.request.DiaChiKhachHangResquest;
import com.example.datn_f5_store.request.KhachHangRequest;
import org.springframework.data.domain.Page;

public interface IDiaChiKhachHangService    {
    Page<DiaChiKhachHangDto> getAllDiaChiKhachHang(int page, int size, String searchTerm);
    Boolean addDiaChiKhachHang(DiaChiKhachHangResquest diaChiKhachHangResquest);
    Boolean updateDiaChiKhachHang(Integer id,DiaChiKhachHangResquest diaChiKhachHangResquest);
}
