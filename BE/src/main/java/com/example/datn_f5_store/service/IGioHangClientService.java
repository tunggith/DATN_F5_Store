package com.example.datn_f5_store.service;
import com.example.datn_f5_store.dto.ChiTietGioHangDto;
import com.example.datn_f5_store.dto.GioHangChiTietDto;
import com.example.datn_f5_store.dto.GioHangDto;
import com.example.datn_f5_store.entity.AnhChiTietSanPham;
import com.example.datn_f5_store.entity.ChiTietGioHangEntity;
import com.example.datn_f5_store.entity.GioHangEntity;
import com.example.datn_f5_store.entity.KhachHangEntity;
import com.example.datn_f5_store.request.ChiTietGioHangRequest;
import com.example.datn_f5_store.request.KhachHangRequest;
import com.example.datn_f5_store.response.DataResponse;
import jakarta.persistence.Index;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface IGioHangClientService {
    List<GioHangChiTietDto> getAllChiTietGioHang(Integer id);
    DataResponse themSanPham(Integer idKhachHang,ChiTietGioHangRequest request);
    DataResponse xoaSanPham(Integer id);
    DataResponse xoaChiTietGioHang(Integer id);
    DataResponse updateTrangThai(Integer id);

}
