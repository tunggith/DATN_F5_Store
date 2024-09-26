package com.example.datn_f5_store.controller;

import com.example.datn_f5_store.request.ThuongHieuRequest;
import com.example.datn_f5_store.response.DataResponse;
import com.example.datn_f5_store.response.ResultModel;
import com.example.datn_f5_store.service.IThuongHieuService;
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
import org.springframework.web.bind.annotation.RequestParam;
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
    @PostMapping("/create")
    private ResponseEntity<Object> create(@RequestBody ThuongHieuRequest request){
        return new ResponseEntity<>(thuongHieuService.create(request), HttpStatus.CREATED);
    }
    @PutMapping("/update/{id}")
    private ResponseEntity<Object> update(@RequestBody ThuongHieuRequest request,
                                          @Parameter(name = "id")@PathVariable Integer id){
        return new ResponseEntity<>(thuongHieuService.update(request,id),HttpStatus.OK);
    }
}
