package com.example.datn_f5_store.controller.clientController;

import com.example.datn_f5_store.request.ChiTietGioHangLocalRequest;
import com.example.datn_f5_store.request.ChiTietGioHangRequest;
import com.example.datn_f5_store.request.ThanhToanRequest;
import com.example.datn_f5_store.request.XuLyGioHangVaThanhToanRequest;
import com.example.datn_f5_store.response.DataResponse;
import com.example.datn_f5_store.response.ResultModel;
import com.example.datn_f5_store.service.client.ThanhToanClientService;
import io.swagger.v3.oas.annotations.Parameter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
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

//    @PostMapping("/thanh-toan")
//    public ResponseEntity<Object> thanhToan(@RequestBody ThanhToanRequest request) {
//        return new ResponseEntity<>(thanhToanClientService.thanhToan(request), HttpStatus.OK);
//    }
    @PostMapping("/luu/{id}")
    public ResponseEntity<Object> luu(
            @Parameter(name = "id")@PathVariable Integer id,
            @RequestBody List<ChiTietGioHangLocalRequest> requests
    ){
        return new ResponseEntity<>(thanhToanClientService.luuGioHang(id,requests), HttpStatus.OK);
    }
    @PostMapping("/xu-ly")
    public ResponseEntity<?> xuLyGioHangVaThanhToan(
            @RequestBody XuLyGioHangVaThanhToanRequest request) {
        try {
            DataResponse response = thanhToanClientService.xuLyGioHangVaThanhToan(
                    request.getGioHangRequests(),
                    request.getThanhToanRequest()
            );
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new DataResponse(false, new ResultModel<>(null,"thất bại")));
        }
    }
}
