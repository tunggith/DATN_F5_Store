package com.example.datn_f5_store.service;

import com.example.datn_f5_store.dto.VoucherDto;
import com.example.datn_f5_store.entity.Voucher;
import com.example.datn_f5_store.exceptions.DataNotFoundException;
import com.example.datn_f5_store.request.VoucherRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public interface VoucherService {
   Page<VoucherDto> getAll(int page, int size);
   public Boolean createVoucher(VoucherRequest voucher);
   public Boolean updateVoucher(Integer id,VoucherRequest voucher) throws DataNotFoundException;
   public Voucher finById(Integer id) throws DataNotFoundException;
   public Boolean CapNhapTrangThaiVoucher(Integer id) throws DataNotFoundException;
   public boolean checkTrungMaVoucher(String ma);

   public void CapNhapTrangThaiVoucherDhh();

}