package com.example.datn_f5_store.service.impl;

import com.example.datn_f5_store.dto.KhachHangDto;
import com.example.datn_f5_store.dto.KhuyenMaiDto;
import com.example.datn_f5_store.dto.VoucherDto;
import com.example.datn_f5_store.entity.KhachHangEntity;
import com.example.datn_f5_store.entity.KhuyenMaiEntity;
import com.example.datn_f5_store.entity.VoucherEntity;
import com.example.datn_f5_store.exceptions.DataNotFoundException;
import com.example.datn_f5_store.repository.IKhachHangRepository;
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

import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

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
    public DataResponse createVoucher(VoucherRequest voucher) {
        // Lấy thời gian hiện tại bao gồm cả ngày, giờ, phút
        LocalDateTime currentDateTime = LocalDateTime.now(ZoneId.systemDefault());

        VoucherEntity voucher1 = new VoucherEntity();
        try {
            if (CheckVoucher(voucher)) {
                // Kiểm tra trùng mã voucher
                if (checkTrungMaVoucher(voucher.getMa())) {
                    // Kiểm tra điều kiện cho giảm giá
                    if (voucher.getKieuGiamGia().equalsIgnoreCase("%") && voucher.getGiaTriVoucher() > 99) {
                        return new DataResponse(false, new ResultModel<>(null, "Giá trị giảm % chỉ được tối đa là 99"));
                    }
                    if (voucher.getThoiGianBatDau() == null) {
                        return new DataResponse(false, new ResultModel<>(null, "Thời gian Bắt đầu không được để trống"));
                    }
                    if (voucher.getThoiGianKetThuc() == null) {
                        return new DataResponse(false, new ResultModel<>(null, "Thời gian Kết thúc không được để trống"));
                    }
                    if (voucher.getThoiGianBatDau().isAfter(voucher.getThoiGianKetThuc())) {
                        return new DataResponse(false, new ResultModel<>(null, "Thời gian kết thúc không được diễn ra trước Thời gian bắt đầu"));
                    }

                    // Gán giá trị cho voucher
                    voucher1.setMa(voucher.getMa());
                    voucher1.setTen(voucher.getTen());
                    voucher1.setGiaTriVoucher(voucher.getGiaTriVoucher());
                    voucher1.setGiaTriGiamToiDa(voucher.getGiaTriGiamToiDa());
                    voucher1.setKieuGiamGia(voucher.getKieuGiamGia());
                    voucher1.setThoiGianBatDau(voucher.getThoiGianBatDau()); // Giữ nguyên LocalDateTime
                    voucher1.setThoiGianKetThuc(voucher.getThoiGianKetThuc()); // Giữ nguyên LocalDateTime
                    voucher1.setGiaTriHoaDonToiThieu(voucher.getGiaTriHoaDonToiThieu());
                    voucher1.setSoLuong(voucher.getSoLuong());
                    voucher1.setNguoiTao("ADMIN");
                    voucher1.setThoiGianTao(Timestamp.valueOf(currentDateTime)); // Lấy thời gian hiện tại
                    voucher1.setMoTa(voucher.getMoTa());

                    // Kiểm tra trạng thái của voucher
                    if (voucher1.getThoiGianKetThuc().isBefore(currentDateTime)) {
                        voucher1.setTrangThai("Đã kết thúc");
                    } else if (voucher1.getThoiGianBatDau().isBefore(currentDateTime) && voucher1.getThoiGianKetThuc().isAfter(currentDateTime)) {
                        voucher1.setTrangThai("Đang diễn ra");
                    } else {
                        voucher1.setTrangThai("Sắp diễn ra");
                    }

                    // Lưu voucher vào cơ sở dữ liệu
                    iVoucherRepository.save(voucher1);
                    return new DataResponse(true, new ResultModel<>(null, "Thêm Voucher thành công"));
                }
                return new DataResponse(false, new ResultModel<>(null, "Mã Voucher đã tồn tại"));
            }
            return new DataResponse(false, new ResultModel<>(null, "Các trường dữ liệu không được để trống hoặc giá trị phải > 0"));
        } catch (Exception e) {
            return new DataResponse(false, new ResultModel<>(null, "Thêm thất bại do lỗi: " + e));
        }
    }



    // hàm Update Voucher theo id
    @Override
    public DataResponse updateVoucher(Integer id, VoucherRequest voucher) throws DataNotFoundException {
        LocalDateTime currentDateTime = LocalDateTime.now(ZoneId.systemDefault());
        VoucherEntity voucher1 = iVoucherRepository.findById(id).orElseThrow(() ->
                new DataNotFoundException("Không thể sửa Voucher với id : " + id));

        try {
            if (CheckVoucher(voucher)) {
                if (voucher.getKieuGiamGia().equalsIgnoreCase("%") && voucher.getGiaTriVoucher() > 99) {
                    return new DataResponse(false, new ResultModel<>(null, "Giá trị giảm % chỉ được tối đa là 99"));
                }

                LocalDateTime thoiGianBatDau = voucher.getThoiGianBatDau();
                LocalDateTime thoiGianKetThuc = voucher.getThoiGianKetThuc();

                if (thoiGianBatDau == null) {
                    return new DataResponse(false, new ResultModel<>(null, "Thời gian Bắt đầu không được để trống"));
                }
                if (thoiGianKetThuc == null) {
                    return new DataResponse(false, new ResultModel<>(null, "Thời gian Kết thúc không được để trống"));
                }
                if (thoiGianBatDau.isAfter(thoiGianKetThuc)) {
                    return new DataResponse(false, new ResultModel<>(null, "Thời gian kết thúc không được diễn ra trước thời gian bắt đầu"));
                }

                // Update voucher properties
                voucher1.setTen(voucher.getTen());
                voucher1.setGiaTriVoucher(voucher.getGiaTriVoucher());
                voucher1.setGiaTriGiamToiDa(voucher.getGiaTriGiamToiDa());
                voucher1.setKieuGiamGia(voucher.getKieuGiamGia());
                voucher1.setThoiGianBatDau(thoiGianBatDau);
                voucher1.setThoiGianKetThuc(thoiGianKetThuc);
                voucher1.setGiaTriHoaDonToiThieu(voucher.getGiaTriHoaDonToiThieu());
                voucher1.setSoLuong(voucher.getSoLuong());
                voucher1.setThoiGianSua(Date.from(currentDateTime.atZone(ZoneId.systemDefault()).toInstant()));
                voucher1.setNguoiSua("ADMIN");
                voucher1.setMoTa(voucher.getMoTa());

                // Check status based on date and time
                if (thoiGianKetThuc.isBefore(currentDateTime)) {
                    voucher1.setTrangThai("Đã kết thúc");
                } else if (thoiGianBatDau.isBefore(currentDateTime) && thoiGianKetThuc.isAfter(currentDateTime)) {
                    voucher1.setTrangThai("Đang diễn ra");
                } else {
                    voucher1.setTrangThai("Sắp diễn ra");
                }

                iVoucherRepository.save(voucher1);
                return new DataResponse(true, new ResultModel<>(null, "Sửa Voucher thành công"));
            }
            return new DataResponse(false, new ResultModel<>(null, "Các trường dữ liệu không được để trống hoặc giá trị phải > 0"));
        } catch (Exception e) {
            return new DataResponse(false, new ResultModel<>(null, "Sửa thất bại do lỗi : " + e.getMessage()));
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
    public DataResponse CapNhapTrangThaiVoucher(Integer id){
        // Lấy thời gian hiện tại
        LocalDateTime currentDateTime = LocalDateTime.now(ZoneId.systemDefault());

        // Tìm khuyến mãi theo ID
        VoucherEntity khuyenMai = iVoucherRepository.findById(id).get();

        LocalDateTime thoiGianBatDau = khuyenMai.getThoiGianBatDau();
        LocalDateTime thoiGianKetThuc = khuyenMai.getThoiGianKetThuc();

        if (khuyenMai.getTrangThai().trim().equalsIgnoreCase("Đang diễn ra") ||
                khuyenMai.getTrangThai().equalsIgnoreCase("Sắp diễn ra")) {
            khuyenMai.setTrangThai("Đã kết thúc");
            iVoucherRepository.save(khuyenMai);
            return new DataResponse(true, new ResultModel<>(null, "Đổi trạng thái Voucher thành Đã kết thúc thành công" ));
        }

        if (khuyenMai.getTrangThai().trim().equalsIgnoreCase("Đã kết thúc")) {
            if (thoiGianKetThuc.isBefore(currentDateTime)) {
                return new DataResponse(false, new ResultModel<>(null, "Voucher đã kết thúc,Không thể đổi trạng thái " ));
            } else if (thoiGianBatDau.isEqual(currentDateTime)) {
                khuyenMai.setTrangThai("Đang diễn ra");
                iVoucherRepository.save(khuyenMai);
                return new DataResponse(true, new ResultModel<>(null, "Đổi trạng thái thành công Voucher thành Đang diễn ra" ));
            } else if (thoiGianBatDau.isBefore(currentDateTime) && thoiGianKetThuc.isAfter(currentDateTime)) {
                khuyenMai.setTrangThai("Đang diễn ra");
                iVoucherRepository.save(khuyenMai);
                return new DataResponse(true, new ResultModel<>(null, "Đổi trạng thái thành công Voucher Đang diễn ra" ));
            } else {
                khuyenMai.setTrangThai("Sắp diễn ra");
                iVoucherRepository.save(khuyenMai);
                return new DataResponse(true, new ResultModel<>(null, "Đổi trạng thái thành công Voucher Sắp diễn ra" ));
            }
        }
        return new DataResponse(false, new ResultModel<>(null, "Lỗi khi đổi trạng thái" ));
    }



    // hàm check trùng mã Voucher
    @Override
    public boolean checkTrungMaVoucher(String ma) {
        if (iVoucherRepository.existsByMa(ma)) {
            return false;
        }
        return true;
    }


    //hàm tự động câp nhập trạng thái Voucher khi đã kết thúc
    @Override
    @Scheduled(cron = "0 0 12 * * ?")
    public void CapNhapTrangThaiVoucherDhh() {
        try {
            // Lấy thời gian hiện tại với cả ngày, giờ và phút
            LocalDateTime currentDateTime = LocalDateTime.now(ZoneId.systemDefault());

            List<VoucherEntity> vouchers = iVoucherRepository.findAll();
            for (VoucherEntity voucher : vouchers) {

                LocalDateTime thoiGianBatDau = voucher.getThoiGianBatDau() ;
                LocalDateTime thoiGianKetThuc = voucher.getThoiGianKetThuc() ;

                if (thoiGianKetThuc != null && thoiGianKetThuc.isBefore(currentDateTime)) {
                    voucher.setTrangThai("Đã kết thúc");
                    iVoucherRepository.save(voucher);
                }
                if (voucher.getSoLuong() == 0) {
                    voucher.setTrangThai("Đã hết");
                    iVoucherRepository.save(voucher);
                }

                if (thoiGianBatDau != null && thoiGianKetThuc != null
                        && !thoiGianBatDau.isAfter(currentDateTime)
                        && !thoiGianKetThuc.isBefore(currentDateTime)
                        && voucher.getTrangThai().trim().equalsIgnoreCase("Sắp diễn ra")) {
                    voucher.setTrangThai("Đang diễn ra");
                    iVoucherRepository.save(voucher);
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }



    @Override
    public Page<VoucherDto> findVoucherByDate(int page, int size, LocalDateTime ngayBatDau, LocalDateTime ngayKetThuc) {
        Pageable pageable = PageRequest.of(page, size);
        Page<VoucherEntity> voucherEntities;

        // Chuyển đổi Date sang LocalDateTime để giữ giờ và phút
        LocalDateTime startDateTime = ngayBatDau;
        LocalDateTime endDateTime = ngayKetThuc ;

        // Nếu cả Ngày bắt đầu và Ngày kết thúc đều null, thì tìm tất cả khuyến mãi
        if (startDateTime == null && endDateTime == null) {
            voucherEntities = iVoucherRepository.findAll(pageable);
        } else if (startDateTime != null && endDateTime != null) {
            // Nếu cả hai không null, tìm khuyến mãi theo khoảng thời gian
            voucherEntities = iVoucherRepository
                    .findAllByThoiGianBatDauGreaterThanEqualAndThoiGianKetThucLessThanEqual(
                          ngayBatDau,
                            ngayKetThuc,
                            pageable);
        } else if (startDateTime != null) {
            // Nếu chỉ có Ngày bắt đầu, tìm khuyến mãi bắt đầu từ ngày đó trở đi
            voucherEntities = iVoucherRepository
                    .findAllByThoiGianBatDauGreaterThanEqual(ngayBatDau, pageable);
        } else {
            // Nếu chỉ có Ngày kết thúc, tìm khuyến mãi kết thúc trước hoặc bằng ngày đó
            voucherEntities = iVoucherRepository
                    .findAllByThoiGianKetThucLessThanEqual(ngayKetThuc, pageable);
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
    @Override
    public List<VoucherDto> getTrangThai() {
        List<VoucherEntity> voucherEntities = iVoucherRepository.getByTrangThai("Đang diễn ra");
        return voucherEntities.stream()
                .map(entity->new VoucherDto(
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
                )).collect(Collectors.toList());
    }


}
