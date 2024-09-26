package com.example.datn_f5_store.service;

import com.example.datn_f5_store.dto.SizeDto;
import com.example.datn_f5_store.dto.XuatXuDto;
import com.example.datn_f5_store.request.SizeRequest;
import com.example.datn_f5_store.request.XuatXuRequest;
import com.example.datn_f5_store.response.DataResponse;

import java.util.List;

public interface ISizeService {
    List<SizeDto> getAll();
    DataResponse create(SizeRequest request);
    DataResponse update(SizeRequest request,Integer id);
}
