package com.example.datn_f5_store.service;

import com.example.datn_f5_store.dto.SanPhamDto;
<<<<<<< HEAD
import com.example.datn_f5_store.entity.KhachHangEntity;
import com.example.datn_f5_store.request.KhachHangRequest;
=======
import com.example.datn_f5_store.entity.SanPhamEntity;
import com.example.datn_f5_store.request.SanPhamRequest;
>>>>>>> master
import org.springframework.data.domain.Page;

public interface SanPhamService {
    Page<SanPhamDto> getAll(int page, int size);
    Page<SanPhamDto> findByTenOrMa(int page, int size,String ten,String ma);
    public DataResponse create(SanPhamRequest sanPhamRequest);
    DataResponse update(SanPhamRequest sanPhamRequest,Integer id);
}
