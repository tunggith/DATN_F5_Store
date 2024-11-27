package com.example.datn_f5_store.service.impl;

import com.example.datn_f5_store.dto.VoucherDto;
import com.example.datn_f5_store.entity.AnhChiTietSanPham;
import com.example.datn_f5_store.entity.ChiTietSanPhamEntity;
import com.example.datn_f5_store.entity.MauSacEntity;
import com.example.datn_f5_store.entity.SanPhamEntity;
import com.example.datn_f5_store.entity.SizeEntity;
import com.example.datn_f5_store.entity.VoucherEntity;
import com.example.datn_f5_store.repository.IAnhChiTietSanPhamRepository;
import com.example.datn_f5_store.repository.IChiTietHoaDonRepository;
import com.example.datn_f5_store.repository.IChiTietSanPhamRepository;
import com.example.datn_f5_store.repository.IKhuyenMaiRepository;
import com.example.datn_f5_store.repository.ISanPhamRepository;
import com.example.datn_f5_store.repository.IVoucherRepository;
import com.example.datn_f5_store.service.IHomeClientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class HomeClientIPLM implements IHomeClientService {
    @Autowired
    private IChiTietSanPhamRepository spctRepo;
    @Autowired
    private ISanPhamRepository spRepo;

    @Autowired
    private IAnhChiTietSanPhamRepository anhRepo;
    @Autowired
    private IChiTietHoaDonRepository repoCTHD;

    @Autowired
    private IKhuyenMaiRepository khuyenMaiRepository;
    @Autowired
    private IVoucherRepository iVoucherRepository;
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
    public Page<VoucherDto> findByTrangThai() {
        Pageable pageable = PageRequest.of(0, 5);
        Page<VoucherEntity> voucherEntities = iVoucherRepository.findByTrangThai2("Đang diễn ra", pageable);

        return voucherEntities.map(entity -> new VoucherDto(
                entity.getId(),
                entity.getMa(),
                entity.getTen(),
                entity.getGiaTriVoucher(),
                entity.getKieuGiamGia(),
                entity.getGiaTriGiamToiDa(),
                entity.getGiaTriHoaDonToiThieu(), // Fixed this argument
                entity.getThoiGianBatDau(), // Fixed this argument
                entity.getThoiGianKetThuc(),
                entity.getMoTa(), // Fixed this argument
                entity.getSoLuong(),
                entity.getNguoiTao(), // Fixed this argument
                entity.getThoiGianTao(),
                entity.getNguoiSua(),
                entity.getThoiGianSua(),
                entity.getTrangThai()
        ));
    }


    @Override
    public List<SanPhamEntity> findBySanPhamId(Integer id) {
        return spRepo.finfbyidSP(id);
    }

@Override
public String getKhoangGia(Integer idSanPham) {
    // Truy vấn MIN và MAX giá
    List<Map<String, Double>> result = spctRepo.findMinMaxGiaBySanPhamId(idSanPham);

    // Kiểm tra kết quả rỗng
    if (result.isEmpty()) {
        return "Không tìm thấy sản phẩm.";
    }

    // Lấy giá trị MIN và MAX từ kết quả
    Double minGia = result.get(0).get("minGia");
    Double maxGia = result.get(0).get("maxGia");

    // Kiểm tra nếu giá trị null
    if (minGia == null || maxGia == null) {
        return "Không tìm thấy sản phẩm.";
    }

    // Nếu minGia và maxGia bằng nhau, chỉ trả về giá trị maxGia
    if (minGia.equals(maxGia)) {
        return maxGia.intValue() + ""; // Trả về giá trị maxGia dưới dạng chuỗi
    }

    // Trả về chuỗi khoảng giá
    return minGia.intValue() + " - " + maxGia.intValue();
}



    // Lấy danh sách ID_SIZE duy nhất
    public List<SizeEntity> getDistinctSizes(Integer idSanPham) {
        return spctRepo.findDistinctSizesBySanPhamId(idSanPham);
    }

    // Trả về danh sách đối tượng MauSacEntity
    public List<MauSacEntity> getDistinctColors(Integer idSanPham) {
        return spctRepo.findDistinctColorsBySanPhamId(idSanPham);
    }


    public List<AnhChiTietSanPham> getAnhChiTietByMauSacAndSizeAndSanPham(Integer idMauSac, Integer idSize, Integer idSanPham) {
        return anhRepo.findAnhChiTietByMauSacAndSizeAndSanPham(idMauSac, idSize, idSanPham);
    }

    public List<ChiTietSanPhamEntity> getChiTietByMauSacAndSizeAndSanPham(Integer idMauSac, Integer idSize, Integer idSanPham) {
        return spctRepo.findChiTietByMauSacAndSizeAndSanPham(idMauSac, idSize, idSanPham);
    }


    public Integer getTotalQuantityByIdSanPham(Integer idSanPham) {
        return spctRepo.getSoLuongByidSP(idSanPham);
    }


    public List<AnhChiTietSanPham> findByMauSacAndSanPham(Integer idMauSac, Integer idSanPham) {
        List<AnhChiTietSanPham> listAnh = anhRepo.findByMauSac(idMauSac, idSanPham);

        // Dùng Set để lưu URL đã thấy và chỉ lấy ảnh đầu tiên cho mỗi URL
        Set<String> seenUrls = new HashSet<>();
        return listAnh.stream()
                .filter(anh -> seenUrls.add(anh.getUrlAnh()))
                .collect(Collectors.toList());
    }



}
















