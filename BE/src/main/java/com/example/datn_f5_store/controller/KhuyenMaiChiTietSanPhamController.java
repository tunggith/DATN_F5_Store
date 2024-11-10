package com.example.datn_f5_store.controller;

import com.example.datn_f5_store.request.KhuyenMaiChiTietSanPhamRequest;
import com.example.datn_f5_store.service.KhuyenMaiChiTietSanPhamService;
import io.swagger.v3.oas.annotations.Parameter;
import jakarta.websocket.server.PathParam;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
import  com.example.datn_f5_store.response.ResultModel;
import com.example.datn_f5_store.response.DataResponse;
@RestController
@RequestMapping("/api/v1/khuyen-mai-ctsp")
public class KhuyenMaiChiTietSanPhamController {
    @Autowired
    KhuyenMaiChiTietSanPhamService khuyenMaiChiTietSanPhamService;

    @GetMapping("/getAll")
    private ResponseEntity<Object> getAll(@Parameter(name = "page") @RequestParam(defaultValue = "0") Integer page,
                                          @Parameter(name = "size") @RequestParam(defaultValue = "5") Integer size) {
    DataResponse dataResponse = new DataResponse(); // Tạo đối tượng phản hồi dữ liệu
        dataResponse.setStatus(true); // Đặt trạng thái phản hồi là thành công
        var responseList = khuyenMaiChiTietSanPhamService.getAll(page, size); // Lấy danh sách Khuyen mai Chi tiết sản pham với phân trang
        // ham tự động cập nhập trạng thái Khuyến mãi chi tiết sản phẩm khi Khuyến mãi hết hạn
        khuyenMaiChiTietSanPhamService.upDateTrangThaiKhuyenMaiCtSp();
        dataResponse.setResult(new ResultModel<>(null, responseList)); // Đặt kết quả vào response
        return ResponseEntity.ok(dataResponse);
    }
    @GetMapping("/getByKhuyenMai/{id}")
    private ResponseEntity<Object> getByKhuyenMai(@Parameter(name = "page") @RequestParam(defaultValue = "0") Integer page,
                                                  @Parameter(name = "size") @RequestParam(defaultValue = "5") Integer size,
                                                  @PathVariable("id") Integer id) {
       DataResponse dataResponse = new DataResponse(); // Tạo đối tượng phản hồi dữ liệu
        dataResponse.setStatus(true); // Đặt trạng thái phản hồi là thành công
        var responseList = khuyenMaiChiTietSanPhamService.getByKhuyenMai(page, size,id); // Lấy danh sách Khuyen mai Chi tiết sản pham với phân trang
        // ham tự động cập nhập trạng thái Khuyến mãi chi tiết sản phẩm khi Khuyến mãi hết hạn
        khuyenMaiChiTietSanPhamService.upDateTrangThaiKhuyenMaiCtSp();
        dataResponse.setResult(new ResultModel<>(null, responseList)); // Đặt kết quả vào response
        return ResponseEntity.ok(dataResponse);
    }
    @PostMapping("/create")
    private ResponseEntity<?> create(@RequestBody KhuyenMaiChiTietSanPhamRequest khuyenMaiChiTietSanPhamRequest){
        return new ResponseEntity<>(khuyenMaiChiTietSanPhamService.createKhuyenMaictsp(khuyenMaiChiTietSanPhamRequest), HttpStatus.CREATED);
    }
    @DeleteMapping("/delete/{id}")
    private ResponseEntity<?> delete(@Parameter(name ="id") @PathVariable Integer id){
        return new ResponseEntity<>(khuyenMaiChiTietSanPhamService.XoaKhuyenMaictsp(id), HttpStatus.OK);
    }
}
