package com.example.datn_f5_store.service.impl;

import com.example.datn_f5_store.dto.GioiTinhDto;
import com.example.datn_f5_store.entity.GioiTinhEntity;
import com.example.datn_f5_store.repository.IGioiTinhRepository;
import com.example.datn_f5_store.service.IGioiTinhService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class GioiTinhServiceImpl implements IGioiTinhService {
    @Autowired
    private IGioiTinhRepository chatLieuRepository;

    @Override
    public List<GioiTinhDto> getAll() {
        List<GioiTinhEntity> chatLieu = chatLieuRepository.findAll();
        return chatLieu.stream()
                .map(entity-> new GioiTinhDto(
                        entity.getId(),
                        entity.getTen()
                )).collect(Collectors.toList());
    }
}
