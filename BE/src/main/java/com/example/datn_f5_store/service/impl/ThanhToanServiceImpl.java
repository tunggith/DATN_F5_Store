package com.example.datn_f5_store.service.impl;

import com.example.datn_f5_store.dto.ThanhToanDto;
import com.example.datn_f5_store.entity.PhuongThucThanhToanEntity;
import com.example.datn_f5_store.repository.IThanhToanRepository;
import com.example.datn_f5_store.service.IThanhToanService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ThanhToanServiceImpl implements IThanhToanService {

    // Tiêm IThanhToanRepository để sử dụng các phương thức truy xuất dữ liệu
    @Autowired
    private IThanhToanRepository thanhToanRepository;

    // Phương thức lấy tất cả phương thức thanh toán
    @Override
    public List<ThanhToanDto> getAll() {
        // Lấy tất cả các thực thể thanh toán từ repository
        List<PhuongThucThanhToanEntity> thanhToan = thanhToanRepository.findAll();

        // Chuyển đổi danh sách các thực thể thành danh sách DTO
        return thanhToan.stream().map(entity -> new ThanhToanDto(
                entity.getId(),
                entity.getTenPhuongThuc(), // Tên phương thức thanh toán
                entity.getTrangThai() // Trạng thái phương thức thanh toán
        )).collect(Collectors.toList()); // Thu thập kết quả vào danh sách
    }
}
