package com.example.datn_f5_store.service;

import com.example.datn_f5_store.dto.ChiTietHoaDonDto;
import com.example.datn_f5_store.dto.HoaDonDto;
import com.example.datn_f5_store.dto.KhuyenMaiDto;
import com.example.datn_f5_store.entity.ChiTietHoaDonEntity;
import com.example.datn_f5_store.entity.HoaDonEntity;
import com.example.datn_f5_store.request.ChiTietHoaDonRequest;
import com.example.datn_f5_store.request.HoaDonRequest;
import com.example.datn_f5_store.response.DataResponse;
import org.springframework.data.domain.Page;

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
    Page<HoaDonDto> getByTrangThai(Integer page, Integer size,String keyWord);
    HoaDonEntity getDetailHoaDonCho(Integer id);
    DataResponse updateTrangThaiHoaDon(Integer id);
    Page<HoaDonDto> getAllHoaDon(int page, int size);
    DataResponse updateDiaChiNhanHang(Integer id,HoaDonRequest request);
    DataResponse editTrangThaiHoaDon(Integer idCho,Integer idDang);
    List<HoaDonDto> getByTrangThaiCho();
}
