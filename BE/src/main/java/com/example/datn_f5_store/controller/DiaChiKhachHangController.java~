package com.example.datn_f5_store.controller;

import com.example.datn_f5_store.request.DiaChiKhachHangResquest;
import com.example.datn_f5_store.response.DataResponse;
import com.example.datn_f5_store.response.ResultModel;
import com.example.datn_f5_store.service.IDiaChiKhachHangService;
import io.swagger.v3.oas.annotations.Parameter;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/dia-chi-khach-hang")
public class DiaChiKhachHangController {

    @Autowired
    private IDiaChiKhachHangService diaChiKhachHangService;

    @GetMapping("/getAllDiaChiKhachHang_PhanTrang_TimKiem")
    public ResponseEntity<Object> getAllDiaChiKhachHang(
            @Parameter(name = "page") @RequestParam(defaultValue = "0") Integer page,
            @Parameter(name = "size") @RequestParam(defaultValue = "5") Integer size,
            @Parameter(name = "searchTerm") @RequestParam(required = false) String searchTerm
    ) {
        DataResponse dataResponse = new DataResponse();
        dataResponse.setStatus(true);

        var responseList = diaChiKhachHangService.getAllDiaChiKhachHang(page, size, searchTerm);
        dataResponse.setResult(new ResultModel<>(null, responseList));

        return ResponseEntity.ok(dataResponse);
    }

    @PostMapping("/addDiaChiKhachHang")
    public ResponseEntity<?> addDiaChiKhachHang(
            @RequestBody @Valid DiaChiKhachHangResquest diaChiKhachHangResquest,
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

        // Thực hiện xử lý logic thêm địa chỉ khách hàng
        Boolean check = diaChiKhachHangService.addDiaChiKhachHang(diaChiKhachHangResquest);

        // Kiểm tra nếu thêm thành công
        if (check) {
            return ResponseEntity.ok("Thêm địa chỉ khách hàng thành công!");
        } else {
            // Nếu có lỗi khi thêm, trả về mã lỗi 500
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Có lỗi xảy ra khi thêm địa chỉ khách hàng.");
        }
    }

    @PutMapping("/updateDiaChiKhachHang/{id}")
    public ResponseEntity<?> updateDiaChiKhachHang(
            @PathVariable Integer id,
            @RequestBody @Valid DiaChiKhachHangResquest diaChiKhachHangResquest,
            BindingResult bindingResult) {

        if (bindingResult.hasErrors()) {
            Map<String, String> errors = new HashMap<>();
            bindingResult.getFieldErrors().forEach(error -> errors.put(error.getField(), error.getDefaultMessage()));
            return ResponseEntity.badRequest().body(errors);
        }

        Boolean checkUpdate = diaChiKhachHangService.updateDiaChiKhachHang(id, diaChiKhachHangResquest);
        if (checkUpdate) {
            return ResponseEntity.ok("Cập nhật địa chỉ khách hàng thành công!");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Không tìm thấy địa chỉ khách hàng với ID đã cho.");
        }
    }
}
