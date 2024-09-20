package com.example.datn_f5_store.service.impl;

import com.example.datn_f5_store.dto.SanPhamDto;
import com.example.datn_f5_store.entity.SanPhamEntity;
import com.example.datn_f5_store.repository.ISanPhamRepository;
import com.example.datn_f5_store.service.SanPhamService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SanPhamServiceImpl implements SanPhamService {
    @Autowired
    private ISanPhamRepository sanPhamRepo;
    @Override
    public Page<SanPhamDto> getAll(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<SanPhamEntity> sanPhamPage = sanPhamRepo.findAll(pageable);

        // Sử dụng phương thức map của Page để chuyển đổi từ SanPhamEntity sang SanPhamDto
        Page<SanPhamDto> sanPhamDtos = sanPhamPage.map(entity -> new SanPhamDto(
                entity.getId(),
                entity.getMa(),
                entity.getTen(),
                entity.getXuatXu(),
                entity.getThuongHieu(),
                entity.getChatLieu(),
                entity.getTrangThai()
        ));
        return sanPhamDtos;
    }

}
