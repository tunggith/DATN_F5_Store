package com.example.datn_f5_store.controller.clientController;

import com.example.datn_f5_store.dto.KhuyenMaiDto;
import com.example.datn_f5_store.entity.AnhChiTietSanPham;
import com.example.datn_f5_store.repository.ISanPhamRepository;
import com.example.datn_f5_store.response.DataResponse;
import com.example.datn_f5_store.response.PagingModel;
import com.example.datn_f5_store.response.ResultModel;
import com.example.datn_f5_store.service.IHomeClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/customer")
public class HomeController {

    @Autowired
    private IHomeClient sevice;
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
        Page<KhuyenMaiDto> responseList = sevice.findByTrangThai();
        dataResponse.setResult(
                new ResultModel<>(
                        new PagingModel(0, 5, responseList.getTotalElements(), responseList.getTotalPages()),
                        responseList.getContent() // Lấy danh sách các đối tượng KhuyenMaiDto từ trang hiện tại
                )
        );
        return ResponseEntity.ok(dataResponse); // Trả về phản hồi HTTP 200 OK với dữ liệu
    }

}










