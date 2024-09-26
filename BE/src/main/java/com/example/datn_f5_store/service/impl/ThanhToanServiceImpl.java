package com.example.datn_f5_store.service.impl;

import com.example.datn_f5_store.dto.ThanhToanDto;
import com.example.datn_f5_store.entity.ThanhToanEntity;
import com.example.datn_f5_store.repository.IThanhToanRepository;
import com.example.datn_f5_store.service.IThanhToanService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ThanhToanServiceImpl implements IThanhToanService {
    @Autowired
    private IThanhToanRepository thanhToanRepository;
    @Override
    public List<ThanhToanDto> getAll() {
        List<ThanhToanEntity> thanhToan = thanhToanRepository.findAll();
        return thanhToan.stream().map(entity->new ThanhToanDto(
                entity.getId(),
                entity.getTenPhuongThuc(),
                entity.getTrangThai()
        )).collect(Collectors.toList());
    }
}
