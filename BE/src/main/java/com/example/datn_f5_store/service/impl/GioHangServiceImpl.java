package com.example.datn_f5_store.service.impl;
import com.example.datn_f5_store.entity.GioHangEntity;
import com.example.datn_f5_store.repository.IGioHangRepository;
import com.example.datn_f5_store.request.ChiTietSanphamRequest;
import com.example.datn_f5_store.request.GioHangRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.validation.BindingResult;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Service
public class GioHangServiceImpl {

    @Autowired
    private IGioHangRepository repogh;
    public ResponseEntity getAllPhanTrang(Integer curentPage) {
        int size =5;
        Pageable pageable = PageRequest.of(curentPage, size);

        // Lấy kết quả phân trang từ repository
        var pageResult = repogh.getallPhanTrang(pageable);

        // Trả về danh sách kết quả
        return ResponseEntity.ok(pageResult.getContent());

    }


    public ResponseEntity<?> create(GioHangRequest ghRequest, BindingResult result) {
        // Kiểm tra các lỗi xác thực
        if (result.hasErrors()) {
            // Nếu có lỗi, trả về thông báo lỗi
            return ResponseEntity.badRequest().body(result.getAllErrors());
        }

        // Chuyển đổi GioHangRequest thành GioHangEntity
        GioHangEntity gioHangEntity = new GioHangEntity();
        gioHangEntity.setKhachHang(ghRequest.getKhachHang()); // Cần chắc chắn rằng bạn đã có getter cho trường này
        gioHangEntity.setThoiGianTao(new Date()); // Hoặc sử dụng trường thời gian cụ thể nếu cần

        // Lưu giỏ hàng vào cơ sở dữ liệu
         repogh.save(gioHangEntity);

        // Trả về thông tin giỏ hàng đã lưu
         return ResponseEntity.status(201).body("Lưu chi tiết sản phẩm thành công!");
    }




}
