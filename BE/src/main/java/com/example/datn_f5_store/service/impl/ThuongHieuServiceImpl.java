package com.example.datn_f5_store.service.impl;

import com.example.datn_f5_store.dto.ThuongHieuDto;
import com.example.datn_f5_store.entity.ThuongHieuEntity;
import com.example.datn_f5_store.repository.IThuongHieuRepository;
import com.example.datn_f5_store.service.IThuongHieuService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ThuongHieuServiceImpl implements IThuongHieuService {
    @Autowired
    private IThuongHieuRepository thuongHieuRepository;
    @Override
    public List<ThuongHieuDto> getAll() {
        List<ThuongHieuEntity> thuongHieu = thuongHieuRepository.findAll();
        return thuongHieu.stream()
                .map(entity->new ThuongHieuDto(
                        entity.getId(),
                        entity.getMa(),
                        entity.getTen()
                )).collect(Collectors.toList());
    }
}
