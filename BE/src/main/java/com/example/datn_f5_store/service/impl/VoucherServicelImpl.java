package com.example.datn_f5_store.service.impl;

import com.example.datn_f5_store.dto.VoucherDto;
import com.example.datn_f5_store.entity.Voucher;
import com.example.datn_f5_store.exceptions.DataNotFoundException;
import com.example.datn_f5_store.repository.IVoucherRepository;
import com.example.datn_f5_store.request.VoucherRequest;
import com.example.datn_f5_store.service.VoucherService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.config.ConfigDataLocationNotFoundException;
import org.springframework.boot.context.config.ConfigDataNotFoundException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class VoucherServicelImpl implements VoucherService {
    @Autowired
    private  IVoucherRepository iVoucherRepository;


    // hàm Find all VouCher
    @Override
    public Page<VoucherDto> getAll(int page, int size) {
        Pageable pageable = PageRequest.of(page,size);
        Page<Voucher> voucher = iVoucherRepository.findAll(pageable);

        Page<VoucherDto> voucherDtos = voucher.map(entity -> new VoucherDto(
                entity.getId(),
                entity.getMa(),
                entity.getTen(),
                entity.getGiaTriVoucher(),
                entity.getKieuGiamGia(),
                entity.getSoTienHoaDonToiThieu(),
                entity.getGiaTriGiamToiDa(),
                entity.getGiaTriGiamToiThieu(),
                entity.getThoiGianBatDau(),
                entity.getThoiGianKetThuc(),
                entity.getMoTa(),
                entity.getSoLuong(),
                entity.getNguoiTao(),
                entity.getThoiGianTao(),
                entity.getNguoiSua(),
                entity.getThoiGianSua(),
                entity.getTrangThai()
        ));
        return voucherDtos;
    }

    // hàm thêm mới Voucher
    @Override
    public Boolean createVoucher(VoucherRequest voucher){
              Voucher voucher1 = new Voucher();
              try {
                  if (checkTrungMaVoucher(voucher.getMa())){
                  voucher1.setMa(voucher.getMa());
                  voucher1.setTen(voucher.getTen());
                  voucher1.setGiaTriVoucher(voucher.getGiaTriVoucher());
                  voucher1.setGiaTriGiamToiDa(voucher.getGiaTriGiamToiDa());
                  voucher1.setGiaTriGiamToiThieu(voucher.getGiaTriGiamToiThieu());
                  voucher1.setKieuGiamGia(voucher.getKieuGiamGia());
                  voucher1.setSoTienHoaDonToiThieu(voucher.getSoTienHoaDonToiThieu());
                  voucher1.setThoiGianBatDau(voucher.getThoiGianBatDau());
                  voucher1.setThoiGianKetThuc(voucher.getThoiGianKetThuc());
                  voucher1.setSoLuong(voucher.getSoLuong());
                  voucher1.setNguoiTao(voucher.getNguoiTao());
                  voucher1.setThoiGianTao(voucher.getThoiGianTao());
                  voucher1.setThoiGianSua(voucher.getThoiGianSua());
                  voucher1.setNguoiSua(voucher.getNguoiSua());
                  voucher1.setMoTa(voucher.getMoTa());
                  voucher1.setTrangThai(voucher.getTrangThai());
                  iVoucherRepository.save(voucher1);
                  return true;
                  }
                  return false;
              }catch (Exception e){
                 return  false;
              }
    }

    // hàm Update Voucher theo id
    @Override
    public Boolean updateVoucher(Integer id, VoucherRequest voucher) throws DataNotFoundException {
            Voucher voucher1 = iVoucherRepository.findById(id).orElseThrow(()
            -> new DataNotFoundException("Không thể sửa Voucher với id : "+ voucher.getId()));
            if (voucher1 != null){

                voucher1.setMa(voucher.getMa());
                voucher1.setTen(voucher.getTen());
                voucher1.setGiaTriVoucher(voucher.getGiaTriVoucher());
                voucher1.setGiaTriGiamToiDa(voucher.getGiaTriGiamToiDa());
                voucher1.setGiaTriGiamToiThieu(voucher.getGiaTriGiamToiThieu());
                voucher1.setKieuGiamGia(voucher.getKieuGiamGia());
                voucher1.setSoTienHoaDonToiThieu(voucher.getSoTienHoaDonToiThieu());
                voucher1.setThoiGianBatDau(voucher.getThoiGianBatDau());
                voucher1.setThoiGianKetThuc(voucher.getThoiGianKetThuc());
                voucher1.setSoLuong(voucher.getSoLuong());
                voucher1.setNguoiTao(voucher.getNguoiTao());
                voucher1.setThoiGianTao(voucher.getThoiGianTao());
                voucher1.setThoiGianSua(voucher.getThoiGianSua());
                voucher1.setNguoiSua(voucher.getNguoiSua());
                voucher1.setMoTa(voucher.getMoTa());
                voucher1.setTrangThai(voucher.getTrangThai());
                iVoucherRepository.save(voucher1);
                return true;
            }else {
               return false;
            }

    }

    // hàm find Voucher theo id
    @Override
    public Voucher finById(Integer id) throws DataNotFoundException {
        return iVoucherRepository.findById(id).orElseThrow(()
                -> new DataNotFoundException("Không thể Tìm Voucher với id : "+ id));
    }

    // hàm cập nhập trạng thái Voucher
    @Override
    public Boolean CapNhapTrangThaiVoucher(Integer id) throws DataNotFoundException{
        Voucher voucher1 = iVoucherRepository.findById(id).orElseThrow(
                () -> new DataNotFoundException("Không thể cập nhập trạng thái với id : "+ id)
        );
        if (voucher1 != null){
            voucher1.setTrangThai("Không hoạt động");
            iVoucherRepository.save(voucher1);
            return true;
        }else {
            return false;
        }
    }

    // hàm check trùng mã Voucher
    @Override
    public boolean checkTrungMaVoucher(String ma) {
        if (iVoucherRepository.existsByMa(ma)) {
            return false;
        }
        return true;
    }


    //hàm tự động câp nhập trạng thái Voucher khi đã hết hạn
    @Override
    @Scheduled(cron = "0 0 12 * * ?")
    public void CapNhapTrangThaiVoucherDhh() {
        try {
            Date currentDate = new Date();
            List<Voucher> vouchers = iVoucherRepository.findAll();
            for (Voucher voucher : vouchers) {
                if (voucher.getThoiGianKetThuc() != null && voucher.getThoiGianKetThuc().before(currentDate)) {
                    voucher.setTrangThai("Đã hết hạn");
                    iVoucherRepository.save(voucher);
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
