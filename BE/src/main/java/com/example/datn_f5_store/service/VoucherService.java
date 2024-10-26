package com.example.datn_f5_store.service;




import com.example.datn_f5_store.dto.VoucherDto;
import com.example.datn_f5_store.entity.VoucherEntity;
import com.example.datn_f5_store.exceptions.DataNotFoundException;
import com.example.datn_f5_store.request.VoucherRequest;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;
import com.example.datn_f5_store.response.DataResponse;

import java.time.LocalDateTime;
import java.util.Date;

@Service
public interface VoucherService {
   Page<VoucherDto> getAll(int page, int size);
   DataResponse createVoucher(VoucherRequest voucher);
   DataResponse updateVoucher(Integer id, VoucherRequest voucher) throws DataNotFoundException;
   VoucherEntity finById(Integer id) throws DataNotFoundException;
   DataResponse CapNhapTrangThaiVoucher(Integer id) ;
   boolean checkTrungMaVoucher(String ma);
   void CapNhapTrangThaiVoucherDhh();
   Page<VoucherDto> findVoucherByDate(int page, int size, LocalDateTime start, LocalDateTime end);
   Page<VoucherDto> findByTenOrMa(int page, int size, String tim);
   Page<VoucherDto> findByTrangThai(int page, int size, String trangThai);
   Page<VoucherDto> findByTrangThaiDangDienRa(int page, int size, String trangThai);

}
