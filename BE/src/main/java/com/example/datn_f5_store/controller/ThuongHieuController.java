package com.example.datn_f5_store.controller;

import com.example.datn_f5_store.Response.DataResponse;
import com.example.datn_f5_store.Response.ResultModel;
import com.example.datn_f5_store.service.IThuongHieuService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/thuong-hieu")
public class ThuongHieuController {
    @Autowired
    private IThuongHieuService thuongHieuService;
    @GetMapping("/getAll")
    private ResponseEntity<Object> getAll(){
        DataResponse dataResponse = new DataResponse();
        dataResponse.setStatus(true);
        var thuongHieuList = thuongHieuService.getAll();
        dataResponse.setResult(new ResultModel<>(null,thuongHieuList));
        return ResponseEntity.ok(dataResponse);
    }
}
