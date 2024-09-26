package com.example.datn_f5_store.service.impl;

import com.example.datn_f5_store.dto.XuatXuDto;
import com.example.datn_f5_store.entity.ThuongHieuEntity;
import com.example.datn_f5_store.entity.XuatXuEntity;
import com.example.datn_f5_store.repository.IXuatXuRepository;
import com.example.datn_f5_store.request.ThuongHieuRequest;
import com.example.datn_f5_store.request.XuatXuRequest;
import com.example.datn_f5_store.response.DataResponse;
import com.example.datn_f5_store.response.ResultModel;
import com.example.datn_f5_store.service.IXuatXuService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class XuatXuServiceImpl implements IXuatXuService {
    @Autowired
    private IXuatXuRepository xuatXuRepository;
    @Override
    public List<XuatXuDto> getAll() {
        List<XuatXuEntity> xuatXu = xuatXuRepository.findAll();
        return xuatXu.stream().map(entity -> new XuatXuDto(
                entity.getId(),
                entity.getMa(),
                entity.getTen()
        )).collect(Collectors.toList());
    }

    @Override
    public DataResponse create(XuatXuRequest request) {
        // Kiểm tra dữ liệu hợp lệ của request
        if (request.getMa() == null || request.getMa().isEmpty()) {
            return new DataResponse(false, new ResultModel<>(null, "Mã thương hiệu không được để trống"));
        }
        if (request.getTen() == null || request.getTen().isEmpty()) {
            return new DataResponse(false, new ResultModel<>(null, "Tên thương hiệu không được để trống"));
        }

        // Kiểm tra trùng lặp mã hoặc tên thương hiệu
        boolean isExist = xuatXuRepository.existsByMaOrTen(request.getMa(), request.getTen());
        if (isExist) {
            return new DataResponse(false, new ResultModel<>(null, "Mã hoặc tên thương hiệu đã tồn tại"));
        }

        // Nếu hợp lệ, tạo mới thương hiệu
        return this.createOfUpdate(new XuatXuEntity(), request);
    }

    @Override
    public DataResponse update(XuatXuRequest request, Integer id) {
        // Kiểm tra dữ liệu hợp lệ của request
        if (request.getMa() == null || request.getMa().isEmpty()) {
            return new DataResponse(false, new ResultModel<>(null, "Mã thương hiệu không được để trống"));
        }
        if (request.getTen() == null || request.getTen().isEmpty()) {
            return new DataResponse(false, new ResultModel<>(null, "Tên thương hiệu không được để trống"));
        }

        // Kiểm tra xem thương hiệu có tồn tại hay không
        XuatXuEntity xuatXu = xuatXuRepository.findById(id).orElse(null);
        if (xuatXu == null) {
            return new DataResponse(false, new ResultModel<>(null, "Thương hiệu không tồn tại"));
        }
        request.setId(id);
        // Nếu hợp lệ, cập nhật thương hiệu
        return this.createOfUpdate(xuatXu, request);
    }

    // Phương thức tạo mới hoặc cập nhật thương hiệu
    private DataResponse createOfUpdate(XuatXuEntity entity, XuatXuRequest request) {
        try {
            this.convertXuatXu(entity, request);
            xuatXuRepository.save(entity);
            return new DataResponse(true, new ResultModel<>(null, "Thành công"));
        } catch (Exception e) {
            e.printStackTrace();
            return new DataResponse(false, new ResultModel<>(null, "create or update exception!"));
        }
    }

    // Phương thức chuyển đổi dữ liệu từ request sang entity của thương hiệu
    private void convertXuatXu(XuatXuEntity entity, XuatXuRequest request) {
        entity.setId(request.getId());
        entity.setMa(request.getMa());
        entity.setTen(request.getTen());
    }
}
