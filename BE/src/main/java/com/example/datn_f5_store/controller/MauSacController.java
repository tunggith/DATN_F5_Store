package com.example.datn_f5_store.controller;

import com.example.datn_f5_store.request.MauSacRequest;
import com.example.datn_f5_store.request.ThuongHieuRequest;
import com.example.datn_f5_store.response.DataResponse;
import com.example.datn_f5_store.response.ResultModel;
import com.example.datn_f5_store.service.IMauSacService;
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
@RequestMapping("/api/v1/mau-sac")
public class MauSacController {
    @Autowired
    private IMauSacService mauSacService;
    @GetMapping("/getAll")
    private ResponseEntity<Object> getAll(){
        DataResponse dataResponse = new DataResponse();
        dataResponse.setStatus(true);
        var mauSacList = mauSacService.getAll();
        dataResponse.setResult(new ResultModel<>(null,mauSacList));
        return ResponseEntity.ok(dataResponse);
    }
    @PostMapping("/create")
    private ResponseEntity<Object> create(@RequestBody MauSacRequest request){
        return new ResponseEntity<>(mauSacService.create(request), HttpStatus.CREATED);
    }
    @PutMapping("/update/{id}")
    private ResponseEntity<Object> update(@RequestBody MauSacRequest request,
                                          @Parameter(name = "id")@PathVariable Integer id){
        return new ResponseEntity<>(mauSacService.update(request,id),HttpStatus.OK);
    }
}
