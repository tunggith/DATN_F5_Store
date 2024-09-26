package com.example.datn_f5_store.service.impl;

import com.example.datn_f5_store.dto.LichSuHoaDonDto;
import com.example.datn_f5_store.entity.LichSuHoaDonEntity;
import com.example.datn_f5_store.repository.ILichSuHoaDonRepository;
import com.example.datn_f5_store.service.ILichSuHoaDonService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Date;

@Service
public class LichSuHoaDonServiceImpl implements ILichSuHoaDonService {

    @Autowired
    private ILichSuHoaDonRepository lichSuHoaDonRepository;

    @Override
    public Page<LichSuHoaDonDto> getAllLichSuHoaDon(int page, int size, Date startDate, Date endDate) {
        // Tạo đối tượng Pageable để quản lý phân trang
        Pageable pageable = PageRequest.of(page, size);
        Page<LichSuHoaDonEntity> lichSuHoaDonEntities;

        // Kiểm tra nếu có khoảng thời gian tìm kiếm
        if (startDate != null && endDate != null) {
            lichSuHoaDonEntities = lichSuHoaDonRepository.findByThoiGianThucHienBetween(startDate, endDate, pageable);
        } else {
            lichSuHoaDonEntities = lichSuHoaDonRepository.findAll(pageable);
        }

        // Chuyển đổi từ Page<LichSuHoaDonEntity> sang Page<LichSuHoaDonDto>
        return lichSuHoaDonEntities.map(lichSuHoaDonEntity -> new LichSuHoaDonDto(
                lichSuHoaDonEntity.getId(),
                lichSuHoaDonEntity.getHoaDon(),
                lichSuHoaDonEntity.getNhanVien(),
                lichSuHoaDonEntity.getGhiChu(),
                lichSuHoaDonEntity.getThoiGianThucHien(),
                lichSuHoaDonEntity.getTrangThaiCu(),
                lichSuHoaDonEntity.getTrangThaiMoi(),
                lichSuHoaDonEntity.getLoaiThayDoi()
        ));
    }
}
