package com.example.datn_f5_store.service.impl;

import com.example.datn_f5_store.entity.ChiTietGioHangEntity;
import com.example.datn_f5_store.entity.ChiTietSanPhamEntity;
import com.example.datn_f5_store.repository.IChiTietGioHangRepository;
import com.example.datn_f5_store.repository.IChiTietSanPhamRepository;
import com.example.datn_f5_store.repository.IGioHangRepository;
import com.example.datn_f5_store.request.ChiTietGioHangRequest;
import com.example.datn_f5_store.response.ChiTietGioHangReponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
public class ChiTietGioHangIplm {

    @Autowired
    private IChiTietGioHangRepository repohgct; // Repository cho ChiTietGioHangEntity

    @Autowired
    private IGioHangRepository repohg; // Repository cho ChiTietGioHangEntity
    @Autowired
    private IChiTietSanPhamRepository repoCTSP; // Repository cho ChiTietSanPhamEntity

    public ResponseEntity<?> getAllPhanTrang(Integer currentPage) {
        int size = 5;
        Pageable pageable = PageRequest.of(currentPage, size);
        var pageResult = repohgct.getallPhanTrang(pageable);
        return ResponseEntity.ok(pageResult.getContent());
    }

    public ResponseEntity<?> searchByTenSanPham(Integer currentPage, String tenSP) {
        int size = 5;
        Pageable pageable = PageRequest.of(currentPage, size);
        var pageResult = repohgct.searchByTenSanPham(tenSP, pageable);
        return ResponseEntity.ok(pageResult.getContent());
    }

    public ChiTietGioHangEntity addOrUpdateChiTietGioHang(ChiTietGioHangRequest chiTietGioHangRequest) {
        ChiTietSanPhamEntity chiTietSanPham = repoCTSP.findById(chiTietGioHangRequest.getIdChiTietSanPham()).get();

        // Kiểm tra số lượng sản phẩm trong kho
        if (chiTietGioHangRequest.getSoLuong() > chiTietSanPham.getSoLuong()) {
            throw new IllegalArgumentException("Số lượng sản phẩm yêu cầu không được lớn hơn số lượng có trong kho.");
        }

        ChiTietGioHangEntity existingChiTietGioHang = repohgct.findByGioHangAndChiTietSanPham(
                repohg.findById(chiTietGioHangRequest.getIdGioHang()).get(),
                chiTietSanPham
        );

        if (existingChiTietGioHang != null) {
            // Cập nhật số lượng sản phẩm trong giỏ hàng
            int soLuongTong = existingChiTietGioHang.getSoLuong() + chiTietGioHangRequest.getSoLuong();

            // Kiểm tra số lượng tổng cộng không vượt quá số lượng trong kho
            if (soLuongTong > chiTietSanPham.getSoLuong()) {
                throw new IllegalArgumentException("Số lượng sản phẩm trong giỏ hàng không được lớn hơn số lượng có trong kho.");
            }

            existingChiTietGioHang.setSoLuong(soLuongTong);

            return repohgct.save(existingChiTietGioHang); // Gọi save cho ChiTietGioHangEntity
        } else {
            ChiTietGioHangEntity chiTietGioHangEntity = new ChiTietGioHangEntity();
            chiTietGioHangEntity.setGioHang(repohg.findById(chiTietGioHangRequest.getIdGioHang()).get());
            chiTietGioHangEntity.setChiTietSanPham(chiTietSanPham);
            chiTietGioHangEntity.setSoLuong(chiTietGioHangRequest.getSoLuong());

            return repohgct.save(chiTietGioHangEntity); // Gọi save cho ChiTietGioHangEntity
        }
    }

    public void deleteChiTietGioHang(Integer chiTietGioHangId) {
        repohgct.deleteById(chiTietGioHangId);
    }


}
