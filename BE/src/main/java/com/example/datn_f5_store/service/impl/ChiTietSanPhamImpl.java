package com.example.datn_f5_store.service.impl;

import com.example.datn_f5_store.response.ChiTietSanPhamReponse;
import com.example.datn_f5_store.entity.ChiTietSanPhamEntity;
import com.example.datn_f5_store.entity.MauSacEntity;
import com.example.datn_f5_store.entity.SanPhamEntity;
import com.example.datn_f5_store.entity.SizeEntity;
import com.example.datn_f5_store.repository.IChiTietSanPhamRepository;
import com.example.datn_f5_store.repository.IMauSacRepository;
import com.example.datn_f5_store.repository.ISanPhamRepository;
import com.example.datn_f5_store.repository.ISizeRepository;
import com.example.datn_f5_store.request.ChiTietSanphamRequest;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.validation.BindingResult;

import java.util.HashMap;
import java.util.Map;

@Service
public class ChiTietSanPhamImpl {
    @Autowired
    IChiTietSanPhamRepository repo_ctsp;
    @Autowired
    IMauSacRepository repo_mauSac;
    @Autowired
    ISizeRepository repo_size;
    @Autowired
    ISanPhamRepository repo_sanPham;

    public ResponseEntity<?> getallPhanTrang(
            Integer currentPage
    ) {
        int size = 5;
        Pageable pageable = PageRequest.of(currentPage, size);

        // Lấy kết quả phân trang từ repository
        var pageResult = repo_ctsp.getALLPhanTrang(pageable);

        // Trả về danh sách kết quả
        return ResponseEntity.ok(pageResult.getContent());
    }

    public Page<?> getallPhanTrangbyidSP(Integer id, Integer currentPage) {
        int size = 5;
        Pageable pageable = PageRequest.of(currentPage, size);

        // Lấy kết quả phân trang từ repository
        var pageResult = repo_ctsp.getALLByIDSPCTPhanTrang(id, pageable);

        // Trả về kết quả phân trang gồm cả nội dung và thông tin phân trang
        return pageResult;
    }



