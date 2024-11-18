package com.example.datn_f5_store.controller.clientController;

import com.example.datn_f5_store.entity.ChiTietGioHangEntity;
import com.example.datn_f5_store.request.ChiTietGioHangRequest;
import com.example.datn_f5_store.request.GioHangRequest;
import com.example.datn_f5_store.request.KhachHangRequest;
import com.example.datn_f5_store.response.DataResponse;
import com.example.datn_f5_store.response.ResultModel;
import com.example.datn_f5_store.service.IGioHangClientService;
import com.example.datn_f5_store.service.ISanPhamClientservice;
import com.example.datn_f5_store.service.impl.ChiTietGioHangIplm;
import com.example.datn_f5_store.service.impl.ChiTietSanPhamImpl;
import com.example.datn_f5_store.service.impl.GioHangServiceImpl;
import io.swagger.v3.oas.annotations.Parameter;
import jakarta.validation.Valid;
import lombok.Getter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.DeleteMapping;
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
@RequestMapping("/api/v1/customer")
public class GioHangClientController {
    @Autowired
    private IGioHangClientService gioHangClientService;
    @GetMapping("/get-all/{id}")
    private ResponseEntity<Object> getAll(@Parameter(name = "id")@PathVariable Integer id){
        DataResponse dataResponse = new DataResponse();
        dataResponse.setStatus(true);
        var data = gioHangClientService.getAllChiTietGioHang(id);
        dataResponse.setResult(new ResultModel<>(null,data));
        return ResponseEntity.ok(dataResponse);
    }
    @PutMapping("/them-san-pham/{id}")
    private ResponseEntity<Object> themSanPham(
            @RequestBody ChiTietGioHangRequest request,
            @Parameter(name = "id")@PathVariable Integer id
    ){
        return new ResponseEntity<>(gioHangClientService.themSanPham(id,request),HttpStatus.OK);
    }
    @GetMapping("/xoa-san-pham/{id}")
    private ResponseEntity<Object> xoaSanPham(@Parameter(name = "id")@PathVariable Integer id){
        return new ResponseEntity<>(gioHangClientService.xoaSanPham(id),HttpStatus.OK);
    }
    @GetMapping("/remove/{id}")
    private ResponseEntity<Object> remove(@Parameter(name = "id")@PathVariable Integer id){
        return new ResponseEntity<>(gioHangClientService.xoaChiTietGioHang(id),HttpStatus.OK);
    }
}
