package com.example.datn_f5_store.controller.payment;
import com.example.datn_f5_store.service.payment.VNPayService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.UnsupportedEncodingException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/vnpay")
public class VNPayController {

    @Autowired
    private VNPayService vnPayService;

    @GetMapping("createPay")
    public ResponseEntity<?> createPay(@RequestParam long amount) throws Exception {
        return ResponseEntity.ok().body(vnPayService.createVnPayPayment(amount));
    }
//    @GetMapping("/return")
//    public String paymentReturn(@RequestParam Map<String, String> params) {
//        // Xử lý logic xác minh giao dịch ở đây
//        String vnpSecureHash = params.get("vnp_SecureHash");
//        params.remove("vnp_SecureHash");
//        params.remove("vnp_SecureHashType");
//
//        // Kiểm tra mã SHA512
//        List<String> fieldNames = new ArrayList<>(params.keySet());
//        Collections.sort(fieldNames);
//        StringBuilder hashData = new StringBuilder();
//        for (String fieldName : fieldNames) {
//            String value = params.get(fieldName);
//            if (value != null && !value.isEmpty()) {
//                hashData.append(fieldName).append("=").append(value).append("&");
//            }
//        }
//        hashData.deleteCharAt(hashData.length() - 1);
//        try {
//            String secureHash = vnPayService.hmacSHA512(vnPayService.getHashSecret(), hashData.toString());
//            if (secureHash.equals(vnpSecureHash)) {
//                // Thanh toán thành công
//                return "Thanh toán thành công!";
//            } else {
//                return "Thanh toán không hợp lệ!";
//            }
//        } catch (Exception e) {
//            return "Lỗi xử lý: " + e.getMessage();
//        }
//    }
}
