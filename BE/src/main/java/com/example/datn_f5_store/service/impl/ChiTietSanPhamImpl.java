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
        int size = 3;
        Pageable pageable = PageRequest.of(currentPage, size);

        // Lấy kết quả phân trang từ repository
        var pageResult = repo_ctsp.getALLPhanTrang(pageable);

        // Trả về danh sách kết quả
        return ResponseEntity.ok(pageResult.getContent());
    }

    public ResponseEntity<?> getallPhanTrangbyidSP(
            Integer id,
            Integer currentPage

    ) {
        int size = 5;
        Pageable pageable = PageRequest.of(currentPage, size);

        // Lấy kết quả phân trang từ repository
        var pageResult = repo_ctsp.getALLByIDSPCTPhanTrang(id, pageable);

        // Trả về danh sách kết quả
        return ResponseEntity.ok(pageResult.getContent());
    }

    public ResponseEntity<?> saveChiTietSanPham(ChiTietSanphamRequest ctspRequet, BindingResult result,
                                                Integer idSanpham,
                                                Integer idMau,
                                                Integer idSize) {

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
                idSanpham, idMau, idSize, ctspRequet.getMa(), ctspRequet.getTen()
        );

        if (exists) {
            return ResponseEntity.status(409).body("Sản phẩm đã tồn tại với các thông tin đã nhập!");  // HTTP 409 Conflict
        }

        // Tìm thực thể từ database
        SanPhamEntity sanPham = repo_sanPham.findById(idSanpham)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm với id: " + idSanpham));

        MauSacEntity mauSac = repo_mauSac.findById(idMau)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy màu sắc với id: " + idMau));

        SizeEntity size = repo_size.findById(idSize)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy kích thước với id: " + idSize));

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

    public ResponseEntity<?> updateChiTietSanPham(Integer id,
                                                  ChiTietSanphamRequest ctspRequest, BindingResult result,
                                                  Integer idSanpham,
                                                  Integer idMau,
                                                  Integer idSize) {

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
        SanPhamEntity sanPham = repo_sanPham.findById(idSanpham)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm với id: " + idSanpham));

        MauSacEntity mauSac = repo_mauSac.findById(idMau)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy màu sắc với id: " + idMau));

        SizeEntity size = repo_size.findById(idSize)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy kích thước với id: " + idSize));

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
}
