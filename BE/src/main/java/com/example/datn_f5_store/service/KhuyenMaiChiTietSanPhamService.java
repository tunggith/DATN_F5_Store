package com.example.datn_f5_store.service;

import com.example.datn_f5_store.dto.KhuyenMaiChiTietSanPhamDto;
import com.example.datn_f5_store.entity.KhuyenMaiChiTietSanPham;
import com.example.datn_f5_store.exceptions.DataNotFoundException;
import com.example.datn_f5_store.request.KhuyenMaiChiTietSanPhamRequest;
import com.example.datn_f5_store.request.VoucherRequest;
import org.springframework.data.domain.Page;
import com.example.datn_f5_store.response.DataResponse;
import org.springframework.stereotype.Service;

@Service
public interface KhuyenMaiChiTietSanPhamService {
    Page<KhuyenMaiChiTietSanPhamDto> getAll(int page, int size);
    DataResponse createKhuyenMaictsp(KhuyenMaiChiTietSanPhamRequest khuyenMaiChiTietSanPhamRequest);
    DataResponse XoaKhuyenMaictsp(Integer id);
    void upDateTrangThaiKhuyenMaiCtSp();
    Page<KhuyenMaiChiTietSanPhamDto> getByKhuyenMai(int page, int size,int id);
}
