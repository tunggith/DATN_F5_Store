package com.example.datn_f5_store.controller;

import com.example.datn_f5_store.entity.ChiTietGioHangEntity;
import com.example.datn_f5_store.repository.IChiTietGioHangRepository;
import com.example.datn_f5_store.repository.IChiTietSanPhamRepository;
import com.example.datn_f5_store.repository.IGioHangRepository;
import com.example.datn_f5_store.request.ChiTietGioHangRequest;
import com.example.datn_f5_store.response.DataResponse;
import com.example.datn_f5_store.response.ResultModel;
import com.example.datn_f5_store.service.impl.ChiTietGioHangIplm;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/chi_tiet_gio_hang")
public class ChiTietGioHangController {

    @Autowired
    private IChiTietGioHangRepository repo_ctgh;

    @Autowired
    private IGioHangRepository repogh;

    @Autowired
    private IChiTietSanPhamRepository repoctsp;
    @Autowired
    private ChiTietGioHangIplm seviceGh;

    @GetMapping("/getall-phan_trang")
    public ResponseEntity<?> getallPhanTrang(
            @RequestParam(value = "currentPage", defaultValue = "0") Integer curentPage

    ) {
        DataResponse dataResponse = new DataResponse();
        dataResponse.setStatus(true);
        var responseList = seviceGh.getAllPhanTrang(curentPage);
        dataResponse.setResult(new ResultModel<>(null, responseList));
        return ResponseEntity.ok(dataResponse);
    }


    @GetMapping("/searchByTenSanPham")
    public ResponseEntity<?> timkiem(
            @RequestParam(value = "currentPage", defaultValue = "0") Integer curentPage
            , @RequestParam("tenSanPham") String tenSanPham
    ) {
        DataResponse dataResponse = new DataResponse();
        dataResponse.setStatus(true);
        var responseList = seviceGh.searchByTenSanPham(curentPage, tenSanPham);
        dataResponse.setResult(new ResultModel<>(null, responseList));
        return ResponseEntity.ok(dataResponse);
    }


    @PutMapping("/create")
    public ResponseEntity<?> create(@RequestBody ChiTietGioHangRequest chiTietGioHangRequest) {
        try {
            // Gọi service để thêm hoặc cập nhật chi tiết giỏ hàng
            ChiTietGioHangEntity createdChiTietGioHang = seviceGh.addOrUpdateChiTietGioHang(chiTietGioHangRequest);
            return ResponseEntity.ok(createdChiTietGioHang);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Đã xảy ra lỗi: " + e.getMessage());
        }
    }

//    @PutMapping("/create")
//    public ResponseEntity<?> create(
//            @RequestParam Integer gioHangId,           // ID của giỏ hàng
//            @RequestParam Integer chiTietSanPhamId,   // ID của sản phẩm chi tiết
//            @RequestParam int soLuong                // Số lượng sản phẩm
//    ) {
//        try {
//            // Tạo đối tượng ChiTietGioHangRequest
//            ChiTietGioHangRequest chiTietGioHangRequest = new ChiTietGioHangRequest();
//            chiTietGioHangRequest.setGioHang(repogh.findById(gioHangId).get());
//            chiTietGioHangRequest.setChiTietSanPham(repoctsp.findById(chiTietSanPhamId).get());
//            chiTietGioHangRequest.setSoLuong(soLuong);
//
//            // Gọi service để thêm hoặc cập nhật chi tiết giỏ hàng
//            ChiTietGioHangEntity createdChiTietGioHang = seviceGh.addOrUpdateChiTietGioHang(chiTietGioHangRequest);
//            return ResponseEntity.ok(createdChiTietGioHang);
//        } catch (IllegalArgumentException e) {
//            return ResponseEntity.badRequest().body(e.getMessage());
//        } catch (Exception e) {
//            return ResponseEntity.status(500).body("Đã xảy ra lỗi: " + e.getMessage());
//        }
//    }


    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteChiTietGioHang(@PathVariable Integer id) {
        try {
            seviceGh.deleteChiTietGioHang(id);
            return ResponseEntity.ok("Chi tiết giỏ hàng đã được xóa thành công.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Đã xảy ra lỗi: " + e.getMessage());
        }
    }

}
