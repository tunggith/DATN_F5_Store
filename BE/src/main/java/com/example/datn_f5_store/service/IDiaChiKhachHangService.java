package com.example.datn_f5_store.service;

import com.example.datn_f5_store.dto.DiaChiKhachHangDto;
import com.example.datn_f5_store.dto.KhachHangDto;
import com.example.datn_f5_store.entity.DiaChiKhachHangEntity;
import com.example.datn_f5_store.request.DiaChiKhachHangResquest;
import com.example.datn_f5_store.request.KhachHangRequest;
import com.example.datn_f5_store.response.DataResponse;
import org.springframework.data.domain.Page;

import java.util.List;

public interface IDiaChiKhachHangService    {
    Page<DiaChiKhachHangDto> getAllDiaChiKhachHang(int page, int size, String searchTerm);
    DataResponse addDiaChiKhachHang(DiaChiKhachHangResquest diaChiKhachHangResquest);
    DataResponse updateDiaChiKhachHang(Integer id, DiaChiKhachHangResquest diaChiKhachHangResquest);
    Page<DiaChiKhachHangDto> getByKhachHang(Integer page,Integer size,Integer id);
    DiaChiKhachHangEntity chiTietDiaChi(Integer id);
}
