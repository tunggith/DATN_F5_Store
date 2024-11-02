package com.example.datn_f5_store.controller;
import com.example.datn_f5_store.entity.GioHangEntity;
import com.example.datn_f5_store.repository.IGioHangRepository;
import com.example.datn_f5_store.request.ChiTietSanphamRequest;
import com.example.datn_f5_store.request.GioHangRequest;
import com.example.datn_f5_store.response.DataResponse;
import com.example.datn_f5_store.response.ResultModel;
import com.example.datn_f5_store.service.impl.GioHangServiceImpl;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/v1/gio-hang")
public class GioHangController {

    @Autowired
    private GioHangServiceImpl gioHangService;
    @Autowired
    private IGioHangRepository repoGh;


    @GetMapping
    public List<GioHangEntity> getall(){
        return repoGh.findAll();
    }

    @GetMapping("/getall-phan_trang")
    public ResponseEntity<?> getallPhanTrang(
            @RequestParam(value = "currentPage" , defaultValue = "0") Integer curentPage

    ){
        DataResponse dataResponse = new DataResponse();
        dataResponse.setStatus(true);
        var responseList = gioHangService.getAllPhanTrang(curentPage);
        dataResponse.setResult(new ResultModel<>(null, responseList));
        return ResponseEntity.ok(dataResponse);
    }

    @PostMapping("/Created")
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


}
