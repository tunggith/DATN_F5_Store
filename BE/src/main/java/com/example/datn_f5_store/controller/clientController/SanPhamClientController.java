package com.example.datn_f5_store.controller.clientController;

import com.example.datn_f5_store.entity.AnhChiTietSanPham;
import com.example.datn_f5_store.response.DataResponse;
import com.example.datn_f5_store.response.ResultModel;
import com.example.datn_f5_store.service.IGioiTinhService;
import com.example.datn_f5_store.service.IMauSacService;
import com.example.datn_f5_store.service.ISanPhamClientservice;
import com.example.datn_f5_store.service.ISizeService;
import com.example.datn_f5_store.service.IXuatXuService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/customer")
public class SanPhamClientController {

    @Autowired
    private ISizeService iSizeService;

    @Autowired
    private IMauSacService iMauSacService;

    @Autowired
    private IXuatXuService iXuatXuService;

    @Autowired
    private IGioiTinhService iGioiTinhService;

    @Autowired
    private ISanPhamClientservice iSanPhamClientservice;

    @GetMapping("/size-getAll")
    private ResponseEntity<Object> getAllSize(){
        DataResponse dataResponse = new DataResponse();
        dataResponse.setStatus(true);
        var sizeList = iSizeService.getAll();
        dataResponse.setResult(new ResultModel<>(null,sizeList));
        return ResponseEntity.ok(dataResponse);
    }

    @GetMapping("/xuat-xu-getAll")
    private ResponseEntity<Object> getAllXuatXu(){
        DataResponse dataResponse = new DataResponse();
        dataResponse.setStatus(true);
        var xuatXuList = iXuatXuService.getAll();
        dataResponse.setResult(new ResultModel<>(null,xuatXuList));
        return ResponseEntity.ok(dataResponse);
    }

    @GetMapping("/mau-sac-getAll")
    private ResponseEntity<Object> getAllmauSac(){
        DataResponse dataResponse = new DataResponse();
        dataResponse.setStatus(true);
        var xuatXuList = iMauSacService.getAll();
        dataResponse.setResult(new ResultModel<>(null,xuatXuList));
        return ResponseEntity.ok(dataResponse);
    }


    @GetMapping("/gioi-tinh-getAll")
    private ResponseEntity<Object> getAllgioitinh(){
        DataResponse dataResponse = new DataResponse();
        dataResponse.setStatus(true);
        var xuatXuList = iGioiTinhService.getAll();
        dataResponse.setResult(new ResultModel<>(null,xuatXuList));
        return ResponseEntity.ok(dataResponse);
    }


    @GetMapping("/getSanPhamPhanTrang")
    public ResponseEntity<Page<AnhChiTietSanPham>> getSanPham(
            @RequestParam(value = "page" ,defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size) {
        if (page < 0) {
            page = 0; // Đảm bảo page luôn bắt đầu từ 0
        }
        Page<AnhChiTietSanPham> result = iSanPhamClientservice.getSanPham(page, size);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }



}
