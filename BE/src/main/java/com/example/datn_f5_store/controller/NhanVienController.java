package com.example.datn_f5_store.controller;

import com.example.datn_f5_store.Response.DataResponse;
import com.example.datn_f5_store.Response.PagingModel;
import com.example.datn_f5_store.Response.ResultModel;
import com.example.datn_f5_store.request.NhanVienRequest;
import com.example.datn_f5_store.service.NhanVienService;
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

@CrossOrigin(origins = "http://localhost:4200") // Cho phép các yêu cầu từ nguồn khác (ở đây là Angular frontend) truy cập vào API
@RestController
@RequestMapping("/api/nhan-vien")
public class NhanVienController {
    @Autowired
    private NhanVienService nhanVienService;

    @GetMapping("/getAll")
    private ResponseEntity<Object> getAll(
            @Parameter(name = "page") @RequestParam(defaultValue = "0") Integer page, //so trang hien tai
            @Parameter(name = "size") @RequestParam(defaultValue = "3") Integer size //Kich thuoc trang
    ){
        DataResponse dataResponse = new DataResponse(); //tao doi tuong phan hoi du lieu
        dataResponse.setStatus(true); //dat trang thai phan hoi la thanh cong
        var responseList = nhanVienService.getAll(page, size); //lay danh sach san pham voi phan trang
        dataResponse.setResult(new ResultModel<>(null, responseList)); //dat ket qua vao response
        return ResponseEntity.ok(dataResponse); //tra ve phan hoi HTTP 200 OK voi du lieu
    }

    @GetMapping("/find-by-ten-or-ma")
    private ResponseEntity<Object> findByTenOrMa(
            @Parameter(name = "page") @RequestParam(defaultValue = "0") Integer page,  //So trang hien tai
            @Parameter(name = "size") @RequestParam(defaultValue = "3") Integer size,  //kich thuoc trang
            @Parameter(name = "ten") @RequestParam(required = false) String ten,  //Ten san pham can tim kiem
            @Parameter(name = "ma") @RequestParam(required = false) String ma  //Ma san pham can tim kiem
    ){
        DataResponse dataResponse = new DataResponse();
        dataResponse.setStatus(true); //dat trang thai phan hoi la thanh cong
        var responseList = nhanVienService.findByTenOrMa(page, size, ten, ma);
        dataResponse.setResult(
                new ResultModel<>(
                        new PagingModel(page, size, responseList.getTotalElements(), responseList.getTotalPages()), responseList
                )
        );
        return ResponseEntity.ok(dataResponse);
    }

    @PostMapping("/create")
    private ResponseEntity<Object> create(@RequestBody NhanVienRequest request){
        return new ResponseEntity<>(nhanVienService.create(request), HttpStatus.CREATED);  //tra ve HTTp 201 CREATED sau khi tao san pham thanh cong
    }

    @PutMapping("/update/{id}")
    private ResponseEntity<Object> update(@RequestBody NhanVienRequest request, @PathVariable Integer id){
        return new ResponseEntity<>(nhanVienService.update(request, id), HttpStatus.OK);  //Tra ve HTTP 200 OK sau khu cap nhat thanh cong
    }
}
