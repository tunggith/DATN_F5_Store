package com.example.datn_f5_store.service;

import com.example.datn_f5_store.dto.ChiTietHoaDonDto;
import com.example.datn_f5_store.dto.HoaDonDto;
import com.example.datn_f5_store.entity.ChiTietHoaDonEntity;
import com.example.datn_f5_store.entity.HoaDonEntity;
import com.example.datn_f5_store.request.ChiTietHoaDonRequest;
import com.example.datn_f5_store.request.HoaDonRequest;
import com.example.datn_f5_store.response.DataResponse;

import java.util.List;

public interface IHoaDonService {
    List<HoaDonDto> getAll();
    DataResponse craete(HoaDonRequest request);
    DataResponse update(HoaDonRequest request,Integer id);
    DataResponse huyHoaDon(Integer id);
    List<ChiTietHoaDonDto> getChiTietHoaDon(Integer id);
    DataResponse chonSanPham(ChiTietHoaDonRequest request,Integer idSanPham);
    DataResponse deleteHoaDonChiTiet(Integer idHoaDonCt);
    DataResponse giamSoLuongSanPham(Integer idHdct);
    DataResponse updateKhachhang(Integer idHoaDon,Integer idKhachHang);
    List<HoaDonDto> getByTrangThai();
}
