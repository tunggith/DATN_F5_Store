package com.example.datn_f5_store.controller;


import com.example.datn_f5_store.entity.ChiTietSanPhamEntity;
import com.example.datn_f5_store.entity.SanPhamEntity;

import com.example.datn_f5_store.response.ChiTietSanPhamReponse;
import com.example.datn_f5_store.response.DataResponse;
import com.example.datn_f5_store.response.PagingModel;
import com.example.datn_f5_store.response.ResultModel;



import com.example.datn_f5_store.repository.IChiTietSanPhamRepository;
import com.example.datn_f5_store.repository.IMauSacRepository;
import com.example.datn_f5_store.repository.ISanPhamRepository;
import com.example.datn_f5_store.repository.ISizeRepository;
import com.example.datn_f5_store.request.ChiTietSanphamRequest;
import com.example.datn_f5_store.service.impl.ChiTietSanPhamImpl;
import io.swagger.v3.oas.annotations.Parameter;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
@RestController
@RequestMapping("/api/v1/chi_tiet_san_pham")
public class ChiTietSanPhamController {
    @Autowired
    IChiTietSanPhamRepository repo_ctsp;
    @Autowired
    IMauSacRepository repo_mauSac;
    @Autowired
    ISizeRepository repo_size;
    @Autowired  
    ISanPhamRepository repo_sanPham;
    @Autowired
    ChiTietSanPhamImpl ctsp_Sevice;

    @Autowired
    IChiTietSanPhamRepository chiTietSanPhamRepository;

    @GetMapping("/find")
    public List<SanPhamEntity> getalls(){
        return repo_sanPham.findAll();
    }


    @GetMapping("/getAll")
    public List<ChiTietSanPhamReponse> getall(){
        return repo_ctsp.getAllCTSP();
    }

    @GetMapping("/getall-phan_trang")
    public ResponseEntity<?> getallPhanTrang(
            @RequestParam(value = "currentPage" , defaultValue = "0") Integer curentPage

    ){
        DataResponse  dataResponse = new DataResponse();
        dataResponse.setStatus(true);
        var responseList = ctsp_Sevice.getallPhanTrang(curentPage);
        dataResponse.setResult(new ResultModel<>(null,responseList));
        return ResponseEntity.ok(dataResponse);
    }


    @GetMapping("/getall-phan_trang/{id}")
    public ResponseEntity<?> getallPhanTrang(
            @PathVariable("id") Integer id,
            @RequestParam(value = "currentPage", defaultValue = "0") Integer currentPage
    ) {
        DataResponse dataResponse = new DataResponse();
        dataResponse.setStatus(true);

        // Gọi service để lấy kết quả phân trang
        var pageResult = ctsp_Sevice.getallPhanTrangbyidSP(id, currentPage);

        // Đưa dữ liệu phân trang và nội dung trực tiếp vào phản hồi
        Map<String, Object> result = new HashMap<>();
        result.put("content", pageResult.getContent());  // Danh sách sản phẩm
        result.put("totalPages", pageResult.getTotalPages());  // Tổng số trang
        result.put("currentPage", pageResult.getNumber());  // Trang hiện tại
        result.put("pageSize", pageResult.getSize());  // Kích thước trang
        result.put("totalElements", pageResult.getTotalElements());  // Tổng số phần tử
        return ResponseEntity.ok(result);  // Trả về map chứa dữ liệu và phân trang
    }


