package com.example.datn_f5_store.service.impl;

import com.example.datn_f5_store.dto.DiaChiKhachHangDto;
import com.example.datn_f5_store.entity.DiaChiKhachHangEntity;
import com.example.datn_f5_store.repository.IDiaChiKhachHangRepository;
import com.example.datn_f5_store.request.DiaChiKhachHangResquest;
import com.example.datn_f5_store.service.IDiaChiKhachHangService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class DiaChiKhachHangImpl implements IDiaChiKhachHangService {

    @Autowired
    private IDiaChiKhachHangRepository diaChiKhachHangRepository;

    @Override
    public Page<DiaChiKhachHangDto> getAllDiaChiKhachHang(int page, int size, String searchTerm) {
        Pageable pageable = PageRequest.of(page, size);
        Page<DiaChiKhachHangEntity> diaChiKhachHangEntities;

        if (searchTerm != null && !searchTerm.isEmpty()) {
            diaChiKhachHangEntities = diaChiKhachHangRepository.findBySearchTerm(searchTerm, pageable);
        } else {
            diaChiKhachHangEntities = diaChiKhachHangRepository.findAll(pageable);
        }

        return diaChiKhachHangEntities.map(entity -> new DiaChiKhachHangDto(
                entity.getId(),
                entity.getHoTen(),
                entity.getSDT(),
                entity.getSoNha(),
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
    public Boolean addDiaChiKhachHang(DiaChiKhachHangResquest diaChiKhachHangResquest) {
        if (diaChiKhachHangRepository.existsBySDT(diaChiKhachHangResquest.getSDT())) {
            System.out.println("Số điện thoại đã tồn tại!");
            return false;
        }
        try {
            DiaChiKhachHangEntity diaChiKhachHang = new DiaChiKhachHangEntity();
            diaChiKhachHang.setHoTen(diaChiKhachHangResquest.getHoTen());
            diaChiKhachHang.setSDT(diaChiKhachHangResquest.getSDT());
            diaChiKhachHang.setSoNha(diaChiKhachHangResquest.getSoNha());
            diaChiKhachHang.setDuong(diaChiKhachHangResquest.getDuong());
            diaChiKhachHang.setPhuongXa(diaChiKhachHangResquest.getPhuongXa());
            diaChiKhachHang.setQuanHuyen(diaChiKhachHangResquest.getQuanHuyen());
            diaChiKhachHang.setTinhThanh(diaChiKhachHangResquest.getTinhThanh());
            diaChiKhachHang.setQuocGia(diaChiKhachHangResquest.getQuocGia());
            diaChiKhachHang.setLoaiDiaChi(diaChiKhachHangResquest.getLoaiDiaChi());
            diaChiKhachHang.setTrangThai(diaChiKhachHangResquest.getTrangThai());

            diaChiKhachHangRepository.save(diaChiKhachHang);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    @Override
    public Boolean updateDiaChiKhachHang(Integer id, DiaChiKhachHangResquest diaChiKhachHangResquest) {
        Optional<DiaChiKhachHangEntity> optionalEntity = diaChiKhachHangRepository.findById(id);
        if (optionalEntity.isPresent()) {
            DiaChiKhachHangEntity diaChiKhachHang = optionalEntity.get();
            try {
                diaChiKhachHang.setHoTen(diaChiKhachHangResquest.getHoTen());
                diaChiKhachHang.setSDT(diaChiKhachHangResquest.getSDT());
                diaChiKhachHang.setSoNha(diaChiKhachHangResquest.getSoNha());
                diaChiKhachHang.setDuong(diaChiKhachHangResquest.getDuong());
                diaChiKhachHang.setPhuongXa(diaChiKhachHangResquest.getPhuongXa());
                diaChiKhachHang.setQuanHuyen(diaChiKhachHangResquest.getQuanHuyen());
                diaChiKhachHang.setTinhThanh(diaChiKhachHangResquest.getTinhThanh());
                diaChiKhachHang.setQuocGia(diaChiKhachHangResquest.getQuocGia());
                diaChiKhachHang.setLoaiDiaChi(diaChiKhachHangResquest.getLoaiDiaChi());
                diaChiKhachHang.setTrangThai(diaChiKhachHangResquest.getTrangThai());

                diaChiKhachHangRepository.save(diaChiKhachHang);
                return true;
            } catch (Exception e) {
                e.printStackTrace();
                return false;
            }
        } else {
            return false;
        }
    }
}
