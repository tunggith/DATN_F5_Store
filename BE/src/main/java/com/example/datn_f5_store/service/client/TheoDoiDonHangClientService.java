package com.example.datn_f5_store.service.client;
import com.example.datn_f5_store.entity.ChiTietHoaDonEntity;
import com.example.datn_f5_store.entity.HoaDonEntity;

import java.util.List;

public interface TheoDoiDonHangClientService {
    List<ChiTietHoaDonEntity> getHoaDonByMa(String ma);
}
