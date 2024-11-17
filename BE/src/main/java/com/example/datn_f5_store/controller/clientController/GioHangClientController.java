package com.example.datn_f5_store.controller.clientController;

import com.example.datn_f5_store.entity.ChiTietGioHangEntity;
import com.example.datn_f5_store.request.ChiTietGioHangRequest;
import com.example.datn_f5_store.request.GioHangRequest;
import com.example.datn_f5_store.response.DataResponse;
import com.example.datn_f5_store.response.ResultModel;
import com.example.datn_f5_store.service.IGioHangClientService;
import com.example.datn_f5_store.service.ISanPhamClientservice;
import com.example.datn_f5_store.service.impl.ChiTietGioHangIplm;
import com.example.datn_f5_store.service.impl.ChiTietSanPhamImpl;
import com.example.datn_f5_store.service.impl.GioHangServiceImpl;
import io.swagger.v3.oas.annotations.Parameter;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/customer")
public class GioHangClientController {

    @Autowired
    private IGioHangClientService iGioHangClientService;
    @Autowired
    private GioHangServiceImpl gioHangService;

    @Autowired
    private ChiTietGioHangIplm seviceGh;

    @Autowired
    ChiTietSanPhamImpl ctsp_Sevice;


    @PostMapping("/createGh")
    public ResponseEntity<Object> create(@RequestBody ChiTietGioHangRequest chiTietGioHangRequest) {
        try {
            // Gọi service để thêm hoặc cập nhật chi tiết giỏ hàng
            ChiTietGioHangEntity createdChiTietGioHang = iGioHangClientService.addOrUpdateChiTietGioHang(chiTietGioHangRequest);
            return ResponseEntity.ok(createdChiTietGioHang);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Đã xảy ra lỗi: " + e.getMessage());
        }
    }

    @PostMapping("/createGh2")
    public ResponseEntity<Object> create2(@RequestBody ChiTietGioHangRequest chiTietGioHangRequest) {
        try {
            // Gọi service để thêm hoặc cập nhật chi tiết giỏ hàng
            ChiTietGioHangEntity createdChiTietGioHang = iGioHangClientService.addOrUpdateChiTietGioHang2(chiTietGioHangRequest);
            return ResponseEntity.ok(createdChiTietGioHang);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Đã xảy ra lỗi: " + e.getMessage());
        }
    }

    @GetMapping("/getByGioHang/{id}")
    private ResponseEntity<Object> getBygIoHang(@Parameter(name = "page") @RequestParam(defaultValue = "0") Integer page,
                                                @Parameter(name = "size") @RequestParam(defaultValue = "5") Integer size,
                                                @PathVariable("id") Integer id) {
        DataResponse dataResponse = new DataResponse(); // Tạo đối tượng phản hồi dữ liệu
        dataResponse.setStatus(true); // Đặt trạng thái phản hồi là thành công
        var responseList = iGioHangClientService.findByGioHang(page, size,id);
        dataResponse.setResult(new ResultModel<>(null, responseList)); // Đặt kết quả vào response
        return ResponseEntity.ok(dataResponse);
    }

    @GetMapping("/getByKhachHang/{id}")
    private ResponseEntity<Object> getByKhachHang(@Parameter(name = "page") @RequestParam(defaultValue = "0") Integer page,
                                                @Parameter(name = "size") @RequestParam(defaultValue = "5") Integer size,
                                                @PathVariable("id") Integer id) {
        DataResponse dataResponse = new DataResponse(); // Tạo đối tượng phản hồi dữ liệu
        dataResponse.setStatus(true); // Đặt trạng thái phản hồi là thành công
        var responseList = iGioHangClientService.findByKhachHang(page, size,id);
        dataResponse.setResult(new ResultModel<>(null, responseList)); // Đặt kết quả vào response
        return ResponseEntity.ok(dataResponse);
    }

    @PostMapping("/CreatedGioHang")
    public ResponseEntity<?> createGioHang(@Valid @RequestBody GioHangRequest ghRequest, BindingResult result) {
        DataResponse dataResponse = new DataResponse();

        // Kiểm tra các lỗi xác thực
        if (result.hasErrors()) {
            dataResponse.setStatus(false);
            return ResponseEntity.badRequest().body(dataResponse);
        }

        // Gọi dịch vụ để tạo giỏ hàng
        var responseList = gioHangService.create(ghRequest, result);
        dataResponse.setStatus(true);
        dataResponse.setResult(new ResultModel<>(null, responseList));

        return ResponseEntity.ok(dataResponse);
    }

    @DeleteMapping("/deleteGhct/{id}")
    public ResponseEntity<?> deleteGioHangChiTiet(@PathVariable Integer id) {
        try {
            seviceGh.deleteChiTietGioHang(id);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Chi tiết giỏ hàng đã được xóa thành công.");
            return ResponseEntity.ok(response); // Trả về JSON
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Đã xảy ra lỗi: " + e.getMessage());
        }
    }


    @GetMapping("GetSanPhamById/{id}")
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



}
