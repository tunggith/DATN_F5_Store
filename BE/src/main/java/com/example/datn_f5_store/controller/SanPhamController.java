package com.example.datn_f5_store.controller;

import com.example.datn_f5_store.Response.DataResponse;
import com.example.datn_f5_store.Response.ResultModel;
import com.example.datn_f5_store.service.SanPhamService;
import io.swagger.v3.oas.annotations.Parameter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/v1/san-pham")
public class SanPhamController {
    @Autowired
    private SanPhamService sanPhamService;
    @GetMapping("/getAll")
    private ResponseEntity<Object> getAll(
            @Parameter(name = "page") @RequestParam(defaultValue = "0") Integer page,
            @Parameter(name = "size") @RequestParam(defaultValue = "3") Integer size
    ) {
        DataResponse  dataResponse = new DataResponse();
        dataResponse.setStatus(true);
        var responseList = sanPhamService.getAll(page, size);
        dataResponse.setResult(new ResultModel<>(null, responseList));
        return ResponseEntity.ok(dataResponse);
    }
}
