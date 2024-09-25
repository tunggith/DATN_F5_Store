package com.example.datn_f5_store.service.impl;

import com.example.datn_f5_store.dto.TheLoaiDto;
import com.example.datn_f5_store.entity.TheLoaiEntity;
import com.example.datn_f5_store.repository.ITheLoaiRepository;
import com.example.datn_f5_store.service.ITheLoaiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TheLoaiServiceImpl implements ITheLoaiService {
    @Autowired
    private ITheLoaiRepository chatLieuRepository;

    @Override
    public List<TheLoaiDto> getAll() {
        List<TheLoaiEntity> chatLieu = chatLieuRepository.findAll();
        return chatLieu.stream()
                .map(entity-> new TheLoaiDto(
                        entity.getId(),
                        entity.getTen()
                )).collect(Collectors.toList());
    }
}
