package com.example.datn_f5_store.service.impl;

import com.example.datn_f5_store.dto.ChatLieuDto;
import com.example.datn_f5_store.entity.ChatLieuEntity;
import com.example.datn_f5_store.repository.IChatLieuRepository;
import com.example.datn_f5_store.service.IChatLieuService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ChatLieuServiceImpl implements IChatLieuService {
    @Autowired
    private IChatLieuRepository chatLieuRepository;

    @Override
    public List<ChatLieuDto> getAll() {
        List<ChatLieuEntity> chatLieu = chatLieuRepository.findAll();
        return chatLieu.stream()
                .map(entity-> new ChatLieuDto(
                        entity.getId(),
                        entity.getMa(),
                        entity.getTen()
                )).collect(Collectors.toList());
    }
}
