package com.example.datn_f5_store.controller;

import com.example.datn_f5_store.entity.KhachHangEntity;
import com.example.datn_f5_store.request.KhachHangRequest;
import com.example.datn_f5_store.response.DataResponse;
import com.example.datn_f5_store.response.PagingModel;
import com.example.datn_f5_store.response.ResultModel;
import com.example.datn_f5_store.service.KhachHangService;
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
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/v1/khach-hang")

public class KhachHangController {
    @Autowired
    private KhachHangService khachHangService;

    @GetMapping("/getAllKhachHang")
    public ResponseEntity<Object> getAllKhachHang() {
        DataResponse dataResponse = new DataResponse();
        dataResponse.setStatus(true);

        // Gọi service để lấy tất cả khách hàng
        var responseList = khachHangService.getAllKhachHangKhongPhanTrang(); // Cập nhật phương thức này trong service để không nhận page, size

        dataResponse.setResult(new ResultModel<>(null, responseList));
        return ResponseEntity.ok(dataResponse);
    }


    @GetMapping("/getAllKhachHang_PhanTrang_TimKiem")
    private ResponseEntity<Object> getAllKhachHang(
            @Parameter(name = "page") @RequestParam(defaultValue = "0") Integer page,
            @Parameter(name = "size") @RequestParam(defaultValue = "5") Integer size,
            @Parameter(name = "search") @RequestParam(required = false) String search // Thêm tham số tìm kiếm
    ) {
        DataResponse dataResponse = new DataResponse();
        dataResponse.setStatus(true);

        // Gọi dịch vụ để lấy danh sách khách hàng với phân trang và tìm kiếm
        var responseList = khachHangService.getAllKhachHang(page, size, search);
        dataResponse.setResult(new ResultModel<>(null, responseList));

        return ResponseEntity.ok(dataResponse);
    }

    @GetMapping("/find-by-ten-ma-email-sdt")
    private ResponseEntity<Object> findByTenOrMaOrEmailOrSdt(
            @Parameter(name = "page") @RequestParam(defaultValue = "0") Integer page,
            @Parameter(name = "size") @RequestParam(defaultValue = "5") Integer size,
            @Parameter(name = "ten") @RequestParam(required = false) String ten,
            @Parameter(name = "ma") @RequestParam(required = false) String ma,
            @Parameter(name = "email") @RequestParam(required = false) String email,
            @Parameter(name = "sdt") @RequestParam(required = false) String sdt
    ) {
        DataResponse dataResponse = new DataResponse();
        dataResponse.setStatus(true);
        var responseList = khachHangService.findByTenContainingOrMaContainingOrEmailContainingOrSdtContaining(page, size, ten, ma, email, sdt);
        dataResponse.setResult(
                new ResultModel<>(
                        new PagingModel(page, size, responseList.getTotalElements(), responseList.getTotalPages()), responseList));
        return ResponseEntity.ok(dataResponse);
    }

    @PostMapping("/addKhachHang")
    public ResponseEntity<?> addKhachHang(@RequestBody @Valid KhachHangRequest khachHangRequest,
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

        // Thực hiện xử lý logic thêm khách hàng
        Boolean check = khachHangService.addKhachHang(khachHangRequest);

        // Kiểm tra nếu thêm thành công
        if (check) {
            // Trả về một đối tượng JSON với thông điệp
            Map<String, String> response = new HashMap<>();
            response.put("message", "Thêm khách hàng thành công!");
            return ResponseEntity.ok(response);
        } else {
            // Nếu có lỗi khi thêm, trả về mã lỗi 500
            Map<String, String> response = new HashMap<>();
            response.put("message", "Có lỗi xảy ra khi thêm khách hàng.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }


    @PutMapping("/updateKhachHang/{id}")
    public ResponseEntity<?> updateKhachHang(@PathVariable Integer id,
                                             @RequestBody @Valid KhachHangRequest khachHangRequest,
                                             BindingResult bingBindingResult) {
        HashMap<String, Object> response = new HashMap<>();

        // Kiểm tra lỗi validation
        if (bingBindingResult.hasErrors()) {
            // Lưu lỗi vào HashMap
            bingBindingResult.getFieldErrors().forEach(error ->
                    response.put(error.getField(), error.getDefaultMessage()));

            // Trả về phản hồi lỗi 400 với chi tiết lỗi
            return ResponseEntity.badRequest().body(response);
        }

        // Gọi service để cập nhật khách hàng
        Boolean checkUpdate = khachHangService.updateKhachHang(id, khachHangRequest);

        if (checkUpdate) {
            // Trả về phản hồi thành công
            response.put("message", "Cập nhật khách hàng thành công!");
            return ResponseEntity.ok(response);
        } else {
            // Nếu không tìm thấy khách hàng theo id, trả về mã lỗi 404
            response.put("message", "Không tìm thấy khách hàng với ID đã cho.");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }


    @GetMapping("/searchKhachHang")
    public ResponseEntity<Object> searchKhachHang(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String email,
            @RequestParam(required = false) String sdt
    ) {
        DataResponse dataResponse = new DataResponse();
        dataResponse.setStatus(true);

        var responseList = khachHangService.searchKhachHang(name, email, sdt);
        dataResponse.setResult(new ResultModel<>(null, responseList));

        return ResponseEntity.ok(dataResponse);
    }


//    @GetMapping("/searchKhachHang")
//    public ResponseEntity<?> searchKhachHangByName(@RequestParam String name) {
//        HashMap<String, Object> response = new HashMap<>();
//
//        // Gọi service để tìm kiếm khách hàng theo tên
//        List<KhachHangEntity> khachHangList = khachHangService.searchKhachHangByName(name);
//
//        if (khachHangList.isEmpty()) {
//            response.put("message", "Không tìm thấy khách hàng nào với tên đã cho.");
//            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
//        } else {
//            response.put("message", "Tìm kiếm thành công!");
//            response.put("data", khachHangList);
//            return ResponseEntity.ok(response);
//        }
//    }


}

