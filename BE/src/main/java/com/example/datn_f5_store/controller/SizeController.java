package com.example.datn_f5_store.controller;

import com.example.datn_f5_store.request.SizeRequest;
import com.example.datn_f5_store.request.XuatXuRequest;
import com.example.datn_f5_store.response.DataResponse;
import com.example.datn_f5_store.response.ResultModel;
import com.example.datn_f5_store.service.ISizeService;
import io.swagger.v3.oas.annotations.Parameter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/size")
public class SizeController {
    @Autowired
    private ISizeService sizeService;
    @GetMapping("getAll")
    private ResponseEntity<Object> getAll(){
        DataResponse dataResponse = new DataResponse();
        dataResponse.setStatus(true);
        var sizeList = sizeService.getAll();
        dataResponse.setResult(new ResultModel<>(null,sizeList));
        return ResponseEntity.ok(dataResponse);
    }
    @PostMapping("/create")
    private ResponseEntity<Object> create(@RequestBody SizeRequest request){
        return new ResponseEntity<>(sizeService.create(request), HttpStatus.CREATED);
    }
    @PutMapping("/update/{id}")
    private ResponseEntity<Object> update(@RequestBody SizeRequest request,
                                          @Parameter(name = "id")@PathVariable Integer id){
        return new ResponseEntity<>(sizeService.update(request,id),HttpStatus.OK);
    }
}
