package com.example.datn_f5_store.service.client.impl;

import com.example.datn_f5_store.entity.HoaDonEntity;
import com.example.datn_f5_store.repository.TheoDoiDonHangRepository;
import com.example.datn_f5_store.service.client.TheoDoiDonHangClientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import static org.springframework.http.HttpStatus.NOT_FOUND;

@Service
public class TheoDoiDonHangServiceImpl implements TheoDoiDonHangClientService {

    @Autowired
    private TheoDoiDonHangRepository theoDoiDonHangRepository;

    @Override
    public HoaDonEntity getHoaDonByMa(String ma) {
        return theoDoiDonHangRepository.findByMa(ma)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy hóa đơn với mã: " + ma));
    }
}
