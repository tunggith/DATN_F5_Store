package com.example.datn_f5_store.controller;

import com.example.datn_f5_store.request.NhanVienRequest;
import com.example.datn_f5_store.response.DataResponse;
import com.example.datn_f5_store.response.PagingModel;
import com.example.datn_f5_store.response.ResultModel;
import com.example.datn_f5_store.service.NhanVienService;
import io.swagger.v3.oas.annotations.Parameter;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/nhan-vien")
public class NhanVienController {
    @Autowired
    private NhanVienService nhanVienService;

    @GetMapping("/getAll")
    public ResponseEntity<DataResponse> getAll(
            @Parameter(name = "page") @RequestParam(defaultValue = "0") Integer page,
            @Parameter(name = "size") @RequestParam(defaultValue = "3") Integer size
    ){
        DataResponse dataResponse = new DataResponse();
        dataResponse.setStatus(true);
        var responseList = nhanVienService.getAll(page, size);

        if (responseList.isEmpty()) {
            dataResponse.setResult(new ResultModel<>(null, responseList));
            return ResponseEntity.status(HttpStatus.NO_CONTENT).body(dataResponse); // Trả về 204 NO CONTENT nếu không có dữ liệu
        }

        dataResponse.setResult(new ResultModel<>(null, responseList));
        return ResponseEntity.ok(dataResponse);
    }

    @GetMapping("/find-by-ten-or-ma")
    public ResponseEntity<DataResponse> findByTenOrMa(
            @Parameter(name = "page") @RequestParam(defaultValue = "0") Integer page,
            @Parameter(name = "size") @RequestParam(defaultValue = "3") Integer size,
            @Parameter(name = "ten") @RequestParam(required = false) String ten,
            @Parameter(name = "ma") @RequestParam(required = false) String ma
    ){
        DataResponse dataResponse = new DataResponse();
        dataResponse.setStatus(true);
        var responseList = nhanVienService.findByTenOrMa(page, size, ten, ma);

        if (responseList.isEmpty()) {
            dataResponse.setResult(new ResultModel<>(null, responseList));
            return ResponseEntity.status(HttpStatus.NO_CONTENT).body(dataResponse);
        }

        dataResponse.setResult(new ResultModel<>(
                new PagingModel(page, size, responseList.getTotalElements(), responseList.getTotalPages()), responseList
        ));
        return ResponseEntity.ok(dataResponse);
    }

    @PostMapping("/create")
    public ResponseEntity<?> create(@Valid @RequestBody NhanVienRequest request) {
        return new ResponseEntity<>(nhanVienService.create(request),HttpStatus.CREATED);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<DataResponse> update(@RequestBody NhanVienRequest request, @PathVariable Integer id){
        DataResponse response = nhanVienService.update(request, id);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<DataResponse> delete(@PathVariable Integer id) {
        DataResponse response = nhanVienService.delete(id);
        return ResponseEntity.ok(response);
    }
    @GetMapping("/detail/{id}")
    public ResponseEntity<Object> detail(@Parameter(name = "id")@PathVariable Integer id){
        DataResponse dataResponse = new DataResponse();
        dataResponse.setStatus(true);
        var data = nhanVienService.detail(id);
        dataResponse.setResult(new ResultModel<>(null,data));
        return ResponseEntity.ok(dataResponse);
    }
}
