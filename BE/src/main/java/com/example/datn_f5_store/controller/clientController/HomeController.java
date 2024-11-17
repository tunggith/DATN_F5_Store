package com.example.datn_f5_store.controller.clientController;

import com.example.datn_f5_store.dto.VoucherDto;
import com.example.datn_f5_store.entity.AnhChiTietSanPham;
import com.example.datn_f5_store.entity.ChiTietSanPhamEntity;
import com.example.datn_f5_store.entity.MauSacEntity;
import com.example.datn_f5_store.entity.SanPhamEntity;
import com.example.datn_f5_store.entity.SizeEntity;
import com.example.datn_f5_store.repository.ISanPhamRepository;
import com.example.datn_f5_store.response.DataResponse;
import com.example.datn_f5_store.response.PagingModel;
import com.example.datn_f5_store.response.ResultModel;
import com.example.datn_f5_store.service.IHomeClientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/customer")
public class HomeController {

    @Autowired
    private IHomeClientService sevice;
    @Autowired
    private ISanPhamRepository repossp;

    @GetMapping("/new-san-pham")
    public ResponseEntity<?> getSanPhamnew(){
        return sevice.getSanPhamnew();
    }


    @GetMapping("/hot-san-pham")
    public ResponseEntity<?> getSanPhamHot(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "4") int size) {
        return sevice.getSanPhamHot(page, size);
    }

    @GetMapping("/top5-thang")
    public ResponseEntity<List<Map<String, Object>>> getTop5SanPhamTheoThang() {
        List<Map<String, Object>> top5SanPham = sevice.getTop5SanPhamTheoThang(2024);
        return ResponseEntity.ok(top5SanPham);
    }
    @GetMapping("/top10-most-sold")
    public ResponseEntity<List<Map<String, Object>>> getTop10MostSoldProducts() {
        // Gọi service để lấy dữ liệu
        List<Map<String, Object>> response = sevice.getTop10MostSoldProducts();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/find-by-id")
    public ResponseEntity<Page<AnhChiTietSanPham>> findByChiTietSanPhamId(
            @RequestParam("id") String id,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Pageable pageable = PageRequest.of(page, size);
        return sevice.findByChiTietSanPhamId(id, pageable);
    }

    @GetMapping("/find-voucher")
    public ResponseEntity<Object> findByTrangThai(

    ) {
        DataResponse dataResponse = new DataResponse(); // Tạo đối tượng phản hồi dữ liệu
        dataResponse.setStatus(true); // Đặt trạng thái phản hồi là thành công
        Page<VoucherDto> responseList = sevice.findByTrangThai();
        dataResponse.setResult(
                new ResultModel<>(
                        new PagingModel(0, 5, responseList.getTotalElements(), responseList.getTotalPages()),
                        responseList.getContent() // Lấy danh sách các đối tượng KhuyenMaiDto từ trang hiện tại
                )
        );
        return ResponseEntity.ok(dataResponse); // Trả về phản hồi HTTP 200 OK với dữ liệu
    }


    @GetMapping("/san-pham/{id}")
    public ResponseEntity<List<SanPhamEntity>> findBySanPhamId(
            @PathVariable("id") Integer id) {
        try {
            // Gọi service để lấy danh sách sản phẩm
            List<SanPhamEntity> result = sevice.findBySanPhamId(id);

            // Kiểm tra nếu không có dữ liệu
            if (result == null || result.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT); // 204 No Content
            }

            // Trả về danh sách sản phẩm với HTTP 200 OK
            return new ResponseEntity<>(result, HttpStatus.OK);

        } catch (Exception e) {
            // Xử lý lỗi và trả về HTTP 500 Internal Server Error
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    @GetMapping("/khoang-gia/{id}")
    public String getKhoangGia(@PathVariable("id") Integer idSanPham) {
        return sevice.getKhoangGia(idSanPham);
    }

    @GetMapping("/sizes/{idSanPham}")
    public List<SizeEntity> getDistinctSizes(@PathVariable("idSanPham") Integer idSanPham) {
        return sevice.getDistinctSizes(idSanPham);
    }

    // API để trả về danh sách đối tượng MauSacEntity
    @GetMapping("/mauSac/{idSanPham}")
    public List<MauSacEntity> getDistinctColors(@PathVariable("idSanPham") Integer idSanPham) {
        return sevice.getDistinctColors(idSanPham);
    }

    @GetMapping("/get-anh-by-id-ctsp")
    public List<AnhChiTietSanPham> getAnhChiTiet(
            @RequestParam("idMauSac") Integer idMauSac,
            @RequestParam("idSize") Integer idSize,
            @RequestParam("idSanPham") Integer idSanPham) {
        return sevice.getAnhChiTietByMauSacAndSizeAndSanPham(idMauSac, idSize, idSanPham);
    }


    @GetMapping("/get-ctsp")
    public List<ChiTietSanPhamEntity> getChiTietSP(
            @RequestParam("idMauSac") Integer idMauSac,
            @RequestParam("idSize") Integer idSize,
            @RequestParam("idSanPham") Integer idSanPham) {
        return sevice.getChiTietByMauSacAndSizeAndSanPham( idMauSac, idSize, idSanPham);
    }

}










