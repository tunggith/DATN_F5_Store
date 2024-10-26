package com.example.datn_f5_store.controller;



import com.example.datn_f5_store.dto.VoucherDto;
import com.example.datn_f5_store.exceptions.DataNotFoundException;
import com.example.datn_f5_store.repository.IVoucherRepository;
import com.example.datn_f5_store.request.VoucherRequest;
import com.example.datn_f5_store.response.DataResponse;
import com.example.datn_f5_store.response.ResultModel;
import com.example.datn_f5_store.service.VoucherService;
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

import java.time.LocalDateTime;
import java.util.Date;
@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/v1/voucher")
public class VoucherController {
    @Autowired
    VoucherService voucherService;

    @Autowired
    IVoucherRepository iVoucherRepository;

    // api find Voucher đã được phân trang với 5 phần tử
    @GetMapping("/getAll")
    public ResponseEntity<Object> getVoucher(@RequestParam(name = "page",defaultValue = "0") Integer page,
                                             @RequestParam(name = "size",  defaultValue = "5") Integer size){
        DataResponse dataResponse = new DataResponse();
        var reposeList = voucherService.getAll(page , size);
        dataResponse.setResult(new ResultModel<Object>(null, reposeList));

        // hàm tự động cập nhập trạng thái khi voucher hết hạn
        voucherService.CapNhapTrangThaiVoucherDhh();

        return  ResponseEntity.ok(dataResponse);
    }

    // api Thêm mới Voucher
    @PostMapping("/create")
    public ResponseEntity<?> createVoucher(@RequestBody VoucherRequest voucher){
        return new ResponseEntity<>(voucherService.createVoucher(voucher), HttpStatus.OK);
    }

    // api sửa Voucher theo id
    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateVoucher(@PathParam("id") @PathVariable Integer id, @RequestBody VoucherRequest voucher) throws DataNotFoundException {
        return new ResponseEntity<>(voucherService.updateVoucher(id,voucher), HttpStatus.OK);
    }

    @PutMapping("/capNhapTrangThai")
    public ResponseEntity<?> CapNhapTrangThaiVoucher(@PathParam("id")  Integer id)  {
        return new ResponseEntity<>(voucherService.CapNhapTrangThaiVoucher(id), HttpStatus.OK);
    }

    // api sửa trạng thái voucher theo id


    @GetMapping("/searchByTenOrMa")
    public ResponseEntity<DataResponse> findByDate(
            @RequestParam(defaultValue = "0") Integer page, // Số trang hiện tại
            @RequestParam(defaultValue = "5") Integer size, // Kích thước trang
            @RequestParam(required = false)  String tim) {
        try {
            // Gọi service để tìm Voucher theo tên or mã
            Page<VoucherDto> responseList = voucherService.findByTenOrMa(page, size, tim);
            // Tạo đối tượng phản hồi với dữ liệu phân trang
            DataResponse dataResponse = new DataResponse(true,
                    new ResultModel<>(new com.example.datn_f5_store.response.PagingModel(page, size, responseList.getTotalElements(), responseList.getTotalPages()),
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

    @GetMapping("/find-by-date")
    public ResponseEntity<DataResponse> findByDate(
            @RequestParam(defaultValue = "0") Integer page, // Số trang hiện tại
            @RequestParam(defaultValue = "5") Integer size, // Kích thước trang
            @RequestParam(required = false) @DateTimeFormat(pattern = "yyyy-MM-dd'T'HH:mm") LocalDateTime ngayBatDau, // Ngày bắt đầu
            @RequestParam(required = false) @DateTimeFormat(pattern = "yyyy-MM-dd'T'HH:mm") LocalDateTime ngayKetThuc // Ngày kết thúc
    ) {
        try {
            // Gọi service để tìm Voucher theo ngày bắt đầu và kết thúc
            Page<VoucherDto> responseList = voucherService.findVoucherByDate(page, size, ngayBatDau, ngayKetThuc);
            // Tạo đối tượng phản hồi với dữ liệu phân trang
            DataResponse dataResponse = new DataResponse(true,
                    new ResultModel<>(new com.example.datn_f5_store.response.PagingModel(page, size, responseList.getTotalElements(), responseList.getTotalPages()),
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

    @GetMapping("/find-by-trangThai")
    public ResponseEntity<Object> findByTrangThai(
            @Parameter(name = "page") @RequestParam(defaultValue = "0") Integer page, // Số trang hiện tại
            @Parameter(name = "size") @RequestParam(defaultValue = "5") Integer size, // Kích thước trang
            @RequestParam(required = false) String trangThai
    ) {
        DataResponse dataResponse = new DataResponse(); // Tạo đối tượng phản hồi dữ liệu
        dataResponse.setStatus(true); // Đặt trạng thái phản hồi là thành công
        Page<VoucherDto> responseList = voucherService.findByTrangThai(page, size, trangThai);

        dataResponse.setResult(
                new ResultModel<>(
                        new com.example.datn_f5_store.response.PagingModel(page, size, responseList.getTotalElements(), responseList.getTotalPages()),
                        responseList.getContent() // Lấy danh sách các đối tượng VoucherDto từ trang hiện tại
                )
        );
        return ResponseEntity.ok(dataResponse); // Trả về phản hồi HTTP 200 OK với dữ liệu
    }

    @GetMapping("/find-by-trangThaiDangDienRa")
    public ResponseEntity<Object> findByTrangThaiDangDienRa(
            @Parameter(name = "page") @RequestParam(defaultValue = "0") Integer page, // Số trang hiện tại
            @Parameter(name = "size") @RequestParam(defaultValue = "5") Integer size // Kích thước trang

    ) {
        DataResponse dataResponse = new DataResponse(); // Tạo đối tượng phản hồi dữ liệu
        dataResponse.setStatus(true); // Đặt trạng thái phản hồi là thành công
        Page<VoucherDto> responseList = voucherService.findByTrangThaiDangDienRa(page, size,"Đang diễn ra");

        dataResponse.setResult(
                new ResultModel<>(
                        new com.example.datn_f5_store.response.PagingModel(page, size, responseList.getTotalElements(), responseList.getTotalPages()),
                        responseList.getContent() // Lấy danh sách các đối tượng VoucherDto từ trang hiện tại
                )
        );
        return ResponseEntity.ok(dataResponse); // Trả về phản hồi HTTP 200 OK với dữ liệu
    }


}
