package com.example.datn_f5_store.service.impl;

import com.example.datn_f5_store.dto.KhuyenMaiDto;
import com.example.datn_f5_store.entity.AnhChiTietSanPham;
import com.example.datn_f5_store.entity.KhuyenMaiEntity;
import com.example.datn_f5_store.repository.IAnhChiTietSanPhamRepository;
import com.example.datn_f5_store.repository.IChiTietHoaDonRepository;
import com.example.datn_f5_store.repository.IChiTietSanPhamRepository;
import com.example.datn_f5_store.repository.IKhuyenMaiRepository;
import com.example.datn_f5_store.service.IHomeClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class HomeClientIPLM implements IHomeClient {
    @Autowired
    private IChiTietSanPhamRepository spctRepo;
    @Autowired
    private IAnhChiTietSanPhamRepository anhRepo;
    @Autowired
    private IChiTietHoaDonRepository repoCTHD;

    @Autowired
    private IKhuyenMaiRepository khuyenMaiRepository;
    @Override
    public ResponseEntity<List<AnhChiTietSanPham>> getSanPhamnew() {
        String trangThai = "Đang hoạt động"; // Giá trị trạng thái cần kiểm tra
        List<AnhChiTietSanPham> products = anhRepo.findTop5ActiveProducts(trangThai, PageRequest.of(0, 6));
        return ResponseEntity.ok(products);
    }

    @Override
    public ResponseEntity<Page<AnhChiTietSanPham>> getSanPhamHot(int page, int size) {
        return null;
    }

    public List<Map<String, Object>> getTop5SanPhamTheoThang(int year) {
        List<Object[]> results = repoCTHD.findTop5SanPhamTheoThang(year);
        List<Map<String, Object>> response = new ArrayList<>();

        for (Object[] result : results) {
            Map<String, Object> item = new HashMap<>();
            item.put("idSP", result[0]);   // ID sản phẩm
            item.put("tenSP", result[1]);  // Tên sản phẩm
            item.put("soluotduocban", result[2]);  // Tổng số lượng bán

            response.add(item);
        }
        return response;
    }

    @Override
    public List<Map<String, Object>> getTop10MostSoldProducts() {
        // Lấy dữ liệu từ repository
        List<Object[]> results = anhRepo.findTop10MostSoldProducts();
        List<AnhChiTietSanPham> anhCTSP = new ArrayList<>();

        results.forEach(record -> {
            System.out.println("ID_CHI_TIET_SAN_PHAM: " + record[0]);
            // Chuyển đổi record[0] sang Integer và tìm ảnh bằng ID chi tiết sản phẩm
            anhCTSP.addAll(anhRepo.findByIdIn(List.of(Long.parseLong(record[0].toString()))));
        });

        System.out.printf("list anh chi tiết sản phẩm "+anhCTSP+toString());

        // Chuyển đổi dữ liệu từ Object[] sang Map để dễ dàng trả về JSON
        return results.stream().map(record -> {
            Map<String, Object> map = new HashMap<>();
            map.put("ID_CHI_TIET_SAN_PHAM", record[0]);
            map.put("URL_ANH", record[1]);
            map.put("ID", record[2]);
            return map;
        }).toList();
    }

    @Override
    public ResponseEntity<Page<AnhChiTietSanPham>> findByChiTietSanPhamId(String id, Pageable pageable) {
        Page<AnhChiTietSanPham> result = anhRepo.finfbyidSpct(id, pageable);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @Override
    public Page<KhuyenMaiDto> findByTrangThai() {
        Pageable pageable = PageRequest.of(0, 5);
        Page<KhuyenMaiEntity> khuyenMaiEntities;
            khuyenMaiEntities = khuyenMaiRepository.findByTrangThai("Đang diễn ra", pageable);
        return khuyenMaiEntities.map(entity -> new KhuyenMaiDto(
                entity.getId(),
                entity.getMa(),
                entity.getTen(),
                entity.getKieuKhuyenMai(),
                entity.getMoTa(),
                entity.getSoLuong(),
                entity.getGiaTriKhuyenMai(),
                entity.getThoiGianBatDau(),
                entity.getThoiGianKetThuc(),
                entity.getThoiGianTao(),
                entity.getThoiGianSua(),
                entity.getNguoiSua(),
                entity.getNguoiTao(),
                entity.getTrangThai()
        ));
    }


}
