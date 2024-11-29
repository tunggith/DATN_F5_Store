package com.example.datn_f5_store.service.impl;

import com.example.datn_f5_store.dto.KhuyenMaiDto;
import com.example.datn_f5_store.entity.KhuyenMaiEntity;
import com.example.datn_f5_store.repository.IKhuyenMaiRepository;
import com.example.datn_f5_store.request.KhuyenMaiRequest;
import com.example.datn_f5_store.response.DataResponse;
import com.example.datn_f5_store.response.DataResponse2;
import com.example.datn_f5_store.response.ResultModel2;
import com.example.datn_f5_store.service.KhuyenMaiService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import  com.example.datn_f5_store.response.ResultModel;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class KhuyenMaiImpl implements KhuyenMaiService {

    @Autowired
    private IKhuyenMaiRepository khuyenMaiRepository;

    // Hàm để lấy tất cả các Khuyến mãi đang có và thực hiện phân trang
    @Override
    public Page<KhuyenMaiDto> getAll(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "thoiGianTao"));
        Page<KhuyenMaiEntity> khuyenMaiEntities = khuyenMaiRepository.findAll(pageable);

        Page<KhuyenMaiDto> khuyenMaiDtos = khuyenMaiEntities.map(entity -> new KhuyenMaiDto(
                entity.getId(),
                entity.getMa(),
                entity.getTen(),
                entity.getKieuKhuyenMai(),
                entity.getMoTa(),
                entity.getSoLuong(),
                entity.getGiaTriKhuyenMai(),
                entity.getThoiGianBatDau(),
                entity.getThoiGianKetThuc(),
                entity.getThoiGianTao(),
                entity.getThoiGianSua(),
                entity.getNguoiSua(),
                entity.getNguoiTao(),
                entity.getTrangThai()
        ));
        return khuyenMaiDtos;
    }


    // hàm find theo tên Khuyến mãi hoặc mã Khuyến mãi và thực hiện phân trang
    @Override
    public Page<KhuyenMaiDto> findByTenOrMa(int page, int size, String tim) {
        Pageable pageable = PageRequest.of(page, size);
        Page<KhuyenMaiEntity> khuyenMaiEntities;

        if (tim == null || tim.trim().isEmpty()) {
            khuyenMaiEntities = khuyenMaiRepository.findAll(pageable);
        } else {
            khuyenMaiEntities = khuyenMaiRepository.getByTenContainingOrMaContaining(tim, tim, pageable);
        }

        return khuyenMaiEntities.map(entity -> new KhuyenMaiDto(
                entity.getId(),
                entity.getMa(),
                entity.getTen(),
                entity.getKieuKhuyenMai(),
                entity.getMoTa(),
                entity.getSoLuong(),
                entity.getGiaTriKhuyenMai(),
                entity.getThoiGianBatDau(),
                entity.getThoiGianKetThuc(),
                entity.getThoiGianTao(),
                entity.getThoiGianSua(),
                entity.getNguoiSua(),
                entity.getNguoiTao(),
                entity.getTrangThai()
        ));
    }

    @Override
    public Page<KhuyenMaiDto> findByTrangThai(int page, int size, String trangThai) {
        Pageable pageable = PageRequest.of(page, size);
        Page<KhuyenMaiEntity> khuyenMaiEntities;

        if (trangThai == null || trangThai.trim().isEmpty()) {
            khuyenMaiEntities = khuyenMaiRepository.findAll(pageable);
        } else {
            khuyenMaiEntities = khuyenMaiRepository.findByTrangThai(trangThai, pageable);
        }
        return khuyenMaiEntities.map(entity -> new KhuyenMaiDto(
                entity.getId(),
                entity.getMa(),
                entity.getTen(),
                entity.getKieuKhuyenMai(),
                entity.getMoTa(),
                entity.getSoLuong(),
                entity.getGiaTriKhuyenMai(),
                entity.getThoiGianBatDau(),
                entity.getThoiGianKetThuc(),
                entity.getThoiGianTao(),
                entity.getThoiGianSua(),
                entity.getNguoiSua(),
                entity.getNguoiTao(),
                entity.getTrangThai()
        ));
    }



    @Override
    public DataResponse2 create(KhuyenMaiRequest khuyenMaiRequest) {
        LocalDateTime currentDateTime = LocalDateTime.now(ZoneId.of("UTC")); // Lấy thời gian hiện tại theo UTC
        KhuyenMaiEntity khuyenMaiEntity = new KhuyenMaiEntity();
        try {
            if (checkKhuyenMai(khuyenMaiRequest)) {
                if (!checkTrungMaKhuyenmai(khuyenMaiRequest.getMa())) {
                    String ma = khuyenMaiRequest.getMa();
                    if (ma == null || ma.isEmpty()) {
                        return new DataResponse2(false, new ResultModel2<>( "Mã không được để trống",null));
                    }
                    if (khuyenMaiRequest.getKieuKhuyenMai().equalsIgnoreCase("%") && khuyenMaiRequest.getGiaTriKhuyenMai() > 100) {
                        return new DataResponse2(false, new ResultModel2<>( "Giá trị khuyến mãi không được vượt quá 100 khi kiểu khuyến mãi là %.",null));
                    }
                    if (khuyenMaiRequest.getThoiGianBatDau().isAfter(khuyenMaiRequest.getThoiGianKetThuc())) {
                        return new DataResponse2(false, new ResultModel2<>( "Thời gian kết thúc không được diễn ra trước thời gian bắt đầu",null));
                    }

                    khuyenMaiEntity.setMa(ma);
                    khuyenMaiEntity.setTen(khuyenMaiRequest.getTen());
                    khuyenMaiEntity.setKieuKhuyenMai(khuyenMaiRequest.getKieuKhuyenMai());
                    khuyenMaiEntity.setMoTa(khuyenMaiRequest.getMoTa());
                    khuyenMaiEntity.setSoLuong(khuyenMaiRequest.getSoLuong());
                    khuyenMaiEntity.setGiaTriKhuyenMai(khuyenMaiRequest.getGiaTriKhuyenMai());

                    // Chuyển đổi thời gian bắt đầu và kết thúc sang UTC trước khi lưu
                    LocalDateTime thoiGianBatDauUTC = khuyenMaiRequest.getThoiGianBatDau();


                    LocalDateTime thoiGianKetThucUTC = khuyenMaiRequest.getThoiGianKetThuc();


                    khuyenMaiEntity.setThoiGianBatDau(thoiGianBatDauUTC);
                    khuyenMaiEntity.setThoiGianKetThuc(thoiGianKetThucUTC);
                    khuyenMaiEntity.setThoiGianTao(Timestamp.valueOf(currentDateTime)); // Lưu theo UTC
                    khuyenMaiEntity.setNguoiTao("ADMIN");

                    // Kiểm tra trạng thái
                    if (thoiGianKetThucUTC.isBefore(currentDateTime)) {
                        khuyenMaiEntity.setTrangThai("Đã kết thúc");
                    } else if (thoiGianBatDauUTC.isEqual(currentDateTime) || (thoiGianBatDauUTC.isBefore(currentDateTime) && thoiGianKetThucUTC.isAfter(currentDateTime))) {
                        khuyenMaiEntity.setTrangThai("Đang diễn ra");
                    } else {
                        khuyenMaiEntity.setTrangThai("Sắp diễn ra");
                    }


                     khuyenMaiRepository.save(khuyenMaiEntity);


                    return new DataResponse2(true, new ResultModel2<>("Thêm Khuyến mãi thành công",khuyenMaiEntity.getId()));


                } else {
                    return new DataResponse2(false, new ResultModel2<>( "Mã Khuyến mãi đã tồn tại!",null));
                }
            }
            return new DataResponse2(false, new ResultModel2<>("Các trường dữ liệu không được để trống hoặc < 0, Vui lòng kiểm tra lại",null));
        } catch (Exception e) {
            return new DataResponse2(false, new ResultModel2<>( "Đã xảy ra lỗi: " + e.getMessage(),null));
        }
    }






    // hàm cập nhập Khuyến mãi theo id
    @Override
    public DataResponse update(KhuyenMaiRequest khuyenMaiRequest, Integer id) {
        LocalDateTime currentDateTime = LocalDateTime.now(ZoneId.systemDefault());
        KhuyenMaiEntity khuyenmai = khuyenMaiRepository.findById(id).get();

        try {
            if (checkKhuyenMai(khuyenMaiRequest)) {
                if (khuyenMaiRequest.getKieuKhuyenMai().equalsIgnoreCase("%") && khuyenMaiRequest.getGiaTriKhuyenMai() > 100) {
                    return new DataResponse(false, new ResultModel<>(null, "Giá trị giảm % chỉ được tối đa là 100"));
                }

                LocalDateTime thoiGianBatDau = khuyenMaiRequest.getThoiGianBatDau();
                LocalDateTime thoiGianKetThuc = khuyenMaiRequest.getThoiGianKetThuc();

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
                khuyenmai.setTen(khuyenMaiRequest.getTen());
                khuyenmai.setGiaTriKhuyenMai(khuyenMaiRequest.getGiaTriKhuyenMai());
                khuyenmai.setKieuKhuyenMai(khuyenMaiRequest.getKieuKhuyenMai());
                khuyenmai.setThoiGianBatDau(thoiGianBatDau);
                khuyenmai.setThoiGianKetThuc(thoiGianKetThuc);
                khuyenmai.setSoLuong(khuyenMaiRequest.getSoLuong());
                khuyenmai.setThoiGianSua(Date.from(currentDateTime.atZone(ZoneId.systemDefault()).toInstant()));
                khuyenmai.setNguoiSua("ADMIN");
                khuyenmai.setMoTa(khuyenMaiRequest.getMoTa());

                // Check status based on date and time
                if (thoiGianKetThuc.isBefore(currentDateTime)) {
                    khuyenmai.setTrangThai("Đã kết thúc");
                } else if (thoiGianBatDau.isBefore(currentDateTime) && thoiGianKetThuc.isAfter(currentDateTime)) {
                    khuyenmai.setTrangThai("Đang diễn ra");
                } else {
                    khuyenmai.setTrangThai("Sắp diễn ra");
                }

                khuyenMaiRepository.save(khuyenmai);
                return new DataResponse(true, new ResultModel<>(null, "Sửa Khuyến mãi thành công"));
            }
            return new DataResponse(false, new ResultModel<>(null, "Các trường dữ liệu không được để trống hoặc giá trị phải > 0"));
        } catch (Exception e) {
            return new DataResponse(false, new ResultModel<>(null, "Sửa thất bại do lỗi : " + e.getMessage()));
        }
    }




    // Hàm lấy thông tin Khuyến mãi theo id
    @Override
    public KhuyenMaiEntity findById(Integer id) {
        Optional<KhuyenMaiEntity> khuyenMaiOptional = khuyenMaiRepository.findById(id);
        if (khuyenMaiOptional.isPresent()) {
            return khuyenMaiOptional.get();
        } else {
            // Xử lý khi không tìm thấy khuyến mãi
            throw new EntityNotFoundException("Không tìm thấy khuyến mãi với ID: " + id);
        }
    }



    // hàm lọc khuyến mãi theo Ngày
    @Override
    public Page<KhuyenMaiDto> findKhuyenMaiByDate(int page, int size, LocalDateTime ngayBatDau, LocalDateTime ngayKetThuc) {
        Pageable pageable = PageRequest.of(page, size);
        Page<KhuyenMaiEntity> khuyenMaiEntities;

        if (ngayBatDau == null && ngayKetThuc == null) {
            khuyenMaiEntities = khuyenMaiRepository.findAll(pageable);
        } else if (ngayBatDau != null && ngayKetThuc != null) {
            khuyenMaiEntities = khuyenMaiRepository
                    .findAllByThoiGianBatDauGreaterThanEqualAndThoiGianKetThucLessThanEqual(ngayBatDau, ngayKetThuc, pageable);
        } else if (ngayBatDau != null) {
            khuyenMaiEntities = khuyenMaiRepository
                    .findAllByThoiGianBatDauGreaterThanEqual(ngayBatDau, pageable);
        } else {
            khuyenMaiEntities = khuyenMaiRepository
                    .findAllByThoiGianKetThucLessThanEqual(ngayKetThuc, pageable);
        }

        return khuyenMaiEntities.map(entity -> new KhuyenMaiDto(
                entity.getId(),
                entity.getMa(),
                entity.getTen(),
                entity.getKieuKhuyenMai(),
                entity.getMoTa(),
                entity.getSoLuong(),
                entity.getGiaTriKhuyenMai(),
                entity.getThoiGianBatDau(),
                entity.getThoiGianKetThuc(),
                entity.getThoiGianTao(),
                entity.getThoiGianSua(),
                entity.getNguoiSua(),
                entity.getNguoiTao(),
                entity.getTrangThai()
        ));
    }



    // hàm check trùng mã Khuyến mãi
    public boolean checkTrungMaKhuyenmai(String ma) {
        KhuyenMaiEntity existingKhuyenMai = khuyenMaiRepository.findByMa(ma);
        if (existingKhuyenMai != null) {
            return existingKhuyenMai.getMa().equals(ma);
        }
        return false;
    }


    // hàm check trống và giá trị các trường
    public boolean checkKhuyenMai(KhuyenMaiRequest khuyenMaiRequest) {
        // Kiểm tra các trường String không được để trống

        if (khuyenMaiRequest.getTen() == null || khuyenMaiRequest.getTen().trim().isEmpty()) {
            return false;
        }
        if (khuyenMaiRequest.getKieuKhuyenMai() == null || khuyenMaiRequest.getKieuKhuyenMai().trim().isEmpty()) {
            return false;
        }
        if (khuyenMaiRequest.getMoTa() == null || khuyenMaiRequest.getMoTa().trim().isEmpty()) {
            return false;
        }
        // Kiểm tra các trường số nguyên phải lớn hơn 0
        if (khuyenMaiRequest.getSoLuong() == null || khuyenMaiRequest.getSoLuong() <= 0) {
            return false;
        }
        if (khuyenMaiRequest.getGiaTriKhuyenMai() == null || khuyenMaiRequest.getGiaTriKhuyenMai() <= 0) {
            return false;
        }
                // Kiểm tra thời gian không được null
        if (khuyenMaiRequest.getThoiGianBatDau() == null) {
            return false;
        }
        if (khuyenMaiRequest.getThoiGianKetThuc() == null) {
            return false;
        }
        // Nếu tất cả các điều kiện đều được thỏa mãn, trả về true
        return true;
    }


    // hàm tự động cap nhap khuyến mãi khi Đã kết thúc
    @Override
    @Scheduled(cron = "0 0 12 * * ?")
    public void CapNhapTrangThaiKhuyenMaiDhh() {
        try {
            // Khai báo thời gian hiện tại với LocalDateTime
            LocalDateTime currentDateTime = LocalDateTime.now(ZoneId.systemDefault());
            // Lấy ra tất cả Khuyến mãi
            List<KhuyenMaiEntity> khuyenMaiEntities = khuyenMaiRepository.findAll();

            for (KhuyenMaiEntity khuyenMai : khuyenMaiEntities) {
                // Lấy thời gian bắt đầu và kết thúc từ LocalDateTime
                LocalDateTime thoiGianBatDau = khuyenMai.getThoiGianBatDau();
                LocalDateTime thoiGianKetThuc = khuyenMai.getThoiGianKetThuc();

                // Kiểm tra nếu có Khuyến mãi nào có Thời gian kết thúc nhỏ hơn so với thời gian hiện tại thì cập nhật lại trạng thái
                if (thoiGianKetThuc != null && thoiGianKetThuc.isBefore(currentDateTime)) {

                    khuyenMai.setTrangThai("Đã kết thúc");
                    khuyenMaiRepository.save(khuyenMai);
                }

                // Kiểm tra nếu Khuyến mãi đang trong khoảng thời gian hiện tại và trạng thái là "Sắp diễn ra"
                if (thoiGianBatDau != null && thoiGianKetThuc != null
                        && !thoiGianBatDau.isAfter(currentDateTime)
                        && !thoiGianKetThuc.isBefore(currentDateTime)
                        && khuyenMai.getTrangThai().trim().equalsIgnoreCase("Sắp diễn ra")) {
                    System.out.println("set đang diễn ra: " + khuyenMai.getMa());
                    khuyenMai.setTrangThai("Đang diễn ra");
                    khuyenMaiRepository.save(khuyenMai);
                }

                // Kiểm tra nếu số lượng đã hết
                if (khuyenMai.getSoLuong() == 0) {

                    khuyenMai.setTrangThai("Đã hết");
                    khuyenMaiRepository.save(khuyenMai);
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }


    @Override
    public DataResponse CapNhapTrangThaiKhuyenMai(Integer id){
        // Lấy thời gian hiện tại
        LocalDateTime currentDateTime = LocalDateTime.now(ZoneId.systemDefault());

        // Tìm khuyến mãi theo ID
        KhuyenMaiEntity khuyenMai = khuyenMaiRepository.findById(id).get();

        LocalDateTime thoiGianBatDau = khuyenMai.getThoiGianBatDau();
        LocalDateTime thoiGianKetThuc = khuyenMai.getThoiGianKetThuc();

        if (khuyenMai.getTrangThai().trim().equalsIgnoreCase("Đang diễn ra") ||
                khuyenMai.getTrangThai().equalsIgnoreCase("Sắp diễn ra")) {
            khuyenMai.setTrangThai("Đã kết thúc");
            khuyenMaiRepository.save(khuyenMai);
            return new DataResponse(true, new ResultModel<>(null, "Đổi trạng thái khuyến mãi thành Đã kết thúc" ));
        }

        if (khuyenMai.getTrangThai().trim().equalsIgnoreCase("Đã kết thúc")) {
            if (thoiGianKetThuc.isBefore(currentDateTime)) {
                return new DataResponse(false, new ResultModel<>(null, "Khuyến mãi đã kết thúc,Không thể đổi trạng thái " ));
            } else if (thoiGianBatDau.isEqual(currentDateTime)) {
                khuyenMai.setTrangThai("Đang diễn ra");
                khuyenMaiRepository.save(khuyenMai);
                return new DataResponse(true, new ResultModel<>(null, "Đổi trạng thái thành công thành Đang diễn ra" ));
            } else if (thoiGianBatDau.isBefore(currentDateTime) && thoiGianKetThuc.isAfter(currentDateTime)) {
                khuyenMai.setTrangThai("Đang diễn ra");
                khuyenMaiRepository.save(khuyenMai);
                return new DataResponse(true, new ResultModel<>(null, "Đổi trạng thái thành công Đang diễn ra" ));
            } else {
                khuyenMai.setTrangThai("Sắp diễn ra");
                khuyenMaiRepository.save(khuyenMai);
                return new DataResponse(true, new ResultModel<>(null, "Đổi trạng thái thành công Sắp diễn ra" ));
            }
        }
        return new DataResponse(false, new ResultModel<>(null, "Lỗi khi đổi trạng thái" ));
    }



}
