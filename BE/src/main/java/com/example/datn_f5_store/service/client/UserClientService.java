package com.example.datn_f5_store.service.client;

import com.example.datn_f5_store.entity.KhachHangEntity;
import com.example.datn_f5_store.request.DiaChiKhachHangResquest;
import com.example.datn_f5_store.request.KhachHangRequest;
import com.example.datn_f5_store.response.DataResponse;
import org.springframework.web.bind.annotation.RequestParam;

public interface UserClientService {
    DataResponse loginClient(String username,String password);
    DataResponse registerClient(KhachHangRequest request);
    DataResponse detailclient(Integer id);
    DataResponse createDiaChiClient(DiaChiKhachHangResquest resquest);
    DataResponse updateAnh(Integer id,KhachHangRequest request);
    DataResponse changePassword(Integer id,String passwordOld,String passwordNew);
    DataResponse detailDiaChi(Integer id);
    DataResponse getDiaChiByKhachHang(Integer id);
    DataResponse updateDiaChiClient(DiaChiKhachHangResquest request);
}
