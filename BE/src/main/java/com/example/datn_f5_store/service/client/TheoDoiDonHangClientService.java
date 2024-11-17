package com.example.datn_f5_store.service.client;

import com.example.datn_f5_store.entity.HoaDonEntity;

public interface TheoDoiDonHangClientService {
    HoaDonEntity getHoaDonByMa(String ma);
}