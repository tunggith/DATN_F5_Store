package com.example.datn_f5_store.controller;

import com.example.datn_f5_store.dto.KhuyenMaiDto;
import com.example.datn_f5_store.entity.KhuyenMaiEntity;
import com.example.datn_f5_store.request.KhuyenMaiRequest;
import com.example.datn_f5_store.service.KhuyenMaiService;
import io.swagger.v3.oas.annotations.Parameter;
import jakarta.websocket.server.PathParam;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.format.annotation.DateTimeFormat;
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
import com.example.datn_f5_store.response.DataResponse;
import com.example.datn_f5_store.response.PagingModel;
import com.example.datn_f5_store.response.ResultModel;

import java.util.Date;


@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/v1/khuyen-mai")
public class KhuyenMaiController {
    @Autowired
    KhuyenMaiService khuyenMaiService;

    @GetMapping("/getAll")
    private ResponseEntity<Object> getAll(@Parameter(name = "page") @RequestParam(defaultValue = "0") Integer page,
                                          @Parameter(name = "size") @RequestParam(defaultValue = "3") Integer size) {
        DataResponse dataResponse = new com.example.datn_f5_store.response.DataResponse(); // Tạo đối tượng phản hồi dữ liệu
        dataResponse.setStatus(true); // Đặt trạng thái phản hồi là thành công
        var responseList = khuyenMaiService.getAll(page, size); // Lấy danh sách Khuyen mai với phân trang
        // ham tự động cập nhập trạng thái Khuyến mãi khi hết hạn
        khuyenMaiService.CapNhapTrangThaiKhuyenMaiDhh();
        dataResponse.setResult(new ResultModel<>(null, responseList)); // Đặt kết quả vào response
        return ResponseEntity.ok(dataResponse);
    }

    @GetMapping("/find-by-tenOrma")
    private ResponseEntity<Object> findByTenorMa(
            @Parameter(name = "page") @RequestParam(defaultValue = "0") Integer page, // Số trang hiện tại
            @Parameter(name = "size") @RequestParam(defaultValue = "3") Integer size, // Kích thước trang
            @Parameter(name = "tim") @RequestParam String tim // Tên Khuyen mai hoac Mã Khuyến mai can tim

    ) {
        DataResponse dataResponse = new DataResponse(); // Tạo đối tượng phản hồi dữ liệu
        dataResponse.setStatus(true); // Đặt trạng thái phản hồi là thành công
        var responseList = khuyenMaiService.findByTenOrMa(page, size,tim); // Tìm Khuyến mãi theo tên hoặc mã
        dataResponse.setResult(
                new ResultModel<>(
                        new PagingModel(page, size, responseList.getTotalElements(), responseList.getTotalPages()), responseList
                ) // Đặt kết quả vào response với thông tin phân trang
        );
        return ResponseEntity.ok(dataResponse); // Trả về phản hồi HTTP 200 OK với dữ liệu
    }

    // api thêm khuyến mãi
    @PostMapping("/create")
    private ResponseEntity<?> create(@RequestBody KhuyenMaiRequest khuyenMaiRequest) {
        return new ResponseEntity<>(khuyenMaiService.create(khuyenMaiRequest), HttpStatus.CREATED);
    }

    // api update khuyến mãi theo id
    @PutMapping("/update/{id}")
    private ResponseEntity<?> update(@Parameter(name = "id") @PathVariable Integer id,
                                     @RequestBody KhuyenMaiRequest khuyenMaiRequest) {
        return new ResponseEntity<>(khuyenMaiService.update(khuyenMaiRequest, id), HttpStatus.OK);
    }

    // api hiển lọc Khuyến mãi theo Ngày
    @GetMapping("/find-by-date")
    public ResponseEntity<DataResponse> findByDate(
            @RequestParam(defaultValue = "0") Integer page, // Số trang hiện tại
            @RequestParam(defaultValue = "3") Integer size, // Kích thước trang
            @RequestParam(required = false) @DateTimeFormat(pattern = "yyyy-MM-dd") Date ngayBatDau, // Ngày bắt đầu
            @RequestParam(required = false) @DateTimeFormat(pattern = "yyyy-MM-dd") Date ngayKetThuc // Ngày kết thúc
    ) {
        try {
            // Gọi service để tìm khuyến mãi theo ngày bắt đầu và kết thúc
            Page<KhuyenMaiDto> responseList = khuyenMaiService.findKhuyenMaiByDate(page, size, ngayBatDau, ngayKetThuc);
            // Tạo đối tượng phản hồi với dữ liệu phân trang
            DataResponse dataResponse = new DataResponse(true,
                    new ResultModel<>(new PagingModel(page, size, responseList.getTotalElements(), responseList.getTotalPages()),
                            responseList.getContent()));

            // Trả về phản hồi HTTP 200 OK với dữ liệu
            return ResponseEntity.ok(dataResponse);
        } catch (Exception e) {
            // Trong trường hợp có lỗi, trả về lỗi 400 BAD REQUEST với thông báo lỗi
            DataResponse errorResponse = new DataResponse(false,
                    new ResultModel<>(null, "Đã xảy ra lỗi: " + e.getMessage()));
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }


    // api cập nhập trạng thái Khuyến mãi
    @PostMapping("/capNhapTrangThai")
    public ResponseEntity<?> CapNhapTrangThaiKhuyenMai(@PathParam("id") Integer id){
        try {
            khuyenMaiService.CapNhapTrangThaiKhuyenMai(id);
            return ResponseEntity.ok("Cập nhập trạng thái thành công");
        }catch (Exception e){
            String error = "Cập nhập trạng thái thất bại, vui lòng kiểm tra lại";
            return ResponseEntity.badRequest().body(error);
        }
    }
}
