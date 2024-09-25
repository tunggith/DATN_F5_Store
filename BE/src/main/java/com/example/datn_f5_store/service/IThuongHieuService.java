package com.example.datn_f5_store.service;

import com.example.datn_f5_store.dto.ThuongHieuDto;
import com.example.datn_f5_store.request.ThuongHieuRequest;
import com.example.datn_f5_store.response.DataResponse;

import java.util.List;

public interface IThuongHieuService {
    List<ThuongHieuDto> getAll();
    DataResponse create(ThuongHieuRequest request);
    DataResponse update(ThuongHieuRequest request,Integer id);
}
