package com.example.datn_f5_store.controller;

import com.example.datn_f5_store.Response.DataResponse;
import com.example.datn_f5_store.Response.ResultModel;
import com.example.datn_f5_store.dto.VoucherDto;
import com.example.datn_f5_store.entity.Voucher;
import com.example.datn_f5_store.repository.IVoucherRepository;
import com.example.datn_f5_store.request.VoucherRequest;
import com.example.datn_f5_store.service.VoucherService;
import io.swagger.v3.oas.annotations.Parameter;
import jakarta.websocket.server.PathParam;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/v1/voucher")
public class VoucherController {
    @Autowired
    VoucherService voucherService;

    @Autowired
    IVoucherRepository iVoucherRepository;

    // api find Voucher đã được phân trang với 5 phần tử
    @GetMapping("")
    public ResponseEntity<Object> getVoucher(@RequestParam(name = "page",defaultValue = "0") Integer page,
                                             @RequestParam(name = "size",  defaultValue = "5") Integer size){
        DataResponse dataResponse = new DataResponse();
        var reposeList = voucherService.getAll(page , size);
        dataResponse.setResult(new ResultModel<>(null, reposeList));

        // hàm tự động cập nhập trạng thái khi voucher hết hạn
        voucherService.CapNhapTrangThaiVoucherDhh();

        return  ResponseEntity.ok(dataResponse);
    }

    // api Thêm mới Voucher
    @PostMapping("")
    public ResponseEntity<?> createVoucher(@Validated @RequestBody VoucherRequest voucher, BindingResult bindingResult){
        try {
                if(bindingResult.hasErrors()){
                    List<String> error = (List<String>) bindingResult.getFieldError();
                    return ResponseEntity.badRequest().body(error);
                }
                 voucherService.createVoucher(voucher);
                 return ResponseEntity.ok("Thêm thành công");

        }catch (Exception e){
              String error = "Thêm thất bại, vui lòng kiểm tra lại";
                return ResponseEntity.badRequest().body(error);
        }
    }

    // api sửa Voucher theo id
    @PutMapping("")
    public ResponseEntity<?> updateVoucher(@PathParam("id") Integer id,@Validated @RequestBody VoucherRequest voucher, BindingResult bindingResult){
        try {
            if (bindingResult.hasErrors()) {
                List<String> errors = bindingResult.getFieldErrors()
                        .stream()
                        .map(error -> error.getDefaultMessage())
                        .collect(Collectors.toList());
                return ResponseEntity.badRequest().body(errors);
            }
            voucherService.updateVoucher(id,voucher);
            return ResponseEntity.ok("Sửa thành công");
        }catch (Exception e){
            String error = "Sửa thất bại, vui lòng kiểm tra lại";
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // api sửa trạng thái voucher theo id
    @PostMapping("/capNhapTrangThai")
    public ResponseEntity<?> CapNhapTrangThaiVoucher(@PathParam("id") Integer id){
        try {
            voucherService.CapNhapTrangThaiVoucher(id);
            return ResponseEntity.ok("Cập nhập trạng thái thành công");
        }catch (Exception e){
             String error = "Cập nhập trạng thái thất bại, vui lòng kiểm tra lại";
            return ResponseEntity.badRequest().body(error);
        }
    }
    @DeleteMapping("")
    public String XoaVoucher(@PathParam("id") Integer id){
        iVoucherRepository.deleteById(id);
        return "Thành công";
    }



}
