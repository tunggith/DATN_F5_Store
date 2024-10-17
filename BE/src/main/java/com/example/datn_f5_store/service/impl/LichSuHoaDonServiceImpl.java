package com.example.datn_f5_store.service.impl;

import com.example.datn_f5_store.dto.LichSuHoaDonDto;
import com.example.datn_f5_store.entity.HoaDonEntity;
import com.example.datn_f5_store.entity.LichSuHoaDonEntity;
import com.example.datn_f5_store.repository.IHoaDonRepository;
import com.example.datn_f5_store.repository.ILichSuHoaDonRepository;
import com.example.datn_f5_store.response.DataResponse;
import com.example.datn_f5_store.service.ILichSuHoaDonService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class LichSuHoaDonServiceImpl implements ILichSuHoaDonService {

    @Autowired
    private ILichSuHoaDonRepository lichSuHoaDonRepository;
    @Autowired
    private IHoaDonRepository hoaDonRepository;

    @Override
    public Page<LichSuHoaDonDto> getAllLichSuHoaDon(int page, int size, Date startDate, Date endDate) {
        // Tạo đối tượng Pageable để thực hiện phân trang
        Pageable pageable = PageRequest.of(page, size);

        // Khai báo Page để lưu danh sách LichSuHoaDonEntity đã phân trang
        Page<LichSuHoaDonEntity> lichSuHoaDonEntities;

        // Kiểm tra điều kiện ngày
        if (startDate != null && endDate != null) {
            lichSuHoaDonEntities = lichSuHoaDonRepository.findByThoiGianThucHienBetween(startDate, endDate, pageable);
        } else {
            lichSuHoaDonEntities = lichSuHoaDonRepository.findAll(pageable);
        }

        // Chuyển đổi từ LichSuHoaDonEntity sang LichSuHoaDonDto
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

    @Override
    public List<LichSuHoaDonDto> getByHoaDon(Integer idHoaDon) {
        List<LichSuHoaDonEntity> lichSuHoaDon = lichSuHoaDonRepository.findByHoaDon_Id(idHoaDon);
        return lichSuHoaDon.stream()
                .map(entity ->new LichSuHoaDonDto(
                        entity.getId(),
                        entity.getHoaDon(),
                        entity.getNhanVien(),
                        entity.getGhiChu(),
                        entity.getThoiGianThucHien(),
                        entity.getTrangThaiCu(),
                        entity.getTrangThaiMoi(),
                        entity.getLoaiThayDoi()
        )).collect(Collectors.toList());
    }
}


