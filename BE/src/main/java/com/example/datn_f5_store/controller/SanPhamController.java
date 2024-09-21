package com.example.datn_f5_store.controller;

import com.example.datn_f5_store.Response.DataResponse;
import com.example.datn_f5_store.Response.PagingModel;
import com.example.datn_f5_store.Response.ResultModel;
import com.example.datn_f5_store.request.SanPhamRequest;
import com.example.datn_f5_store.service.SanPhamService;
import io.swagger.v3.oas.annotations.Parameter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
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
        DataResponse dataResponse = new DataResponse();
        dataResponse.setStatus(true);
        var responseList = sanPhamService.getAll(page, size);
        dataResponse.setResult(new ResultModel<>(null, responseList));
        return ResponseEntity.ok(dataResponse);
    }
    @GetMapping("/find-by-ten-or-ma")
    private ResponseEntity<Object> findByTenorMa(
            @Parameter(name = "page") @RequestParam(defaultValue = "0") Integer page,
            @Parameter(name = "size") @RequestParam(defaultValue = "3") Integer size,
            @Parameter(name = "ten") @RequestParam(required = false) String ten,
            @Parameter(name = "ma") @RequestParam(required = false) String ma
    ) {
        DataResponse dataResponse = new DataResponse();
        dataResponse.setStatus(true);
        var responseList = sanPhamService.findByTenOrMa(page, size,ten,ma);
        dataResponse.setResult(
                new ResultModel<>(
                        new PagingModel(page,size,responseList.getTotalElements(),responseList.getTotalPages()), responseList)
        );
        return ResponseEntity.ok(dataResponse);
    }
    @PostMapping("/create")
    private ResponseEntity<Object> create(@RequestBody SanPhamRequest request){
        return new ResponseEntity<>(sanPhamService.create(request),HttpStatus.CREATED);
    }
    @PutMapping("/update/{id}")
    private ResponseEntity<Object> update(@RequestBody SanPhamRequest request, @PathVariable Integer id){
        return new ResponseEntity<>(sanPhamService.update(request,id),HttpStatus.OK);
    }
}
