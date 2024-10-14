package com.example.datn_f5_store.service.impl;

import com.example.datn_f5_store.dto.TopSanPhamDTO;
import com.example.datn_f5_store.repository.IChiTietHoaDonRepository;
import com.example.datn_f5_store.repository.IHoaDonRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ThongKeSeviceImpl {
    private static final DateTimeFormatter OUTPUT_FORMATTER = DateTimeFormatter.ofPattern("dd/MM/yyyy");
    @Autowired
    IChiTietHoaDonRepository repoCTHD;
    @Autowired
    IHoaDonRepository repoHoaDon;

    public List<Map<String, Object>> getTop10SanPhamBanChay() {
        // Lấy dữ liệu thô từ truy vấn
        List<Object[]> rawResults = repoCTHD.top10sanphambanchay();

        // Chuyển đổi kết quả thô thành danh sách Map để trả về dưới dạng JSON
        List<Map<String, Object>> results = new ArrayList<>();
        for (Object[] row : rawResults) {
            // Kiểm tra row[] không null và có đủ phần tử
            if (row != null && row.length >= 3) {
                Map<String, Object> result = new HashMap<>();
                result.put("chiTietSanPham", row[0]);   // Chi tiết sản phẩm
                result.put("soluongban", row[1]);        // Tổng số lượng đã bán
                result.put("soluongsanphamdangtronghoadon", row[2]);      // Số lượt bán (số hóa đơn chứa sản phẩm)
                results.add(result);
            }
        }
        return results;
    }



    public List<Map<String, Object>> getDoanhThuTheoNgay(String startDate, String endDate) {
        List<Object[]> rawResults = repoHoaDon.findDoanhThuTheoNgay(startDate, endDate);

        // Chuyển kết quả thô thành danh sách Map và định dạng lại ngày thành dd/MM/yyyy
        List<Map<String, Object>> results = new ArrayList<>();
        for (Object[] row : rawResults) {
            Map<String, Object> result = new HashMap<>();

            // Chuyển đổi ngày (row[0]) từ yyyy-MM-dd sang dd/MM/yyyy
            LocalDate ngay = LocalDate.parse(row[0].toString());
            String formattedDate = ngay.format(OUTPUT_FORMATTER); // Định dạng lại ngày

            result.put("ngay", formattedDate);   // Ngày dưới dạng dd/MM/yyyy
            result.put("doanhThu", row[1]);      // Doanh thu
            results.add(result);
        }
        return results;
    }

    public List<Map<String, Object>> getDoanhThuTheoThang(int year) {
        List<Object[]> rawResults = repoHoaDon.findDoanhThuTheoThang(year);

        // Chuyển đổi kết quả thô thành danh sách Map để trả về dưới dạng JSON
        List<Map<String, Object>> results = new ArrayList<>();
        for (Object[] row : rawResults) {
            Map<String, Object> result = new HashMap<>();
            result.put("thang", row[0]);       // Tháng
            result.put("doanhThu", row[1]);    // Doanh thu
            results.add(result);
        }
        return results;
    }


    public List<Map<String, Object>> getDoanhThuTheoQuy(int year) {
        List<Object[]> rawResults = repoHoaDon.findDoanhThuTheoQuy(year);

        // Chuyển đổi kết quả thô thành danh sách Map để trả về dưới dạng JSON
        List<Map<String, Object>> results = new ArrayList<>();
        for (Object[] row : rawResults) {
            Map<String, Object> result = new HashMap<>();
            result.put("quy", row[0]);         // Quý
            result.put("doanhThu", row[1]);    // Doanh thu
            results.add(result);
        }
        return results;
    }


    public List<Map<String, Object>> getDoanhThuTheoKhoangNam(int startYear, int endYear) {
        List<Object[]> rawResults = repoHoaDon.findDoanhThuTheoKhoangNam(startYear, endYear);

        // Chuyển đổi kết quả thô thành danh sách Map để trả về dưới dạng JSON
        List<Map<String, Object>> results = new ArrayList<>();
        for (Object[] row : rawResults) {
            Map<String, Object> result = new HashMap<>();
            result.put("nam", row[0]);         // Năm
            result.put("doanhThu", row[1]);    // Doanh thu
            results.add(result);
        }
        return results;
    }



    public List<Map<String, Object>> getTop5SanPhamTheoThang(int year) {
        List<Object[]> results = repoCTHD.findTop5SanPhamTheoThang(year);
        List<Map<String, Object>> response = new ArrayList<>();

        for (Object[] result : results) {
            Map<String, Object> item = new HashMap<>();
            item.put("idSP", result[0]);   // ID sản phẩm
            item.put("tenSP", result[1]);  // Tên sản phẩm
            item.put("soluotduocban", result[2]);  // Tổng số lượng bán

            response.add(item);
        }
        return response;
    }





    public List<Map<String, Object>> getTopSanPhamTheoQuy(int year) {
        List<Object[]> results = repoCTHD.findTopSanPhamTheoQuy(year);
        List<Map<String, Object>> response = new ArrayList<>();

        for (Object[] result : results) {
            Map<String, Object> item = new HashMap<>();
            item.put("idSP", result[0]);  // ID sản phẩm
            item.put("tenSP", result[1]);  // Tên sản phẩm
            item.put("soluotduocban", result[2]);  // Tổng số lượng bán

            response.add(item);
        }
        return response;
    }
    public List<Map<String, Object>> getTopSanPhamTheoKhoangNam(int startYear, int endYear) {
        List<Object[]> results = repoCTHD.findTopSanPhamTheoKhoangNam(startYear, endYear);
        List<Map<String, Object>> response = new ArrayList<>();

        for (Object[] result : results) {
            Map<String, Object> item = new HashMap<>();

            // Kiểm tra kích thước mảng để tránh lỗi
            if (result.length > 0) {
                item.put("idsp", result[0]);  // Năm
            }
            if (result.length > 1) {
                item.put("tenSP", result[1]);  // ID sản phẩm
            }
            if (result.length > 2) {
                item.put("soluotduocban", result[2]);  // Tên sản phẩm
            }

            response.add(item);
        }

        return response;
    }



    public List<Map<String, Object>> getTopSanPhamTheoNgay(String startDate, String endDate) {
        List<Object[]> results = repoCTHD.findTopSanPhamTheoNgay(startDate, endDate);
        List<Map<String, Object>> response = new ArrayList<>();

        // Thực hiện chuyển đổi trực tiếp kết quả từ Object[] sang Map
        for (Object[] result : results) {
            Map<String, Object> item = new HashMap<>();

            // Kiểm tra kích thước mảng để tránh lỗi
            if (result.length > 0) {
                item.put("idSP", result[0]);  // ID sản phẩm
            }
            if (result.length > 1) {
                item.put("tenSP", result[1]);  // Tên chi tiết sản phẩm
            }
            if (result.length > 2) {
                item.put("soluotduocban", result[2]);  // Tổng số lượng bán
            }

            response.add(item);
        }

        return response;
    }



}
