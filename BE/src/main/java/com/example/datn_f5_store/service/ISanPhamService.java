package com.example.datn_f5_store.service;

import com.example.datn_f5_store.dto.SanPhamDto;
import com.example.datn_f5_store.request.SanPhamRequest;
import com.example.datn_f5_store.response.DataResponse;
import org.springframework.data.domain.Page;
import java.util.List;

public interface ISanPhamService {

    Page<SanPhamDto> getAll(int page, int size);
    Page<SanPhamDto> findByTenOrMa(int page, int size,String ten,String ma);
    DataResponse create(SanPhamRequest sanPhamRequest);
    DataResponse update(SanPhamRequest sanPhamRequest,Integer id);
    List<SanPhamDto> findById(Integer id);
}
