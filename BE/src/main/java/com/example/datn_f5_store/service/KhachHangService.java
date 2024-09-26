package com.example.datn_f5_store.service;

import com.example.datn_f5_store.dto.KhachHangDto;
import com.example.datn_f5_store.entity.KhachHangEntity;
import com.example.datn_f5_store.request.KhachHangRequest;
import org.springframework.data.domain.Page;

import java.util.List;

public interface KhachHangService {
    Page<KhachHangDto> getAllKhachHang(int page,int size);
    public Boolean addKhachHang(KhachHangRequest khachHangRequest);
    public Boolean updateKhachHang(Integer id,KhachHangRequest khachHangRequest);
    List<KhachHangEntity> searchKhachHangByName(String name);
}