    public ResponseEntity<?> saveChiTietSanPham(ChiTietSanphamRequest ctspRequet, BindingResult result) {
        // Kiểm tra nếu có lỗi
        if (result.hasErrors()) {
            Map<String, String> errors = new HashMap<>();
            result.getFieldErrors().forEach(error -> {
                errors.put(error.getField(), error.getDefaultMessage());
            });
            return ResponseEntity.badRequest().body(errors);
        }

        // Kiểm tra sản phẩm có trùng không
        boolean exists = repo_ctsp.checkTrung(
                ctspRequet.getIdSanPham().getId(),
                ctspRequet.getIdMauSac().getId(),
                ctspRequet.getIdSize().getId(),
                ctspRequet.getMa(),
                ctspRequet.getTen()
        );

        if (exists) {
            return ResponseEntity.status(409).body("Sản phẩm đã tồn tại với các thông tin đã nhập!");
        }

        // Tìm thực thể từ database
        SanPhamEntity sanPham = repo_sanPham.findById(ctspRequet.getIdSanPham().getId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm với id: " + ctspRequet.getIdSanPham().getId()));

        MauSacEntity mauSac = repo_mauSac.findById(ctspRequet.getIdMauSac().getId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy màu sắc với id: " + ctspRequet.getIdMauSac().getId()));

        SizeEntity size = repo_size.findById(ctspRequet.getIdSize().getId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy kích thước với id: " + ctspRequet.getIdSize().getId()));

        // Tạo mới chi tiết sản phẩm và sao chép thuộc tính
        ChiTietSanPhamEntity chiTietSanPham = new ChiTietSanPhamEntity();
        BeanUtils.copyProperties(ctspRequet, chiTietSanPham);

        // Gán các thực thể vào chi tiết sản phẩm
        chiTietSanPham.setSanPham(sanPham);
        chiTietSanPham.setMauSac(mauSac);
        chiTietSanPham.setSize(size);

        // Lưu chi tiết sản phẩm
        repo_ctsp.save(chiTietSanPham);

        // Trả về thông báo thành công kèm theo HTTP 201 Created
        return ResponseEntity.status(201).body("Lưu chi tiết sản phẩm thành công!");
    }

    public ResponseEntity<?> updateChiTietSanPham(Integer id, ChiTietSanphamRequest ctspRequest, BindingResult result) {
        // Kiểm tra nếu có lỗi
        if (result.hasErrors()) {
            Map<String, String> errors = new HashMap<>();
            result.getFieldErrors().forEach(error -> {
                errors.put(error.getField(), error.getDefaultMessage());
            });
            return ResponseEntity.badRequest().body(errors);
        }

        // Tìm chi tiết sản phẩm theo ID
        ChiTietSanPhamEntity chiTietSanPham = repo_ctsp.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy chi tiết sản phẩm với id: " + id));

        // Tìm thực thể từ database
        SanPhamEntity sanPham = repo_sanPham.findById(ctspRequest.getIdSanPham().getId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm với id: " + ctspRequest.getIdSanPham().getId()));

        MauSacEntity mauSac = repo_mauSac.findById(ctspRequest.getIdMauSac().getId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy màu sắc với id: " + ctspRequest.getIdMauSac().getId()));

        SizeEntity size = repo_size.findById(ctspRequest.getIdSize().getId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy kích thước với id: " + ctspRequest.getIdSize().getId()));

        // Sao chép các thuộc tính từ request sang chi tiết sản phẩm
        BeanUtils.copyProperties(ctspRequest, chiTietSanPham);

        // Gán các thực thể vào chi tiết sản phẩm
        chiTietSanPham.setSanPham(sanPham);
        chiTietSanPham.setMauSac(mauSac);
        chiTietSanPham.setSize(size);

        // Lưu cập nhật chi tiết sản phẩm
        repo_ctsp.save(chiTietSanPham);

        // Trả về thông báo thành công kèm theo HTTP 200 OK
        return ResponseEntity.ok("Cập nhật chi tiết sản phẩm thành công!");
    }

    public Page<ChiTietSanPhamReponse> searchByTenOrMa(String keyword, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return repo_ctsp.searchByTenOrMa(keyword, pageable);
    }

    public Page<ChiTietSanPhamReponse> filterByPrice(Double minPrice, Double maxPrice, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return repo_ctsp.filterByPrice(minPrice, maxPrice, pageable);
    }

    public Page<ChiTietSanPhamReponse> getByTrangThaiSanPhamAndTrangThai(int page, int size, String ten, String ma) {
        Pageable pageable = PageRequest.of(page, size);
        Page<ChiTietSanPhamEntity> chiTietSanPham;
        if (ten == null && ten.isEmpty() && ma == null && ma.isEmpty()) {
            chiTietSanPham = repo_ctsp.findByTrangThaiAndSanPhamTrangThai("còn hàng", "đang hoạt động", pageable);
        } else {
            chiTietSanPham = repo_ctsp.getByTrangThaiAndSanPhamTrangThaiAndTenContainingOrMaContaining(
                    "còn hàng",
                    "đang hoạt động",
                    ten,
                    ma,
                    pageable);
        }
        return chiTietSanPham.map(entity -> new ChiTietSanPhamReponse(
                entity.getId(),
                entity.getSanPham(),
                entity.getMauSac(),
                entity.getSize(),
                entity.getMa(),
                entity.getTen(),
                entity.getDonGia(),
                entity.getSoLuong(),
                entity.getTrangThai()
        ));
    }


    public ChiTietSanPhamEntity getChiTietSanPhamById(Integer id) {
        return repo_ctsp.findById(id).get();
    }

    public boolean isChiTietSanPhamExists(String ma, String ten) {
        return repo_ctsp.existsByMaOrTen(ma, ten);
    }

}
