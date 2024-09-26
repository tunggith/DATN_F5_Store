package com.example.datn_f5_store.service.impl;

import com.example.datn_f5_store.dto.SizeDto;
import com.example.datn_f5_store.dto.XuatXuDto;
import com.example.datn_f5_store.entity.SizeEntity;
import com.example.datn_f5_store.entity.XuatXuEntity;
import com.example.datn_f5_store.repository.ISizeRepository;
import com.example.datn_f5_store.request.SizeRequest;
import com.example.datn_f5_store.request.XuatXuRequest;
import com.example.datn_f5_store.response.DataResponse;
import com.example.datn_f5_store.response.ResultModel;
import com.example.datn_f5_store.service.ISizeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SizeServiceImpl implements ISizeService {
    @Autowired
    private ISizeRepository sizeRepository;
    @Override
    public List<SizeDto> getAll() {
        List<SizeEntity> size = sizeRepository.findAll();
        return size.stream().map(entity -> new SizeDto(
                entity.getId(),
                entity.getMa(),
                entity.getTen()
        )).collect(Collectors.toList());
    }

    @Override
    public DataResponse create(SizeRequest request) {
        // Kiểm tra dữ liệu hợp lệ của request
        if (request.getMa() == null || request.getMa().isEmpty()) {
            return new DataResponse(false, new ResultModel<>(null, "Mã sze không được để trống"));
        }
        if (request.getTen() == null || request.getTen().isEmpty()) {
            return new DataResponse(false, new ResultModel<>(null, "Tên size không được để trống"));
        }

        // Kiểm tra trùng lặp mã hoặc tên thương hiệu
        boolean isExist = sizeRepository.existsByMaOrTen(request.getMa(), request.getTen());
        if (isExist) {
            return new DataResponse(false, new ResultModel<>(null, "Mã hoặc tên size đã tồn tại"));
        }

        // Nếu hợp lệ, tạo mới thương hiệu
        return this.createOfUpdate(new SizeEntity(), request);
    }

    @Override
    public DataResponse update(SizeRequest request, Integer id) {
        // Kiểm tra dữ liệu hợp lệ của request
        if (request.getMa() == null || request.getMa().isEmpty()) {
            return new DataResponse(false, new ResultModel<>(null, "Mã size không được để trống"));
        }
        if (request.getTen() == null || request.getTen().isEmpty()) {
            return new DataResponse(false, new ResultModel<>(null, "Tên size không được để trống"));
        }

        // Kiểm tra xem thương hiệu có tồn tại hay không
        SizeEntity size = sizeRepository.findById(id).orElse(null);
        if (size == null) {
            return new DataResponse(false, new ResultModel<>(null, "Size không tồn tại"));
        }
        request.setId(id);
        // Nếu hợp lệ, cập nhật thương hiệu
        return this.createOfUpdate(size, request);
    }

    // Phương thức tạo mới hoặc cập nhật thương hiệu
    private DataResponse createOfUpdate(SizeEntity entity, SizeRequest request) {
        try {
            this.convertSize(entity, request);
            sizeRepository.save(entity);
            return new DataResponse(true, new ResultModel<>(null, "Thành công"));
        } catch (Exception e) {
            e.printStackTrace();
            return new DataResponse(false, new ResultModel<>(null, "create or update exception!"));
        }
    }

    // Phương thức chuyển đổi dữ liệu từ request sang entity của thương hiệu
    private void convertSize(SizeEntity entity, SizeRequest request) {
        entity.setId(request.getId());
        entity.setMa(request.getMa());
        entity.setTen(request.getTen());
    }
}
