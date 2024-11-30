package com.example.datn_f5_store.controller.clientController;


import com.example.datn_f5_store.entity.HoaDonEntity;
import com.example.datn_f5_store.service.client.TheoDoiDonHangClientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/customer")
public class TheoDoiDonHangController {

    @Autowired
    private TheoDoiDonHangClientService theoDoiDonHangClientService;

    @GetMapping("/theo-doi-don-hang/{ma}")
    public HoaDonEntity getHoaDonById(@PathVariable("ma") String ma) {
        return theoDoiDonHangClientService.getHoaDonByMa(ma);
    }
}
