package com.example.datn_f5_store.service.impl;

import com.example.datn_f5_store.dto.AnhChiTietSanPhamDto;
import com.example.datn_f5_store.dto.DiaChiKhachHangDto;
import com.example.datn_f5_store.entity.AnhChiTietSanPham;
import com.example.datn_f5_store.entity.DiaChiKhachHangEntity;
import com.example.datn_f5_store.repository.IAnhChiTietSanPhamRepository;
import com.example.datn_f5_store.request.AnhChiTietSanPhamRequest;
import com.example.datn_f5_store.service.IAnhChiTietSanPhamService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AnhChiTietSanPhamImpl implements IAnhChiTietSanPhamService {
    @Autowired
    private IAnhChiTietSanPhamRepository anhChiTietSanPhamRepository;
    @Override
    public Page<AnhChiTietSanPhamDto> getAllAnhChiTietSanPham(int page, int size, String search) {
        Pageable pageable = PageRequest.of(page, size);
        Page<AnhChiTietSanPham> anhChiTietSanPhams;

        if (search != null && !search.trim().isEmpty()) {
            anhChiTietSanPhams = anhChiTietSanPhamRepository.findBySearch(search, pageable);
        } else {
            anhChiTietSanPhams = anhChiTietSanPhamRepository.findAll(pageable);
        }
        return anhChiTietSanPhams.map(entity -> new AnhChiTietSanPhamDto(
                entity.getId(),
                entity.getChiTietSanPham(),
                entity.getUrlAnh()
        ));
    }

    @Override
    public Boolean addAnhChiTietSanPham(AnhChiTietSanPhamRequest anhChiTietSanPhamRequest) {
        if (anhChiTietSanPhamRepository.existsByUrlAnh(anhChiTietSanPhamRequest.getUrlAnh())) {
            System.out.println("Đường dẫn link ảnh đã tồn tại!");
            return false;
        }
        try {
            AnhChiTietSanPham anhChiTietSanPham = new AnhChiTietSanPham();
            anhChiTietSanPham.setChiTietSanPham(anhChiTietSanPhamRequest.getChiTietSanPham());
            anhChiTietSanPham.setUrlAnh(anhChiTietSanPhamRequest.getUrlAnh());
            anhChiTietSanPhamRepository.save(anhChiTietSanPham);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    @Override
    public Boolean updateAnhChiTietSanPham(Integer id,AnhChiTietSanPhamRequest anhChiTietSanPhamRequest) {
        Optional<AnhChiTietSanPham> optional = anhChiTietSanPhamRepository.findById(id);
        if (optional.isPresent()) {
            AnhChiTietSanPham anhChiTietSanPham = optional.get();
            try {
                anhChiTietSanPham.setChiTietSanPham(anhChiTietSanPhamRequest.getChiTietSanPham());
                anhChiTietSanPham.setUrlAnh(anhChiTietSanPhamRequest.getUrlAnh());
                anhChiTietSanPhamRepository.save(anhChiTietSanPham);
                return true;
            } catch (Exception e) {
                e.printStackTrace();
                return false;
            }
        } else {
            return false;
        }
    }
}
