package com.example.datn_f5_store.controller;

import com.example.datn_f5_store.request.ChiTietHoaDonRequest;
import com.example.datn_f5_store.request.HoaDonRequest;
import com.example.datn_f5_store.response.DataResponse;
import com.example.datn_f5_store.response.ResultModel;
import com.example.datn_f5_store.service.IHoaDonService;
import io.swagger.v3.oas.annotations.Parameter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/hoa-don")
public class HoaDonController {
    @Autowired
    private IHoaDonService hoaDonService;
    @GetMapping("/getAll")
    private ResponseEntity<Object> getAll(){
        DataResponse dataResponse = new DataResponse();
        dataResponse.setStatus(true);
        var hoaDonList = hoaDonService.getAll();
        dataResponse.setResult(new ResultModel<>(null,hoaDonList));
        return ResponseEntity.ok(dataResponse);
    }
    @GetMapping("/get-chi-tiet-hoa-don/{id}")
    private ResponseEntity<Object> getChiTietHoaDon(@Parameter(name = "id")@PathVariable Integer id){
        DataResponse dataResponse = new DataResponse();
        dataResponse.setStatus(true);
        var chitietHoaDonList = hoaDonService.getChiTietHoaDon(id);
        dataResponse.setResult(new ResultModel<>(null,chitietHoaDonList));
        return ResponseEntity.ok(dataResponse);
    }
    @PostMapping("/create")
    private ResponseEntity<Object> create(@RequestBody HoaDonRequest request){
        return new ResponseEntity<>(hoaDonService.craete(request), HttpStatus.CREATED);
    }
    @PutMapping("/thanh-toan/{id}")
    private ResponseEntity<Object> thanhToan(@RequestBody HoaDonRequest request,
                                             @Parameter(name = "id")@PathVariable Integer id){
        return new ResponseEntity<>(hoaDonService.update(request,id),HttpStatus.OK);
    }
    @PutMapping("/huy-hoa-don/{id}")
    private ResponseEntity<Object> huyHoaDon(@Parameter(name = "id")@PathVariable Integer id){
        return new ResponseEntity<>(hoaDonService.huyHoaDon(id),HttpStatus.OK);
    }
    @PostMapping("/chon-san-pham/{idSanPham}")
    private ResponseEntity<Object> chonSanPham(@RequestBody ChiTietHoaDonRequest request,
                                               @Parameter(name = "idSanPham") @PathVariable Integer idSanPham){
        return new ResponseEntity<>(hoaDonService.chonSanPham(request,idSanPham),HttpStatus.OK);
    }
    @DeleteMapping("/delete-hoa-don-chi-tiet/{id}")
    private ResponseEntity<Object> xoaHoaDonChiTiet(@Parameter(name = "id")@PathVariable Integer id){
        return new ResponseEntity<>(hoaDonService.deleteHoaDonChiTiet(id),HttpStatus.OK);
    }
}
