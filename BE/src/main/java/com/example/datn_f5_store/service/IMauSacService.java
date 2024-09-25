package com.example.datn_f5_store.service;

import com.example.datn_f5_store.dto.MauSacDto;
import com.example.datn_f5_store.dto.XuatXuDto;
import com.example.datn_f5_store.request.MauSacRequest;
import com.example.datn_f5_store.request.XuatXuRequest;
import com.example.datn_f5_store.response.DataResponse;

import java.util.List;

public interface IMauSacService {
    List<MauSacDto> getAll();
    DataResponse create(MauSacRequest request);
    DataResponse update(MauSacRequest request,Integer id);
}
