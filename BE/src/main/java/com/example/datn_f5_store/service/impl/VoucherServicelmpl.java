package com.example.datn_f5_store.service.impl;

import com.example.datn_f5_store.dto.KhuyenMaiDto;
import com.example.datn_f5_store.dto.VoucherDto;
import com.example.datn_f5_store.entity.KhuyenMaiEntity;
import com.example.datn_f5_store.entity.VoucherEntity;
import com.example.datn_f5_store.exceptions.DataNotFoundException;
import com.example.datn_f5_store.repository.IVoucherRepository;
import com.example.datn_f5_store.request.VoucherRequest;
import com.example.datn_f5_store.service.VoucherService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import com.example.datn_f5_store.response.DataResponse;
import com.example.datn_f5_store.response.ResultModel;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Date;
import java.util.List;

import static org.apache.logging.log4j.ThreadContext.isEmpty;

@Service
public class VoucherServicelmpl implements VoucherService {
    @Autowired
    private  IVoucherRepository iVoucherRepository;


    // hàm Find all VouCher
    @Override
    public Page<VoucherDto> getAll(int page, int size) {
        Pageable pageable = PageRequest.of(page,size);
        Page<VoucherEntity> voucher = iVoucherRepository.findAll(pageable);

        Page<VoucherDto> voucherDtos = voucher.map(entity -> new VoucherDto(
                entity.getId(),
                entity.getMa(),
                entity.getTen(),
                entity.getGiaTriVoucher(),
                entity.getKieuGiamGia(),
                entity.getGiaTriGiamToiDa(),
                entity.getGiaTriHoaDonToiThieu(),
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
    public DataResponse createVoucher(VoucherRequest voucher){
        Date ngayHienTai = new Date();
        LocalDate currentDate = ngayHienTai.toInstant().atZone(ZoneId.systemDefault()).toLocalDate();

        VoucherEntity voucher1 = new VoucherEntity();
        try {
            if (CheckVoucher(voucher)) {
                if (checkTrungMaVoucher(voucher.getMa())) {
                    if(voucher.getKieuGiamGia().equalsIgnoreCase("%") && voucher.getGiaTriVoucher() > 99){
                        return new DataResponse(false, new ResultModel<>(null, "Giá trị giảm % chỉ được tối đa là 99"));
                    }
                    if (voucher.getThoiGianBatDau().after(voucher.getThoiGianKetThuc())) {
                        return new DataResponse(false, new ResultModel<>(null, "Thời gian kết thúc không được diễn ra trước Thời gian bắt đầu"));
                    }
                    voucher1.setMa(voucher.getMa());
                    voucher1.setTen(voucher.getTen());
                    voucher1.setGiaTriVoucher(voucher.getGiaTriVoucher());
                    voucher1.setGiaTriGiamToiDa(voucher.getGiaTriGiamToiDa());
                    voucher1.setKieuGiamGia(voucher.getKieuGiamGia());
                    voucher1.setThoiGianBatDau(voucher.getThoiGianBatDau());
                    voucher1.setThoiGianKetThuc(voucher.getThoiGianKetThuc());
                    voucher1.setGiaTriHoaDonToiThieu(voucher.getGiaTriHoaDonToiThieu());
                    voucher1.setSoLuong(voucher.getSoLuong());
                    voucher1.setNguoiTao("ADMIN");
                    voucher1.setThoiGianTao(ngayHienTai);
                    voucher1.setMoTa(voucher.getMoTa());
                    LocalDate thoiGianBatDau = voucher.getThoiGianBatDau().toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
                    LocalDate thoiGianKetThuc = voucher.getThoiGianKetThuc().toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
                    if (thoiGianKetThuc.isBefore(currentDate)) {
                        voucher1.setTrangThai("Đã hết hạn");
                    } else if (thoiGianBatDau.isEqual(currentDate)) {
                        voucher1.setTrangThai("Đang diễn ra");
                    } else if (thoiGianBatDau.isBefore(currentDate) && thoiGianKetThuc.isAfter(currentDate)) {
                        voucher1.setTrangThai("Đang diễn ra");
                    } else {
                        voucher1.setTrangThai("Sắp diễn ra");
                    }
                    iVoucherRepository.save(voucher1);
                    return new DataResponse(true, new ResultModel<>(null, "Thêm Voucher thành công"));
                }
                return new DataResponse(false, new ResultModel<>(null, "Mã Voucher đã tồn tại"));
            }
            return new DataResponse(false, new ResultModel<>(null, "Các trường dữ liệu không được để trống hoặc giá trị phải > 0"));
        }catch (Exception e){
            return new DataResponse(false, new ResultModel<>(null, "Thêm thất bại do lỗi : " + e));
        }
    }


    // hàm Update Voucher theo id
    @Override
    public DataResponse updateVoucher(Integer id, VoucherRequest voucher) throws DataNotFoundException {
        Date ngayHienTai = new Date();
        VoucherEntity voucher1 = iVoucherRepository.findById(id).orElseThrow(()
                -> new DataNotFoundException("Không thể sửa Voucher với id : "+ voucher.getId()));
        try {
            if (voucher1 != null) {
                if (CheckVoucher(voucher)) {
                    if(voucher.getKieuGiamGia().equalsIgnoreCase("%") && voucher.getGiaTriVoucher() > 99){
                        return new DataResponse(false, new ResultModel<>(null, "Giá trị giảm % chỉ được tối đa là 99"));
                    } if (voucher.getThoiGianBatDau().after(voucher.getThoiGianKetThuc())) {
                        return new DataResponse(false, new ResultModel<>(null, "Thời gian kết thúc không được diễn ra trước thời gian bắt đầu"));
                    }

                    voucher1.setMa(voucher.getMa());
                    voucher1.setTen(voucher.getTen());
                    voucher1.setGiaTriVoucher(voucher.getGiaTriVoucher());
                    voucher1.setGiaTriGiamToiDa(voucher.getGiaTriGiamToiDa());
                    voucher1.setKieuGiamGia(voucher.getKieuGiamGia());
                    voucher1.setThoiGianBatDau(voucher.getThoiGianBatDau());
                    voucher1.setThoiGianKetThuc(voucher.getThoiGianKetThuc());
                    voucher1.setGiaTriHoaDonToiThieu(voucher.getGiaTriHoaDonToiThieu());
                    voucher1.setSoLuong(voucher.getSoLuong());
                    voucher1.setThoiGianSua(ngayHienTai);
                    voucher1.setNguoiSua("ADMIN");
                    voucher1.setMoTa(voucher.getMoTa());
                    voucher1.setTrangThai(voucher.getTrangThai());
                    iVoucherRepository.save(voucher1);
                    return new DataResponse(true, new ResultModel<>(null, "Sửa Voucher thành công"));
                }
                return new DataResponse(false, new ResultModel<>(null, "Các trường dữ liệu không được bỏ trống hoặc giá trị phải > 0"));
            }
            return new DataResponse(false, new ResultModel<>(null, "Không tìm thay voucher với id là : "+ id));
        }catch (Exception e){
            return new DataResponse(false, new ResultModel<>(null, "Sửa voucher thất bại với lỗi : "+ e));
        }
    }

    // hàm find Voucher theo id
    @Override
    public VoucherEntity finById(Integer id) throws DataNotFoundException {
        return iVoucherRepository.findById(id).orElseThrow(()
                -> new DataNotFoundException("Không thể Tìm Voucher với id : "+ id));
    }

    // hàm cập nhập trạng thái Voucher
    @Override
    public Boolean CapNhapTrangThaiVoucher(Integer id) throws DataNotFoundException{
        Date ngayHienTai = new Date();
        LocalDate currentDate = ngayHienTai.toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
        VoucherEntity voucher1 = iVoucherRepository.findById(id).orElseThrow(
                () -> new DataNotFoundException("Không thể cập nhập trạng thái với id : "+ id)
        );
        LocalDate thoiGianBatDau = voucher1.getThoiGianBatDau().toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
        LocalDate thoiGianKetThuc = voucher1.getThoiGianKetThuc().toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
        if (voucher1.getTrangThai().trim().equalsIgnoreCase("Đang diễn ra") || voucher1.getTrangThai().equalsIgnoreCase("Sắp diễn ra")){
            voucher1.setTrangThai("Không hoạt động");
            iVoucherRepository.save(voucher1);
            return true;
        }
        if (voucher1.getTrangThai().trim().equalsIgnoreCase("Không hoạt động")){
            if (thoiGianKetThuc.isBefore(currentDate)) {
                voucher1.setTrangThai("Đã hết hạn");
            } else if (thoiGianBatDau.isEqual(currentDate)) {
                voucher1.setTrangThai("Đang diễn ra");
            } else if (thoiGianBatDau.isBefore(currentDate) && thoiGianKetThuc.isAfter(currentDate)) {
                voucher1.setTrangThai("Đang diễn ra");
            } else {
                voucher1.setTrangThai("Sắp diễn ra");
            }
            iVoucherRepository.save(voucher1);
            return true;
        }
       return false;
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
            List<VoucherEntity> vouchers = iVoucherRepository.findAll();
            for (VoucherEntity voucher : vouchers) {
                if (voucher.getThoiGianKetThuc() != null && voucher.getThoiGianKetThuc().before(currentDate)) {
                    voucher.setTrangThai("Đã hết hạn");
                    iVoucherRepository.save(voucher);
                }if (voucher.getSoLuong() == 0) {
                    voucher.setTrangThai("Không hoạt động");
                    iVoucherRepository.save(voucher);
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }


    @Override
    public Page<VoucherDto> findVoucherByDate(int page, int size, Date ngayBatDau, Date ngayKetThuc) {
        Pageable pageable = PageRequest.of(page, size);
        Page<VoucherEntity> voucherEntities;

        // Chuyển đổi Date sang LocalDate
        LocalDate startDate = ngayBatDau != null ? ngayBatDau.toInstant().atZone(ZoneId.systemDefault()).toLocalDate() : null;
        LocalDate endDate = ngayKetThuc != null ? ngayKetThuc.toInstant().atZone(ZoneId.systemDefault()).toLocalDate() : null;

        if (startDate == null && endDate == null) {
            // Nếu ngày bắt đầu và ngày kết thúc đều null, thì tìm tất cả Voucher
            voucherEntities = iVoucherRepository.findAll(pageable);
        } else if (startDate != null && endDate != null) {
            // Nếu cả hai không null, tìm Voucher theo khoảng thời gian
            voucherEntities = iVoucherRepository
                    .findAllByThoiGianBatDauGreaterThanEqualAndThoiGianKetThucLessThanEqual(
                            Date.from(startDate.atStartOfDay(ZoneId.systemDefault()).toInstant()),
                            Date.from(endDate.atStartOfDay(ZoneId.systemDefault()).toInstant()),
                            pageable);
        } else if (startDate != null) {
            // Nếu chỉ có Ngày bắt đầu , tìm Voucher bắt đầu từ ngày đó trở đi
            voucherEntities = iVoucherRepository
                    .findAllByThoiGianBatDauGreaterThanEqual(Date.from(startDate.atStartOfDay(ZoneId.systemDefault()).toInstant()), pageable);
        } else {
            // Nếu chỉ có Ngày kết thúc, tìm voucher kết thúc trước hoặc bằng ngày đó
            voucherEntities = iVoucherRepository
                    .findAllByThoiGianKetThucLessThanEqual(Date.from(endDate.atStartOfDay(ZoneId.systemDefault()).toInstant()), pageable);
        }
        return voucherEntities.map(entity -> new VoucherDto(
                entity.getId(),
                entity.getMa(),
                entity.getTen(),
                entity.getGiaTriVoucher(),
                entity.getKieuGiamGia(),
                entity.getGiaTriGiamToiDa(),
                entity.getGiaTriHoaDonToiThieu(),
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
    }

    @Override
    public Page<VoucherDto> findByTenOrMa(int page, int size, String tim) {
        Pageable pageable = PageRequest.of(page, size);
        Page<VoucherEntity> voucherEntities;

        if (tim == null || tim.trim().isEmpty()) {
            voucherEntities = iVoucherRepository.findAll(pageable);
        } else {
            voucherEntities = iVoucherRepository.getByTenContainingOrMaContaining(tim, tim, pageable);
        }
        return voucherEntities.map(entity -> new VoucherDto(
                entity.getId(),
                entity.getMa(),
                entity.getTen(),
                entity.getGiaTriVoucher(),
                entity.getKieuGiamGia(),
                entity.getGiaTriGiamToiDa(),
                entity.getGiaTriHoaDonToiThieu(),
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
    }


    // hàm validate VoucherRequest
    public Boolean CheckVoucher(VoucherRequest voucherRequest) {
        if (voucherRequest.getMa() == null || voucherRequest.getMa().trim().isEmpty()) {
            return false;
        }
        if (voucherRequest.getTen() == null || voucherRequest.getTen().trim().isEmpty()) {
            return false;
        }
        if (voucherRequest.getGiaTriVoucher() == null || voucherRequest.getGiaTriVoucher() <= 0) {
            return false;
        }
        if (voucherRequest.getGiaTriGiamToiDa() == null || voucherRequest.getGiaTriGiamToiDa() <= 0) {
            return false;
        }
        if (voucherRequest.getGiaTriHoaDonToiThieu() == null || voucherRequest.getGiaTriHoaDonToiThieu() <= 0) {
            return false;
        }
        if (voucherRequest.getKieuGiamGia() == null || voucherRequest.getKieuGiamGia().trim().isEmpty()) {
            return false;
        }
        if (voucherRequest.getThoiGianBatDau() == null) {
            return false;
        }
        if (voucherRequest.getThoiGianKetThuc() == null) {
            return false;
        }
        if (voucherRequest.getSoLuong() == null || voucherRequest.getSoLuong() <= 0) {
            return false;
        }
        return true;
    }



    @Override
    public Page<VoucherDto> findByTrangThai(int page, int size, String trangThai) {
        Pageable pageable = PageRequest.of(page, size);
        Page<VoucherEntity> VoucherEntity;

        if (trangThai == null || trangThai.trim().isEmpty()) {
            VoucherEntity = iVoucherRepository.findAll(pageable);
        } else {
            VoucherEntity = iVoucherRepository.findByTrangThai(trangThai, pageable);
        }
        return VoucherEntity.map(entity -> new VoucherDto(
                entity.getId(),
                entity.getMa(),
                entity.getTen(),
                entity.getGiaTriVoucher(),
                entity.getKieuGiamGia(),
                entity.getGiaTriGiamToiDa(),
                entity.getGiaTriHoaDonToiThieu(),
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
    }


}
