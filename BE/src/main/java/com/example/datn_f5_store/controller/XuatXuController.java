package com.example.datn_f5_store.controller;

import com.example.datn_f5_store.response.DataResponse;
import com.example.datn_f5_store.response.ResultModel;
import com.example.datn_f5_store.service.IXuatXuService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
@RestController
@RequestMapping("/api/v1/xuat-xu")
public class XuatXuController {
    @Autowired
    private IXuatXuService xuatXuService;
    @GetMapping("getAll")
    private ResponseEntity<Object> getAll(){
        DataResponse dataResponse = new DataResponse();
        dataResponse.setStatus(true);
        var xuatXuList = xuatXuService.getAll();
        dataResponse.setResult(new ResultModel<>(null,xuatXuList));
        return ResponseEntity.ok(dataResponse);
    }
}
