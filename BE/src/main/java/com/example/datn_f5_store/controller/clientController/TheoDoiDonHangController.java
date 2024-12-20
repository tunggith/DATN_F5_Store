package com.example.datn_f5_store.controller.clientController;

import com.example.datn_f5_store.entity.ChiTietHoaDonEntity;
import com.example.datn_f5_store.service.client.TheoDoiDonHangClientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/customer")
public class TheoDoiDonHangController {

    @Autowired
    private TheoDoiDonHangClientService theoDoiDonHangClientService;

    @GetMapping("/theo-doi-don-hang/{ma}")
    public ResponseEntity<List<ChiTietHoaDonEntity>> getHoaDonById(@PathVariable("ma") String ma) {
        List<ChiTietHoaDonEntity> chiTietHoaDonList = theoDoiDonHangClientService.getHoaDonByMa(ma);

        if (chiTietHoaDonList.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(chiTietHoaDonList);
    }
}
