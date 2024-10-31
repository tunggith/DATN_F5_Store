package com.example.datn_f5_store.controller;

import com.example.datn_f5_store.request.AnhChiTietSanPhamRequest;
import com.example.datn_f5_store.request.DiaChiKhachHangResquest;
import com.example.datn_f5_store.response.DataResponse;
import com.example.datn_f5_store.response.PagingModel;
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
@RestController
@RequestMapping("/api/v1/anh-chi-tiet-san-pham")
public class AnhChiTietSanPhamController {
    @Autowired
    private IAnhChiTietSanPhamService iAnhChiTietSanPhamService;
    @GetMapping("/get-by-san-pham/{id}")
    private ResponseEntity<Object> getBySanPham(
            @Parameter(name = "id")@PathVariable Integer id,
            @Parameter(name = "page")@RequestParam(defaultValue = "0")Integer page,
            @Parameter(name = "size")@RequestParam(defaultValue = "3")Integer size
    ){
        DataResponse dataResponse = new DataResponse();
        dataResponse.setStatus(true);
        var dataAnh = iAnhChiTietSanPhamService.getBySanPham(page,size,id);
        dataResponse.setResult(new ResultModel<>(new PagingModel(size,page, dataAnh.getTotalElements(), dataAnh.getTotalPages()),dataAnh));
        return ResponseEntity.ok(dataResponse);
    }
    @PostMapping("/create")
    private ResponseEntity<Object> create(@RequestBody AnhChiTietSanPhamRequest request){
        return new ResponseEntity<>(iAnhChiTietSanPhamService.create(request),HttpStatus.CREATED);
    }
    @PutMapping("/update/{id}")
    private ResponseEntity<Object> update(
            @Parameter(name = "id")@PathVariable Integer id,
            @RequestBody AnhChiTietSanPhamRequest request
    ){
        return new ResponseEntity<>(iAnhChiTietSanPhamService.update(id, request),HttpStatus.OK);
    }
    @GetMapping("/detail/{id}")
    private ResponseEntity<Object> detail(@Parameter(name = "id")@PathVariable Integer id){
        DataResponse dataResponse = new DataResponse();
        dataResponse.setStatus(true);
        var data = iAnhChiTietSanPhamService.detail(id);
        dataResponse.setResult(new ResultModel<>(null,data));
        return ResponseEntity.ok(dataResponse);
    }

}
