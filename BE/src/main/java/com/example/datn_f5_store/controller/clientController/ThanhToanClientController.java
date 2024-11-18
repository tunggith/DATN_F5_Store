package com.example.datn_f5_store.controller.clientController;

import com.example.datn_f5_store.request.ThanhToanRequest;
import com.example.datn_f5_store.service.client.ThanhToanClientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/customer")
public class ThanhToanClientController {
    @Autowired
    private ThanhToanClientService thanhToanClientService;

    @PostMapping("/thanh-toan")
    public ResponseEntity<Object> thanhToan(@RequestBody ThanhToanRequest request) {
        return new ResponseEntity<>(thanhToanClientService.thanhToan(request), HttpStatus.OK);
    }
}
