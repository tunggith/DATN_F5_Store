package com.example.datn_f5_store.controller;

import com.example.datn_f5_store.response.DataResponse;
import com.example.datn_f5_store.response.ResultModel;
import com.example.datn_f5_store.service.ILichSuHoaDonService;
import io.swagger.v3.oas.annotations.Parameter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Date;
@RestController
@RequestMapping("/api/v1/lich-su-hoa-don")
public class LichSuHoaDonController {

    @Autowired
    private ILichSuHoaDonService lichSuHoaDonService;

    @GetMapping("/getAllLichSuHoaDon_PhanTrangOrTimKiem")
    private ResponseEntity<Object> getAllLichSuHoaDon(
            @Parameter(name = "page") @RequestParam(defaultValue = "0") Integer page,
            @Parameter(name = "size") @RequestParam(defaultValue = "5") Integer size,
            @Parameter(name = "startDate") @RequestParam(required = false)
            @DateTimeFormat(pattern = "yyyy-MM-dd") Date startDate,
            @Parameter(name = "endDate") @RequestParam(required = false)
            @DateTimeFormat(pattern = "yyyy-MM-dd") Date endDate
    ) {
        DataResponse dataResponse = new DataResponse();
        dataResponse.setStatus(true); // Trạng thái phản hồi

        // Gọi dịch vụ để lấy danh sách lịch sử hóa đơn với phân trang và khoảng thời gian
        var responseList = lichSuHoaDonService.getAllLichSuHoaDon(page, size, startDate, endDate);
        dataResponse.setResult(new ResultModel<>(null, responseList));

        return ResponseEntity.ok(dataResponse);
    }
    @GetMapping("/get-by-hoa-don/{id}")
    private ResponseEntity<Object> getByHoaDon(@Parameter(name = "id")@PathVariable Integer id){
        DataResponse dataResponse = new DataResponse();
        dataResponse.setStatus(true);
        dataResponse.setResult(new ResultModel<>(null,lichSuHoaDonService.getByHoaDon(id)));
        return ResponseEntity.ok(dataResponse);
    }
}