    @PostMapping("/created")
    public ResponseEntity<?> saveChiTietSanPham(@Valid @RequestBody ChiTietSanphamRequest ctspRequest, BindingResult result) {
        DataResponse dataResponse = new DataResponse();
        dataResponse.setStatus(true);

        // Gọi service để lưu chi tiết sản phẩm
        var responseList = ctsp_Sevice.saveChiTietSanPham(ctspRequest, result);
        dataResponse.setResult(new ResultModel<>(null, responseList));

        return ResponseEntity.ok(dataResponse);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateChiTietSanPham(@PathVariable("id") Integer id,
                                                  @Valid @RequestBody ChiTietSanphamRequest ctspRequest, BindingResult result) {
        DataResponse dataResponse = new DataResponse();
        dataResponse.setStatus(true);

        // Gọi service để cập nhật chi tiết sản phẩm
        var responseList = ctsp_Sevice.updateChiTietSanPham(id, ctspRequest, result);
        dataResponse.setResult(new ResultModel<>(null, responseList));

        return ResponseEntity.ok(dataResponse);
    }

    @GetMapping("/search")
    public ResponseEntity<?> searchChiTietSanPham(
            @RequestParam(value = "keyword", required = false) String keyword,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size) {

        Page<ChiTietSanPhamReponse> result = ctsp_Sevice.searchByTenOrMa(keyword, page, size);
        return ResponseEntity.ok(result);
    }
    @GetMapping("/searchsp")
    public ResponseEntity<?> searchChiTietSanPhamManKm(
            @RequestParam(value = "keyword", required = false) String keyword,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size) {

        Page<ChiTietSanPhamEntity> result = ctsp_Sevice.searchByTenOrMaManKm(keyword, page, size);
        return ResponseEntity.ok(result);
    }

//    ttt
@GetMapping("/filterChiTietSanPham")
public ResponseEntity<?> filterChiTietSanPham(
        @RequestParam(value = "sanPhamId") Long sanPhamId,
        @RequestParam(value = "donGia" , required = false ) Double donGia,
        @RequestParam(value = "mauSacId", required = false) Long mauSacId,
        @RequestParam(value = "sizeId", required = false) Long sizeId,
        @RequestParam(value = "page", defaultValue = "0") int page,
        @RequestParam(value = "size", defaultValue = "5") int size) {

    // Gọi service để lọc theo ID sản phẩm và giá
    Page<ChiTietSanPhamReponse> result = ctsp_Sevice.filterBySanPhamAndPriceAndAttributes(sanPhamId, donGia, mauSacId, sizeId, page, size);
    return ResponseEntity.ok(result);
}


    @GetMapping("/getAllKm")
    public List<ChiTietSanPhamEntity> getallkm(){
        return chiTietSanPhamRepository.findAll();
    }
    @GetMapping("/get-by-trang-thai")
    public ResponseEntity<Object> getByTrangThai(
            @Parameter(name = "size")@RequestParam(defaultValue = "0")Integer size,
            @Parameter(name = "page")@RequestParam(defaultValue = "5")Integer page,
            @Parameter(name = "keyword")@RequestParam(required = false) String keyword,
            @Parameter(name = "mauSac")@RequestParam(required = false) String mauSac,
            @Parameter(name = "sizeSpct")@RequestParam(required = false) String sizeSpct,
            @Parameter(name = "thuongHieu")@RequestParam(required = false) String thuongHieu,
            @Parameter(name = "xuatXu")@RequestParam(required = false) String xuatXu,
            @Parameter(name = "gioiTinh")@RequestParam(required = false) String gioiTinh
    ){
        DataResponse dataResponse = new DataResponse();
        dataResponse.setStatus(true);
        var listSanPham = ctsp_Sevice.getByTrangThaiSanPhamAndTrangThai(size,page,keyword, mauSac, sizeSpct, thuongHieu, xuatXu, gioiTinh);
        dataResponse.setResult(new ResultModel<>(
                new PagingModel(page,size,listSanPham.getTotalElements(),listSanPham.getTotalPages()),listSanPham
        ));
        return ResponseEntity.ok(dataResponse);
    }

        @GetMapping("/{id}")
        public ResponseEntity<?> getChiTietSanPhamById (@PathVariable("id") Integer id){
            DataResponse dataResponse = new DataResponse();

            // Gọi service để tìm chi tiết sản phẩm theo ID
            var chiTietSanPham = ctsp_Sevice.getChiTietSanPhamById(id);

            // Nếu tìm thấy chi tiết sản phẩm, trả về kết quả
            if (chiTietSanPham != null) {
                dataResponse.setStatus(true);
                dataResponse.setResult(new ResultModel<>(null, chiTietSanPham));
                return ResponseEntity.ok(dataResponse);
            } else {
                // Nếu không tìm thấy, trả về lỗi NOT_FOUND
                dataResponse.setStatus(false);
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(dataResponse);
            }
        }



    @GetMapping("/getall-phan_trangKm")
    public ResponseEntity<Page<ChiTietSanPhamEntity>> getAllPhanTrang(
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "pageSize", defaultValue = "5") int pageSize) {

        // Gọi service để lấy dữ liệu đã phân trang
        Page<ChiTietSanPhamEntity> pageResult = ctsp_Sevice.getAllPhanTrangKm(page, pageSize);

        // Trả về đối tượng Page, bao gồm dữ liệu và thông tin phân trang
        return ResponseEntity.ok(pageResult);
    }

    @GetMapping("/check-trung")
    public ResponseEntity<Boolean> checkTrungChiTietSanPham(
            @RequestParam("idSanPham") Long idSanPham,
            @RequestParam("idMauSac") Long idMauSac,
            @RequestParam("idSize") Long idSize) {
        boolean isDuplicate = ctsp_Sevice.isDuplicate(idSanPham, idMauSac, idSize);
        return ResponseEntity.ok(isDuplicate);
    }

    @GetMapping("/check-trung/update")
    public ResponseEntity<Boolean> checkTrungChiTietSanPham(
            @RequestParam Long sanPhamId,
            @RequestParam Long mauSacId,
            @RequestParam Long sizeId,
            @RequestParam Long chiTietSanPhamId) {
        boolean isDuplicate = ctsp_Sevice.isDuplicateChiTietSanPham(sanPhamId, mauSacId, sizeId, chiTietSanPhamId);
        return ResponseEntity.ok(isDuplicate);
    }



}
