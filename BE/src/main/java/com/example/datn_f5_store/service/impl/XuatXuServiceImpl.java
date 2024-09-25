package com.example.datn_f5_store.service.impl;

import com.example.datn_f5_store.dto.XuatXuDto;
import com.example.datn_f5_store.entity.XuatXuEntity;
import com.example.datn_f5_store.repository.IXuatXuRepository;
import com.example.datn_f5_store.service.IXuatXuService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class XuatXuServiceImpl implements IXuatXuService {
    @Autowired
    private IXuatXuRepository xuatXuRepository;
    @Override
    public List<XuatXuDto> getAll() {
        List<XuatXuEntity> xuatXu = xuatXuRepository.findAll();
        return xuatXu.stream().map(entity -> new XuatXuDto(
                entity.getId(),
                entity.getMa(),
                entity.getTen()
        )).collect(Collectors.toList());
    }
}