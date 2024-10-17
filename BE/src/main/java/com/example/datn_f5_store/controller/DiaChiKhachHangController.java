package com.example.datn_f5_store.controller;

import com.example.datn_f5_store.request.DiaChiKhachHangResquest;
import com.example.datn_f5_store.response.DataResponse;
import com.example.datn_f5_store.response.PagingModel;
import com.example.datn_f5_store.response.ResultModel;
import com.example.datn_f5_store.service.IDiaChiKhachHangService;
import io.swagger.v3.oas.annotations.Parameter;
import jakarta.validation.Valid;
import lombok.Getter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:4200")
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
            @RequestBody @Valid DiaChiKhachHangResquest diaChiKhachHangResquest) {
        return new ResponseEntity<>(diaChiKhachHangService.addDiaChiKhachHang(diaChiKhachHangResquest), HttpStatus.CREATED);
    }

    @PutMapping("/updateDiaChiKhachHang/{id}")
    public ResponseEntity<?> updateDiaChiKhachHang(
            @PathVariable Integer id,
            @RequestBody @Valid DiaChiKhachHangResquest resquest) {
        return new ResponseEntity<>(diaChiKhachHangService.updateDiaChiKhachHang(id, resquest), HttpStatus.OK);
    }

    @GetMapping("/get-by-khach-hang/{id}")
    private ResponseEntity<Object> getByKhachHang(
            @Parameter(name = "id") @PathVariable Integer id,
            @Parameter(name = "page") @RequestParam(defaultValue = "0") Integer page,
            @Parameter(name = "size") @RequestParam(defaultValue = "3") Integer size
    ) {
        DataResponse dataResponse = new DataResponse();
        dataResponse.setStatus(true);
        var listDiaChi = diaChiKhachHangService.getByKhachHang(page, size, id);
        dataResponse.setResult(new ResultModel<>(new PagingModel(size, page, listDiaChi.getTotalElements(), listDiaChi.getTotalPages()), listDiaChi));
        return ResponseEntity.ok(dataResponse);
    }
    @GetMapping("/chi-tiet-dia-chi/{id}")
    private ResponseEntity<Object> getDeatail(
            @Parameter(name = "id")@PathVariable Integer id
    ){
        DataResponse dataResponse = new DataResponse();
        dataResponse.setStatus(true);
        var diaChiData = diaChiKhachHangService.chiTietDiaChi(id);
        dataResponse.setResult(new ResultModel<>(null,diaChiData));
        return ResponseEntity.ok(dataResponse);
    }

}
