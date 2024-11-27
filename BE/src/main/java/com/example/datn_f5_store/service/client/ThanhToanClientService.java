package com.example.datn_f5_store.service.client;

import com.example.datn_f5_store.entity.GioHangEntity;
import com.example.datn_f5_store.request.ChiTietGioHangLocalRequest;
import com.example.datn_f5_store.request.ChiTietGioHangRequest;
import com.example.datn_f5_store.request.GioHangRequest;
import com.example.datn_f5_store.request.HoaDonRequest;
import com.example.datn_f5_store.request.ThanhToanRequest;
import com.example.datn_f5_store.response.DataResponse;

import java.util.List;

public interface ThanhToanClientService {
    DataResponse luuGioHang(Integer id,List<ChiTietGioHangLocalRequest> requests);
    DataResponse thanhToan(ThanhToanRequest request);
    DataResponse xuLyGioHangVaThanhToan(List<ChiTietGioHangRequest> gioHangRequests, ThanhToanRequest thanhToanRequest);
}
