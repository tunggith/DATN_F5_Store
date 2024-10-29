package com.example.datn_f5_store.service.impl;

import com.example.datn_f5_store.dto.DiaChiKhachHangDto;
import com.example.datn_f5_store.dto.KhachHangDto;
import com.example.datn_f5_store.entity.DiaChiKhachHangEntity;
import com.example.datn_f5_store.entity.KhachHangEntity;
import com.example.datn_f5_store.entity.SanPhamEntity;
import com.example.datn_f5_store.repository.IDiaChiKhachHangRepository;
import com.example.datn_f5_store.repository.IKhachHangRepository;
import com.example.datn_f5_store.request.DiaChiKhachHangResquest;
import com.example.datn_f5_store.request.KhachHangRequest;
import com.example.datn_f5_store.request.SanPhamRequest;
import com.example.datn_f5_store.response.DataResponse;
import com.example.datn_f5_store.response.ResultModel;
import com.example.datn_f5_store.service.IDiaChiKhachHangService;
import org.apache.coyote.BadRequestException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class DiaChiKhachHangImpl implements IDiaChiKhachHangService {

    @Autowired
    private IDiaChiKhachHangRepository diaChiKhachHangRepository;
    @Autowired
    private IKhachHangRepository khachHangRepository;

    @Override
    public Page<DiaChiKhachHangDto> getAllDiaChiKhachHang(int page, int size, String searchTerm) {
        Pageable pageable = PageRequest.of(page, size);
        Page<DiaChiKhachHangEntity> diaChiKhachHangEntities;

        if (searchTerm != null && !searchTerm.trim().isEmpty()) {
            diaChiKhachHangEntities = diaChiKhachHangRepository.findBySearchTerm(searchTerm, pageable);
        } else {
            diaChiKhachHangEntities = diaChiKhachHangRepository.findAll(pageable);
        }

        return diaChiKhachHangEntities.map(entity -> new DiaChiKhachHangDto(
                entity.getId(),
                entity.getSoNha(),
                entity.getDuong(),
                entity.getPhuongXa(),
                entity.getQuanHuyen(),
                entity.getTinhThanh(),
                entity.getQuocGia(),
                entity.getSdt(),
                entity.getLoaiDiaChi(),
                entity.getTrangThai()
        ));
    }

    @Override
    public DataResponse addDiaChiKhachHang(DiaChiKhachHangResquest diaChiKhachHangResquest) {
        if (!this.checkDiaChi(diaChiKhachHangResquest)) {
            return this.saveOfUpdate(new DiaChiKhachHangEntity(), diaChiKhachHangResquest);
        }else {
//            return new DataResponse(false,new ResultModel<>(null,"dữ liệu không hợp lệ"));
            throw new RuntimeException("Dữ liệu không hợp lệ");
        }
    }

    @Override
    public DataResponse updateDiaChiKhachHang(Integer id, DiaChiKhachHangResquest diaChiKhachHangResquest) {
        if (!checkDiaChi(diaChiKhachHangResquest)) {
            DiaChiKhachHangEntity diaChi = diaChiKhachHangRepository.findById(id).orElse(null);
            if (diaChi == null) {
                throw new NullPointerException("Địa chỉ không tồn tại");
            }
            diaChiKhachHangResquest.setId(id);
            diaChiKhachHangResquest.setSdt(diaChi.getSdt());
            return this.saveOfUpdate(diaChi, diaChiKhachHangResquest);
        } else {
            return new DataResponse(false, new ResultModel<>(null, "Dữ liệu đầu vào lỗi"));
        }
    }
    @Override
    public Page<DiaChiKhachHangDto> getByKhachHang(Integer page,Integer size,Integer id) {
        Pageable pageable = PageRequest.of(page,size);
        Page<DiaChiKhachHangEntity> listKhachHang = diaChiKhachHangRepository.findByKhackHang_Id(id,pageable);
        return listKhachHang.map(entity -> new DiaChiKhachHangDto(
                        entity.getId(),
                        entity.getSoNha(),
                        entity.getSdt(),
                        entity.getDuong(),
                        entity.getPhuongXa(),
                        entity.getQuanHuyen(),
                        entity.getTinhThanh(),
                        entity.getQuocGia(),
                        entity.getLoaiDiaChi(),
                        entity.getTrangThai()
                ));
    }

    @Override
    public DiaChiKhachHangEntity chiTietDiaChi(Integer id) {
        return diaChiKhachHangRepository.findById(id).orElse(null);
    }

    private Boolean checkDiaChi(DiaChiKhachHangResquest resquest) {
        boolean check = false;
        if (resquest.getSoNha() == null || resquest.getSoNha().isEmpty()) {
            check = true;
        }
        if (resquest.getDuong() == null || resquest.getDuong().isEmpty()) {
            check = true;
        }
        if (resquest.getPhuongXa() == null || resquest.getPhuongXa().isEmpty()) {
            check = true;
        }
        if (resquest.getQuanHuyen() == null || resquest.getQuanHuyen().isEmpty()) {
            check = true;
        }
        if (resquest.getTinhThanh() == null || resquest.getTinhThanh().isEmpty()) {
            check = true;
        }
        if (resquest.getQuocGia() == null || resquest.getQuocGia().isEmpty()) {
            check = true;
        }
        return check;
    }
    private DataResponse saveOfUpdate(DiaChiKhachHangEntity entity, DiaChiKhachHangResquest request) {
        try {
            // Lưu sản phẩm vào database
            this.convertDiaChi(entity, request);
            diaChiKhachHangRepository.save(entity);
            return new DataResponse(true, new ResultModel<>(null, "Thành công!"));
        } catch (Exception e) {
            e.printStackTrace();
            return new DataResponse(false, new ResultModel<>(null, "Lỗi trong quá trình lưu/cập nhật"));
        }
    }
    public void convertDiaChi(DiaChiKhachHangEntity entity, DiaChiKhachHangResquest request) {
        entity.setId(request.getId());
        KhachHangEntity khachHang = khachHangRepository.findById(request.getIdKhachHang()).orElse(null);
        entity.setKhackHang(khachHang);
        entity.setSoNha(request.getSoNha());
        entity.setSdt(request.getSdt());
        entity.setDuong(request.getDuong());
        entity.setPhuongXa(request.getPhuongXa());
        entity.setQuanHuyen(request.getQuanHuyen());
        entity.setTinhThanh(request.getTinhThanh());
        entity.setQuocGia(request.getQuocGia());
        entity.setLoaiDiaChi(request.getLoaiDiaChi());
        entity.setTrangThai(request.getTrangThai());
    }
}
