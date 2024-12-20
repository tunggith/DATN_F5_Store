package com.example.datn_f5_store.service.impl;

import com.example.datn_f5_store.dto.ChiTietSanPhamDto;
import com.example.datn_f5_store.entity.AnhChiTietSanPham;
import com.example.datn_f5_store.entity.ChiTietSanPhamEntity;
import com.example.datn_f5_store.repository.IAnhChiTietSanPhamRepository;
import com.example.datn_f5_store.repository.IChiTietSanPhamRepository;
import com.example.datn_f5_store.service.ISanPhamClientservice;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SanPhamClientImpl implements ISanPhamClientservice {

    @Autowired
    private IAnhChiTietSanPhamRepository repoAnh;
    @Autowired
    private IChiTietSanPhamRepository chiTietSanPhamRepository;
    @Override
    public Page<AnhChiTietSanPham> getSanPham(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return repoAnh.getallAnhSanPham( "Đang hoạt động", pageable);
    }

    @Override
    public Page<AnhChiTietSanPham> getFilteredProducts(
            Integer gioiTinh,
            Integer thuongHieu,
            Integer xuatXu,
            Double giaMin,
            Double giaMax,
            Integer mauSac,
            Integer kichThuoc,
            Pageable pageable
    ) {
        // Xử lý các giá trị mặc định cho giá nếu cần thiết
        if (giaMin == null) {
            giaMin = 0.0; // Giá tối thiểu mặc định
        }
        if (giaMax == null) {
            giaMax = Double.MAX_VALUE; // Giá tối đa mặc định
        }

        // Gọi repository để lấy danh sách sản phẩm đã được lọc
        return repoAnh.findFilteredProducts(
                gioiTinh,
                thuongHieu,
                xuatXu,
                giaMin,
                giaMax,
                mauSac,
                kichThuoc,
                "Đang hoạt động",
                pageable
        );
    }

    @Override
    public ChiTietSanPhamEntity getSoLuong(Integer id) {
        ChiTietSanPhamEntity entity = chiTietSanPhamRepository.findById(id).orElseThrow();
        return entity;
    }

    @Override
    public List<ChiTietSanPhamDto> getListChiTietSanPham() {
        List<ChiTietSanPhamEntity> entities = chiTietSanPhamRepository.findAll();
        return entities.stream().map(entity->new ChiTietSanPhamDto(
                entity.getId(),
                entity.getMa(),
                entity.getSoLuong()
        )).collect(Collectors.toList());
    }


}
