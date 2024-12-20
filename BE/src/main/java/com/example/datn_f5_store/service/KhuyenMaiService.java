package com.example.datn_f5_store.service;


import com.example.datn_f5_store.dto.KhuyenMaiDto;
import com.example.datn_f5_store.entity.KhuyenMaiEntity;
import com.example.datn_f5_store.exceptions.DataNotFoundException;
import com.example.datn_f5_store.request.KhuyenMaiRequest;
import com.example.datn_f5_store.response.DataResponse;
import com.example.datn_f5_store.response.DataResponse2;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Date;

@Service
public interface KhuyenMaiService {
    Page<KhuyenMaiDto> getAll(int page, int size);
    Page<KhuyenMaiDto> findByTenOrMa(int page, int size, String tim);
    Page<KhuyenMaiDto> findByTrangThai(int page, int size, String trangThai);
    DataResponse2 create(KhuyenMaiRequest khuyenMaiRequest);
    DataResponse2 update(KhuyenMaiRequest khuyenMaiRequest, Integer id);
    KhuyenMaiEntity findById(Integer id);
    Page<KhuyenMaiDto> findKhuyenMaiByDate(int page, int size, LocalDateTime start, LocalDateTime end);
    public void CapNhapTrangThaiKhuyenMaiDhh();

    public DataResponse CapNhapTrangThaiKhuyenMai(Integer id);
}
