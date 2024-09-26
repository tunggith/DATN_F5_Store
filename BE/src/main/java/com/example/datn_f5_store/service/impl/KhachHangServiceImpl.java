package com.example.datn_f5_store.service.impl;

import com.example.datn_f5_store.dto.KhachHangDto;
import com.example.datn_f5_store.entity.KhachHangEntity;
import com.example.datn_f5_store.repository.IKhachHangRepository;
import com.example.datn_f5_store.request.KhachHangRequest;
import com.example.datn_f5_store.service.KhachHangService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class KhachHangServiceImpl implements KhachHangService {

    @Autowired
    private IKhachHangRepository khachHangRepository;

    @Override
    public Page<KhachHangDto> getAllKhachHang(int page, int size, String search) {
        Pageable pageable = PageRequest.of(page, size);
        Page<KhachHangEntity> khachHangPage;

        // Tìm kiếm khách hàng theo tên, số điện thoại, email, hoặc mã
        if (search != null && !search.trim().isEmpty()) {
            khachHangPage = khachHangRepository.findBySearch(search, pageable);
        } else {
            khachHangPage = khachHangRepository.findAll(pageable);
        }

        // Chuyển đổi từ Page<KhachHangEntity> sang Page<KhachHangDto>
        return khachHangPage.map(khachHangEntity -> new KhachHangDto(
                khachHangEntity.getId(),
                khachHangEntity.getDiaChiKhachHang(),
                khachHangEntity.getMa(),
                khachHangEntity.getTen(),
                khachHangEntity.getGioiTinh(),
                khachHangEntity.getNgayThangNamSinh(),
                khachHangEntity.getEmail(),
                khachHangEntity.getAnh(),
                khachHangEntity.getSdt(),
                khachHangEntity.getUserName(),
                khachHangEntity.getPassword(),
                khachHangEntity.getTrangThai()
        ));
    }
    @Override
    public Boolean addKhachHang(KhachHangRequest khachHangRequest) {
        KhachHangEntity khachHang = new KhachHangEntity();
        // Kiểm tra mã khách hàng đã tồn tại hay chưa
        if (khachHangRepository.existsByMa(khachHangRequest.getMa())) {
            System.out.println("Mã khách hàng đã tồn tại, không thể thêm mới!");
            return false; // Nếu mã đã tồn tại, không thêm khách hàng mới
        }

        // Kiểm tra số điện thoại đã tồn tại hay chưa
        if (khachHangRepository.existsBySdt(khachHangRequest.getSdt())) {
            System.out.println("Số điện thoại đã tồn tại, không thể thêm mới!");
            return false; // Nếu số điện thoại đã tồn tại, không thêm khách hàng mới
        }

        // Kiểm tra email đã tồn tại hay chưa
        if (khachHangRepository.existsByEmail(khachHangRequest.getEmail())) {
            System.out.println("Email đã tồn tại, không thể thêm mới!");
            return false; // Nếu email đã tồn tại, không thêm khách hàng mới
        }

        // Kiểm tra username đã tồn tại hay chưa
        if (khachHangRepository.existsByUserName(khachHangRequest.getUserName())) {
            System.out.println("Username đã tồn tại, không thể thêm mới!");
            return false; // Nếu username đã tồn tại, không thêm khách hàng mới
        }
        // Kiểm tra đuôi email
        if (!khachHangRequest.getEmail().endsWith("@gmail.com")) {
            System.out.println("Email phải có đuôi @gmail.com");
            return false;
        }
        try {
            // Thiết lập thông tin khách hàng từ khachHangRequest
            khachHang.setDiaChiKhachHang(khachHangRequest.getDiaChiKhachHang());
            khachHang.setMa(khachHangRequest.getMa());
            khachHang.setTen(khachHangRequest.getTen());
            khachHang.setGioiTinh(khachHangRequest.getGioiTinh());
            khachHang.setNgayThangNamSinh(khachHangRequest.getNgayThangNamSinh());
            khachHang.setEmail(khachHangRequest.getEmail());
            khachHang.setAnh(khachHangRequest.getAnh());
            khachHang.setSdt(khachHangRequest.getSdt());
            khachHang.setUserName(khachHangRequest.getUserName());
            khachHang.setPassword(khachHangRequest.getPassword());
            khachHang.setTrangThai(khachHangRequest.getTrangThai());

            // Lưu thông tin khách hàng vào cơ sở dữ liệu
            khachHangRepository.save(khachHang);
            return true; // Trả về true nếu thêm thành công
        } catch (Exception e) {
            // In ra chi tiết lỗi
            e.printStackTrace();
            return false; // Trả về false nếu có lỗi
        }
    }


    @Override
    public Boolean updateKhachHang(Integer id, KhachHangRequest khachHangRequest) {
        //kiểm tra khách hàng có tồn tại hay không?
        Optional<KhachHangEntity> kiemTraTonTaiKhachHang = khachHangRepository.findById(id);
        if (kiemTraTonTaiKhachHang.isPresent()) {
            KhachHangEntity khachHang = kiemTraTonTaiKhachHang.get();

            // Kiểm tra đuôi email
            if (!khachHangRequest.getEmail().endsWith("@gmail.com")) {
                System.out.println("Email phải có đuôi @gmail.com");
                return false;
            }

            try {
                // Cập nhật các trường dữ liệu từ KhachHangRequest
                khachHang.setDiaChiKhachHang(khachHangRequest.getDiaChiKhachHang());
                khachHang.setMa(khachHangRequest.getMa());
                khachHang.setTen(khachHangRequest.getTen());
                khachHang.setGioiTinh(khachHangRequest.getGioiTinh());
                khachHang.setNgayThangNamSinh(khachHangRequest.getNgayThangNamSinh());
                khachHang.setEmail(khachHangRequest.getEmail());
                khachHang.setAnh(khachHangRequest.getAnh());
                khachHang.setSdt(khachHangRequest.getSdt());
                khachHang.setUserName(khachHangRequest.getUserName());
                khachHang.setPassword(khachHangRequest.getPassword());
                khachHang.setTrangThai(khachHangRequest.getTrangThai());

                // Lưu thông tin khách hàng sau khi cập nhật
                khachHangRepository.save(khachHang);
                return true; // Trả về true nếu cập nhật thành công
            } catch (Exception e) {
                e.printStackTrace();
                return false;
            }
        } else {
            // Nếu không tìm thấy khách hàng theo ID, trả về false
            return false;
        }
    }
}
