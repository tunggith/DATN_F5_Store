package com.example.datn_f5_store.controller;

import com.example.datn_f5_store.entity.KhachHangEntity;
import com.example.datn_f5_store.request.KhachHangRequest;
import com.example.datn_f5_store.response.DataResponse;
import com.example.datn_f5_store.response.PagingModel;
import com.example.datn_f5_store.response.ResultModel;
import com.example.datn_f5_store.service.KhachHangService;
import io.swagger.v3.oas.annotations.Parameter;
import jakarta.validation.Valid;
import org.apache.coyote.BadRequestException;
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

@RestController
@RequestMapping("/api/v1/khach-hang")

public class KhachHangController {
    @Autowired
    private KhachHangService khachHangService;

    @GetMapping("/get-all-khach-hang")
    public ResponseEntity<Object> getAllKhachHang(@Parameter(name = "search")@RequestParam(required = false) String search) {
        DataResponse dataResponse = new DataResponse();
        dataResponse.setStatus(true);
        var responseList = khachHangService.getAllKhachHangKhongPhanTrang(search);
        dataResponse.setResult(new ResultModel<>(null, responseList));
        return ResponseEntity.ok(dataResponse);
    }
    @PostMapping("/create")
    public ResponseEntity<Object> createKhachHang(@RequestBody KhachHangRequest request) throws BadRequestException {
        return new ResponseEntity<>(khachHangService.create(request),HttpStatus.CREATED);
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
    public ResponseEntity<Object> addKhachHang(@RequestBody @Valid KhachHangRequest request) throws BadRequestException {
        return new ResponseEntity<>(khachHangService.create(request),HttpStatus.OK);
    }


    @PutMapping("/updateKhachHang/{id}")
    public ResponseEntity<Object> updateKhachHang(
            @Parameter(name = "id")@PathVariable Integer id,
            @RequestBody KhachHangRequest khachHangRequest) throws BadRequestException {
        System.out.println("Cập nhật khách hàng với ID: " + id);
        return new ResponseEntity<>(khachHangService.updateKhachHang(id,khachHangRequest),HttpStatus.OK);
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
    @PutMapping("/update-trang-thai/{id}")
    private ResponseEntity<Object> updateTrangThai(@Parameter(name = "id")@PathVariable Integer id){
        return new ResponseEntity<>(khachHangService.updateTrangThai(id),HttpStatus.OK);
    }
    @GetMapping("/get-trang-thai")
    private ResponseEntity<Object> getByTrangThai(@Parameter(name = "search")@RequestParam(required = false)String search){
        DataResponse dataResponse = new DataResponse();
        dataResponse.setStatus(true);
        var dataList = khachHangService.getByTrangThai();
        dataResponse.setResult(new ResultModel<>(null,dataList));
        return ResponseEntity.ok(dataResponse);
    }
    @GetMapping("/detail/{id}")
    private ResponseEntity<Object> getDetail(@Parameter(name = "id")Integer id){
        DataResponse dataResponse = new DataResponse();
        dataResponse.setStatus(true);
        var data = khachHangService.detail(id);
        dataResponse.setResult(new ResultModel<>(null,data));
        return ResponseEntity.ok(dataResponse);
    }
}

