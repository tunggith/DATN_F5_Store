package com.example.datn_f5_store.service;

import com.example.datn_f5_store.dto.XuatXuDto;
import com.example.datn_f5_store.request.XuatXuRequest;
import com.example.datn_f5_store.response.DataResponse;

import java.util.List;

public interface IXuatXuService {
    List<XuatXuDto> getAll();
    DataResponse create(XuatXuRequest request);
    DataResponse update(XuatXuRequest request,Integer id);
}
