package com.example.datn_f5_store.controller;

import com.example.datn_f5_store.dto.KhuyenMaiDto;
import com.example.datn_f5_store.entity.KhuyenMaiEntity;
import com.example.datn_f5_store.exceptions.DataNotFoundException;
import com.example.datn_f5_store.request.KhuyenMaiRequest;
import com.example.datn_f5_store.service.KhuyenMaiService;
import io.swagger.v3.oas.annotations.Parameter;
import jakarta.persistence.EntityNotFoundException;
import jakarta.websocket.server.PathParam;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.web.ErrorResponse;
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

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;
@RestController
@RequestMapping("/api/v1/khuyen-mai")
public class KhuyenMaiController {
    @Autowired
    KhuyenMaiService khuyenMaiService;

    @GetMapping("/getAll")
    private ResponseEntity<Object> getAll(@Parameter(name = "page") @RequestParam(defaultValue = "0") Integer page,
                                          @Parameter(name = "size") @RequestParam(defaultValue = "5") Integer size) {
        DataResponse dataResponse = new com.example.datn_f5_store.response.DataResponse(); // Tạo đối tượng phản hồi dữ liệu
        dataResponse.setStatus(true); // Đặt trạng thái phản hồi là thành công
        var responseList = khuyenMaiService.getAll(page, size); // Lấy danh sách Khuyen mai với phân trang
        // ham tự động cập nhập trạng thái Khuyến mãi khi hết hạn
        khuyenMaiService.CapNhapTrangThaiKhuyenMaiDhh();
        dataResponse.setResult(new ResultModel<>(null, responseList)); // Đặt kết quả vào response
        return ResponseEntity.ok(dataResponse);
    }

    @GetMapping("/find-by-tenOrma")
    public ResponseEntity<Object> findByTenorMa(
            @Parameter(name = "page") @RequestParam(defaultValue = "0") Integer page, // Số trang hiện tại
            @Parameter(name = "size") @RequestParam(defaultValue = "5") Integer size, // Kích thước trang
            @RequestParam(required = false) String tim // Tên hoặc Mã Khuyến mãi cần tìm
    ) {
        DataResponse dataResponse = new DataResponse(); // Tạo đối tượng phản hồi dữ liệu
        dataResponse.setStatus(true); // Đặt trạng thái phản hồi là thành công

        Page<KhuyenMaiDto> responseList = khuyenMaiService.findByTenOrMa(page, size, tim);

        dataResponse.setResult(
                new ResultModel<>(
                        new PagingModel(page, size, responseList.getTotalElements(), responseList.getTotalPages()),
                        responseList.getContent() // Lấy danh sách các đối tượng KhuyenMaiDto từ trang hiện tại
                )
        );

        return ResponseEntity.ok(dataResponse); // Trả về phản hồi HTTP 200 OK với dữ liệu
    }
        @GetMapping("/find-by-trangThai")
        public ResponseEntity<Object> findByTrangThai(
                @Parameter(name = "page") @RequestParam(defaultValue = "0") Integer page, // Số trang hiện tại
                @Parameter(name = "size") @RequestParam(defaultValue = "5") Integer size, // Kích thước trang
                @RequestParam(required = false) String trangThai
        ) {
            DataResponse dataResponse = new DataResponse(); // Tạo đối tượng phản hồi dữ liệu
            dataResponse.setStatus(true); // Đặt trạng thái phản hồi là thành công
            Page<KhuyenMaiDto> responseList = khuyenMaiService.findByTrangThai(page, size, trangThai);

            dataResponse.setResult(
                    new ResultModel<>(
                            new PagingModel(page, size, responseList.getTotalElements(), responseList.getTotalPages()),
                            responseList.getContent() // Lấy danh sách các đối tượng KhuyenMaiDto từ trang hiện tại
                    )
            );
            return ResponseEntity.ok(dataResponse); // Trả về phản hồi HTTP 200 OK với dữ liệu
        }


    // api thêm khuyến mãi
    @PostMapping("/create")
    public ResponseEntity<?> createKhuyenMai(@RequestBody KhuyenMaiRequest khuyenMai) {
        try {
            DataResponse savedKhuyenMai = khuyenMaiService.create(khuyenMai);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedKhuyenMai);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    // api update khuyến mãi theo id
    @PutMapping("/update/{id}")
    private ResponseEntity<?> update(@Parameter(name = "id") @PathVariable Integer id,
                                     @RequestBody KhuyenMaiRequest khuyenMaiRequest) {
        return new ResponseEntity<>(khuyenMaiService.update(khuyenMaiRequest, id), HttpStatus.OK);
    }

    @GetMapping("/finById/{id}")
    private ResponseEntity<DataResponse> finById(@Parameter(name = "id") @PathVariable Integer id) {
        try {
            // Tìm kiếm khuyến mãi theo ID
            KhuyenMaiEntity khuyenMai = khuyenMaiService.findById(id);

            // Tạo đối tượng ResultModel với nội dung là khuyến mãi
            ResultModel<KhuyenMaiEntity> result = ResultModel.<KhuyenMaiEntity>builder()
                    .content(khuyenMai)
                    .pagination(null) // Hoặc thêm thông tin phân trang nếu cần
                    .build();

            // Tạo đối tượng DataResponse
            DataResponse response = new DataResponse(true, result);
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (EntityNotFoundException e) {
            // Tạo đối tượng ResultModel với nội dung là null
            ResultModel<Object> result = ResultModel.<Object>builder()
                    .content(null) // Hoặc có thể để null
                    .pagination(null) // Hoặc thêm thông tin phân trang nếu cần
                    .build();

            // Tạo DataResponse lỗi
            DataResponse response = new DataResponse(false, result);
            return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
        }
    }




    // api hiển lọc Khuyến mãi theo Ngày
    @GetMapping("/find-by-date")
    public ResponseEntity<DataResponse> findByDate(
            @RequestParam(defaultValue = "0") Integer page, // Số trang hiện tại
            @RequestParam(defaultValue = "5") Integer size, // Kích thước trang
            @RequestParam(required = false) @DateTimeFormat(pattern = "yyyy-MM-dd'T'HH:mm") LocalDateTime ngayBatDau, // Ngày bắt đầu
            @RequestParam(required = false) @DateTimeFormat(pattern = "yyyy-MM-dd'T'HH:mm") LocalDateTime ngayKetThuc // Ngày kết thúc
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


    @PutMapping("/capNhapTrangThai")
    private ResponseEntity<?> CapNhapTrangThaiKhuyenMai(@Parameter(name = "id")  Integer id
                                    ) {
        return new ResponseEntity<>(khuyenMaiService.CapNhapTrangThaiKhuyenMai(id), HttpStatus.OK);
    }

}
