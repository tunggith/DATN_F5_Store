package com.example.datn_f5_store.service.impl;

import com.example.datn_f5_store.dto.ThuongHieuDto;
import com.example.datn_f5_store.entity.ThuongHieuEntity;
import com.example.datn_f5_store.repository.IThuongHieuRepository;
import com.example.datn_f5_store.request.ThuongHieuRequest;
import com.example.datn_f5_store.response.DataResponse;
import com.example.datn_f5_store.response.ResultModel;
import com.example.datn_f5_store.service.IThuongHieuService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ThuongHieuServiceImpl implements IThuongHieuService {
    @Autowired
    private IThuongHieuRepository thuongHieuRepository;

    @Override
    public List<ThuongHieuDto> getAll() {
        List<ThuongHieuEntity> thuongHieu = thuongHieuRepository.findAll();
        return thuongHieu.stream()
                .map(entity -> new ThuongHieuDto(
                        entity.getId(),
                        entity.getMa(),
                        entity.getTen()
                )).collect(Collectors.toList());
    }

    @Override
    public DataResponse create(ThuongHieuRequest request) {
        // Kiểm tra dữ liệu hợp lệ của request
        if (request.getMa() == null || request.getMa().isEmpty()) {
            return new DataResponse(false, new ResultModel<>(null, "Mã thương hiệu không được để trống"));
        }
        if (request.getTen() == null || request.getTen().isEmpty()) {
            return new DataResponse(false, new ResultModel<>(null, "Tên thương hiệu không được để trống"));
        }

        // Kiểm tra trùng lặp mã hoặc tên thương hiệu
        boolean isExist = thuongHieuRepository.existsByMaOrTen(request.getMa(), request.getTen());
        if (isExist) {
            return new DataResponse(false, new ResultModel<>(null, "Mã hoặc tên thương hiệu đã tồn tại"));
        }

        // Nếu hợp lệ, tạo mới thương hiệu
        return this.createOfUpdate(new ThuongHieuEntity(), request);
    }

    @Override
    public DataResponse update(ThuongHieuRequest request, Integer id) {
        // Kiểm tra dữ liệu hợp lệ của request
        if (request.getMa() == null || request.getMa().isEmpty()) {
            return new DataResponse(false, new ResultModel<>(null, "Mã thương hiệu không được để trống"));
        }
        if (request.getTen() == null || request.getTen().isEmpty()) {
            return new DataResponse(false, new ResultModel<>(null, "Tên thương hiệu không được để trống"));
        }

        // Kiểm tra xem thương hiệu có tồn tại hay không
        ThuongHieuEntity thuongHieu = thuongHieuRepository.findById(id).orElse(null);
        if (thuongHieu == null) {
            return new DataResponse(false, new ResultModel<>(null, "Thương hiệu không tồn tại"));
        }
        request.setId(id);
        // Nếu hợp lệ, cập nhật thương hiệu
        return this.createOfUpdate(thuongHieu, request);
    }

    // Phương thức tạo mới hoặc cập nhật thương hiệu
    private DataResponse createOfUpdate(ThuongHieuEntity entity, ThuongHieuRequest request) {
        try {
            this.convertThuongHieu(entity, request);
            thuongHieuRepository.save(entity);
            return new DataResponse(true, new ResultModel<>(null, "Thành công"));
        } catch (Exception e) {
            e.printStackTrace();
            return new DataResponse(false, new ResultModel<>(null, "create or update exception!"));
        }
    }

    // Phương thức chuyển đổi dữ liệu từ request sang entity của thương hiệu
    private void convertThuongHieu(ThuongHieuEntity entity, ThuongHieuRequest request) {
        entity.setId(request.getId());
        entity.setMa(request.getMa());
        entity.setTen(request.getTen());
    }
}

