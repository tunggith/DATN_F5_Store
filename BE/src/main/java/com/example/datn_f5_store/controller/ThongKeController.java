package com.example.datn_f5_store.controller;

import com.example.datn_f5_store.request.ThongKeDoanhThuRequest;
import com.example.datn_f5_store.service.impl.ThongKeSeviceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/thong-ke")
public class ThongKeController {
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("dd/MM/yyyy");
@Autowired
    private ThongKeSeviceImpl seviceThongKe;


    @GetMapping("/theo-ngay")
    public ResponseEntity<?> getDoanhThuTheoNgay(
            @RequestParam String startDate, // dd/MM/yyyy
            @RequestParam String endDate) { // dd/MM/yyyy
        try {
            // Chuyển đổi từ dd/MM/yyyy sang yyyy-MM-dd
            LocalDate startLocalDate = LocalDate.parse(startDate, DATE_FORMATTER);
            LocalDate endLocalDate = LocalDate.parse(endDate, DATE_FORMATTER);

            // Chuyển sang định dạng yyyy-MM-dd để truyền vào truy vấn SQL
            String startSqlDate = startLocalDate.toString(); // yyyy-MM-dd
            String endSqlDate = endLocalDate.toString();     // yyyy-MM-dd

            // Gọi service để lấy doanh thu
            List<Map<String, Object>> doanhThu = seviceThongKe.getDoanhThuTheoNgay(startSqlDate, endSqlDate);
            return ResponseEntity.ok(doanhThu);
        } catch (DateTimeParseException e) {
            // Lỗi khi người dùng nhập sai định dạng ngày
            return ResponseEntity.badRequest().body("Ngày không đúng định dạng, vui lòng nhập theo định dạng dd/MM/yyyy");
        } catch (Exception e) {
            // Lỗi hệ thống khác
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Lỗi: " + e.getMessage());
        }
    }


    @GetMapping("/theo-thang")
    public ResponseEntity<?> getDoanhThuTheoThang(@RequestParam int year) {
        try {
            List<Map<String, Object>> doanhThu = seviceThongKe.getDoanhThuTheoThang(year);
            return ResponseEntity.ok(doanhThu);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Lỗi: " + e.getMessage());
        }
    }

    @GetMapping("/theo-nam")
    public ResponseEntity<?> getDoanhThuTheoKhoangNam(@RequestParam int startYear, @RequestParam int endYear) {
        try {
            List<Map<String, Object>> doanhThu = seviceThongKe.getDoanhThuTheoKhoangNam(startYear, endYear);
            return ResponseEntity.ok(doanhThu);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Lỗi: " + e.getMessage());
        }
    }

    @GetMapping("/theo-quy")
    public ResponseEntity<?> getDoanhThuTheoQuy(@RequestParam int year) {
        try {
            List<Map<String, Object>> doanhThu = seviceThongKe.getDoanhThuTheoQuy(year);
            return ResponseEntity.ok(doanhThu);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Lỗi: " + e.getMessage());
        }
    }


    @GetMapping("/top-san-pham/theo-ngay")
    public List<Map<String, Object>> getTopSanPhamTheoNgay(@RequestParam("startDate") String startDate, @RequestParam("endDate") String endDate) {
        try {
            // Định dạng ngày nhập vào là dd/MM/yyyy
            DateTimeFormatter inputFormatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
            DateTimeFormatter dbFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");

            // Chuyển đổi ngày từ dd/MM/yyyy sang yyyy-MM-dd
            LocalDate startLocalDate = LocalDate.parse(startDate, inputFormatter);
            LocalDate endLocalDate = LocalDate.parse(endDate, inputFormatter);

            // Truyền ngày đã chuyển đổi vào service với định dạng yyyy-MM-dd
            String formattedStartDate = startLocalDate.format(dbFormatter);
            String formattedEndDate = endLocalDate.format(dbFormatter);

            return seviceThongKe.getTopSanPhamTheoNgay(formattedStartDate, formattedEndDate);
        } catch (DateTimeParseException e) {
            // Xử lý lỗi nếu ngày không đúng định dạng
            throw new IllegalArgumentException("Ngày không hợp lệ, yêu cầu định dạng dd/MM/yyyy");
        }
    }
    @GetMapping("/top-san-pham/theo-thang")
    public List<Map<String, Object>> getTopSanPhamTheoThang(@RequestParam("year") int year) {
        return seviceThongKe.getTop5SanPhamTheoThang(   year);
    }

    @GetMapping("/top-san-pham/theo-quy")
    public List<Map<String, Object>> getTopSanPhamTheoQuy(@RequestParam("year") int year) {
        return seviceThongKe.getTopSanPhamTheoQuy(year);
    }

    @GetMapping("/top-san-pham/theo-khoang-nam")
    public List<Map<String, Object>> getTopSanPhamTheoKhoangNam(@RequestParam("startYear") int startYear, @RequestParam("endYear") int endYear) {
        return seviceThongKe.getTopSanPhamTheoKhoangNam(startYear, endYear);
    }
}
