package com.example.datn_f5_store.controller;

import com.example.datn_f5_store.request.AnhChiTietSanPhamRequest;
import com.example.datn_f5_store.request.DiaChiKhachHangResquest;
import com.example.datn_f5_store.response.DataResponse;
import com.example.datn_f5_store.response.ResultModel;
import com.example.datn_f5_store.service.IAnhChiTietSanPhamService;
import io.swagger.v3.oas.annotations.Parameter;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;
@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/v1/anh-chi-tiet-san-pham")
public class AnhChiTietSanPhamController {
    @Autowired
    private IAnhChiTietSanPhamService iAnhChiTietSanPhamService;
    @GetMapping("/getAllAnhChiTietSanPham_TimKiem_PhanTrang")
    public ResponseEntity<Object> getAllAnhChiTietSanPham_TimKiem_PhanTrang(
            @Parameter(name = "page") @RequestParam(defaultValue = "0") Integer page,
            @Parameter(name = "size") @RequestParam(defaultValue = "5") Integer size,
            @Parameter(name = "search") @RequestParam(required = false) String search
    ) {
        DataResponse dataResponse = new DataResponse();
        dataResponse.setStatus(true);

        var responseList = iAnhChiTietSanPhamService.getAllAnhChiTietSanPham(page, size, search);
        dataResponse.setResult(new ResultModel<>(null, responseList));

        return ResponseEntity.ok(dataResponse);
    }

    @PostMapping("/addAnhChiTietSanPham")
    public ResponseEntity<?> addAnhChiTietSanPham(
            @RequestBody @Valid AnhChiTietSanPhamRequest anhChiTietSanPhamRequest,
            BindingResult bindingResult) {

        // Kiểm tra xem có lỗi validation không
        if (bindingResult.hasErrors()) {
            // Nếu có lỗi validation, tạo một map để lưu các thông báo lỗi
            Map<String, String> errors = new HashMap<>();
            bindingResult.getFieldErrors().forEach(error ->
                    errors.put(error.getField(), error.getDefaultMessage()));

            // Trả về mã lỗi 400 với chi tiết lỗi
            return ResponseEntity.badRequest().body(errors);
        }

        // Thực hiện xử lý logic thêm ảnh chi tiết sản phẩm
        Boolean check = iAnhChiTietSanPhamService.addAnhChiTietSanPham(anhChiTietSanPhamRequest);

        // Kiểm tra nếu thêm thành công
        if (check) {
            return ResponseEntity.ok("Thêm ảnh chi tiết sản phẩm thành công!");
        } else {
            // Nếu có lỗi khi thêm, trả về mã lỗi 500
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Có lỗi xảy ra khi thêm ảnh chi tiết sản phẩm.");
        }
    }

    @PutMapping("/updateAnhChiTietSanPham/{id}")
    public ResponseEntity<?> updateAnhChiTietSanPham(
            @PathVariable Integer id,
            @RequestBody @Valid AnhChiTietSanPhamRequest anhChiTietSanPhamRequest,
            BindingResult bindingResult) {

        if (bindingResult.hasErrors()) {
            Map<String, String> errors = new HashMap<>();
            bindingResult.getFieldErrors().forEach(error -> errors.put(error.getField(), error.getDefaultMessage()));
            return ResponseEntity.badRequest().body(errors);
        }

        Boolean checkUpdate = iAnhChiTietSanPhamService.updateAnhChiTietSanPham(id, anhChiTietSanPhamRequest);
        if (checkUpdate) {
            return ResponseEntity.ok("Cập nhật ảnh chi tiết thành công!");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Không tìm thấy ảnh chi tiết với ID đã cho.");
        }
    }

}
