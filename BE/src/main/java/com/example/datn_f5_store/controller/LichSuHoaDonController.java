package com.example.datn_f5_store.controller;

import com.example.datn_f5_store.response.DataResponse;
import com.example.datn_f5_store.response.ResultModel;
import com.example.datn_f5_store.service.ILichSuHoaDonService;
import io.swagger.v3.oas.annotations.Parameter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Date;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/v1/lich-su-hoa-don")
public class LichSuHoaDonController {

    @Autowired
    private ILichSuHoaDonService lichSuHoaDonService;

    @GetMapping("/getAllLichSuHoaDon_PhanTrangOrTimKiem")
    private ResponseEntity<Object> getAllLichSuHoaDon(
            @Parameter(name = "page") @RequestParam(defaultValue = "0") Integer page,
            @Parameter(name = "size") @RequestParam(defaultValue = "5") Integer size,
            @Parameter(name = "startDate") @RequestParam(required = false) Date startDate, // Thêm tham số startDate
            @Parameter(name = "endDate") @RequestParam(required = false) Date endDate // Thêm tham số endDate
    ) {
        DataResponse dataResponse = new DataResponse();
        dataResponse.setStatus(true); // set trạng thái phản hồi là true cho biết là đã xử lý thành công

        // Gọi dịch vụ để lấy danh sách lịch sử hóa đơn với phân trang và khoảng thời gian
        var responseList = lichSuHoaDonService.getAllLichSuHoaDon(page, size, startDate, endDate);
        dataResponse.setResult(new ResultModel<>(null, responseList));

        return ResponseEntity.ok(dataResponse);
    }
}
