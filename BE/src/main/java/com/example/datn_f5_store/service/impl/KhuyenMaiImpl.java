package com.example.datn_f5_store.service.impl;

import com.example.datn_f5_store.dto.KhuyenMaiDto;
import com.example.datn_f5_store.entity.KhuyenMaiEntity;
import com.example.datn_f5_store.exceptions.DataNotFoundException;
import com.example.datn_f5_store.repository.IKhuyenMaiRepository;
import com.example.datn_f5_store.request.KhuyenMaiRequest;
import com.example.datn_f5_store.response.DataResponse;
import com.example.datn_f5_store.service.KhuyenMaiService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import  com.example.datn_f5_store.response.ResultModel;

import java.time.LocalDate;
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
        Pageable pageable = PageRequest.of(page, size);
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
    public DataResponse create(KhuyenMaiRequest khuyenMaiRequest) {
        Date ngayHientai = new Date(); // Ngày hiện tại
        LocalDate currentDate = ngayHientai.toInstant().atZone(ZoneId.systemDefault()).toLocalDate(); // Chuyển đổi sang LocalDate
        KhuyenMaiEntity khuyenMaiEntity = new KhuyenMaiEntity();
        try {
            // Kiểm tra các trường dữ liệu không được null và hợp lệ
            if (checkKhuyenMai(khuyenMaiRequest)) {
                if (!checkTrungMaKhuyenmai(khuyenMaiRequest.getMa())) {
                    // Kiểm tra và gán giá trị từ khuyenMaiRequest
                    String ma = khuyenMaiRequest.getMa();
                    if (ma == null || ma.isEmpty()) {
                        return new DataResponse(false, new ResultModel<>(null, "Mã không được để trống"));
                    }
                    if (khuyenMaiRequest.getKieuKhuyenMai().equalsIgnoreCase("%") && khuyenMaiRequest.getGiaTriKhuyenMai() > 99) {
                        return new DataResponse(false, new ResultModel<>(null, "Giá trị khuyến mãi không được vượt quá 99 khi kiểu khuyến mãi là %."));
                    }
                    // Gán giá trị cho khuyenMaiEntity
                    khuyenMaiEntity.setMa(ma);
                    khuyenMaiEntity.setTen(khuyenMaiRequest.getTen());
                    khuyenMaiEntity.setKieuKhuyenMai(khuyenMaiRequest.getKieuKhuyenMai());
                    khuyenMaiEntity.setMoTa(khuyenMaiRequest.getMoTa());
                    khuyenMaiEntity.setSoLuong(khuyenMaiRequest.getSoLuong());
                    khuyenMaiEntity.setGiaTriKhuyenMai(khuyenMaiRequest.getGiaTriKhuyenMai());
                    khuyenMaiEntity.setThoiGianBatDau(khuyenMaiRequest.getThoiGianBatDau());
                    khuyenMaiEntity.setThoiGianKetThuc(khuyenMaiRequest.getThoiGianKetThuc());
                    khuyenMaiEntity.setThoiGianTao(ngayHientai);
                    khuyenMaiEntity.setNguoiTao("ADMIN");

                    // Kiểm tra và cập nhật trạng thái
                    LocalDate thoiGianBatDau = khuyenMaiRequest.getThoiGianBatDau().toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
                    LocalDate thoiGianKetThuc = khuyenMaiRequest.getThoiGianKetThuc().toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
                    if (thoiGianKetThuc.isBefore(currentDate)) {
                        khuyenMaiEntity.setTrangThai("Đã hết hạn");
                    } else if (thoiGianBatDau.isEqual(currentDate)) {
                        khuyenMaiEntity.setTrangThai("Đang diễn ra");
                    } else if (thoiGianBatDau.isBefore(currentDate) && thoiGianKetThuc.isAfter(currentDate)) {
                        khuyenMaiEntity.setTrangThai("Đang diễn ra");
                    } else {
                        khuyenMaiEntity.setTrangThai("Sắp diễn ra");
                    }
                    // Lưu khuyến mãi
                    khuyenMaiRepository.save(khuyenMaiEntity);
                    return new DataResponse(true, new ResultModel<>(null, "Thêm Khuyến mãi thành công"));
                } else {
                    return new DataResponse(false, new ResultModel<>(null, "Mã Khuyến mãi đã tồn tại!"));
                }
            }
            return new DataResponse(false, new ResultModel<>(null, "Các trường dữ liệu không được để trống hoặc < 0, Vui lòng kiểm tra lại"));
        } catch (Exception e) {
            return new DataResponse(false, new ResultModel<>(null, "Đã xảy ra lỗi: " + e.getMessage()));
        }
    }


    // hàm cập nhập Khuyến mãi theo id
    @Override
    public DataResponse update(KhuyenMaiRequest khuyenMaiRequest, Integer id) {
        Date currentDate = new Date();
        LocalDate ngayHienTai = currentDate.toInstant().atZone(ZoneId.systemDefault()).toLocalDate(); // Chuyển đổi sang LocalDate
        // Láy được khuyến mãi cần cập nhập theo id
        KhuyenMaiEntity khuyenMaiEntity = khuyenMaiRepository.findById(id).get();
        try {
            if (checkKhuyenMai(khuyenMaiRequest)) {
                if (khuyenMaiRequest.getKieuKhuyenMai().equalsIgnoreCase("%") && khuyenMaiRequest.getGiaTriKhuyenMai() > 99) {
                    return new DataResponse(false, new ResultModel<>(null, "Giá trị khuyến mãi không được vượt quá 99 khi kiểu khuyến mãi là %."));
                }
                if(!khuyenMaiEntity.getThoiGianBatDau().after(currentDate)){
                khuyenMaiEntity.setTen(khuyenMaiRequest.getTen());
                khuyenMaiEntity.setKieuKhuyenMai(khuyenMaiRequest.getKieuKhuyenMai());
                khuyenMaiEntity.setMoTa(khuyenMaiRequest.getMoTa());
                khuyenMaiEntity.setSoLuong(khuyenMaiRequest.getSoLuong());
                khuyenMaiEntity.setGiaTriKhuyenMai(khuyenMaiRequest.getGiaTriKhuyenMai());
                khuyenMaiEntity.setThoiGianKetThuc(khuyenMaiRequest.getThoiGianKetThuc());
                khuyenMaiEntity.setThoiGianSua(currentDate);
                khuyenMaiEntity.setNguoiSua("ADMIN");
                    LocalDate thoiGianBatDau = khuyenMaiRequest.getThoiGianBatDau().toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
                    LocalDate thoiGianKetThuc = khuyenMaiRequest.getThoiGianKetThuc().toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
                    if (thoiGianKetThuc.isBefore(ngayHienTai)) {
                        khuyenMaiEntity.setTrangThai("Đã hết hạn");
                    } else if (thoiGianBatDau.isEqual(ngayHienTai)) {
                        khuyenMaiEntity.setTrangThai("Đang diễn ra");
                    } else if (thoiGianBatDau.isBefore(ngayHienTai) && thoiGianKetThuc.isAfter(ngayHienTai)) {
                        khuyenMaiEntity.setTrangThai("Đang diễn ra");
                    } else {
                        khuyenMaiEntity.setTrangThai("Sắp diễn ra");
                    }
                khuyenMaiRepository.save(khuyenMaiEntity);
                return new DataResponse(true, new ResultModel<>(null, "Sửa Khuyến mãi thành công"));
                }
                if(khuyenMaiEntity.getThoiGianBatDau().after(currentDate)){
                    khuyenMaiEntity.setTen(khuyenMaiRequest.getTen());
                    khuyenMaiEntity.setKieuKhuyenMai(khuyenMaiRequest.getKieuKhuyenMai());
                    khuyenMaiEntity.setMoTa(khuyenMaiRequest.getMoTa());
                    khuyenMaiEntity.setSoLuong(khuyenMaiRequest.getSoLuong());
                    khuyenMaiEntity.setGiaTriKhuyenMai(khuyenMaiRequest.getGiaTriKhuyenMai());
                    khuyenMaiEntity.setThoiGianBatDau(khuyenMaiRequest.getThoiGianBatDau());
                    khuyenMaiEntity.setThoiGianKetThuc(khuyenMaiRequest.getThoiGianKetThuc());
                    khuyenMaiEntity.setThoiGianSua(currentDate);
                    khuyenMaiEntity.setNguoiSua("ADMIN");
                    LocalDate thoiGianBatDau = khuyenMaiRequest.getThoiGianBatDau().toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
                    LocalDate thoiGianKetThuc = khuyenMaiRequest.getThoiGianKetThuc().toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
                    if (thoiGianKetThuc.isBefore(ngayHienTai)) {
                        khuyenMaiEntity.setTrangThai("Đã hết hạn");
                    } else if (thoiGianBatDau.isEqual(ngayHienTai)) {
                        khuyenMaiEntity.setTrangThai("Đang diễn ra");
                    } else if (thoiGianBatDau.isBefore(ngayHienTai) && thoiGianKetThuc.isAfter(ngayHienTai)) {
                        khuyenMaiEntity.setTrangThai("Đang diễn ra");
                    } else {
                        khuyenMaiEntity.setTrangThai("Sắp diễn ra");
                    }

                    khuyenMaiRepository.save(khuyenMaiEntity);
                    return new DataResponse(true, new ResultModel<>(null, "Sửa Khuyến mãi thành công"));
                }

            }
            return new DataResponse(false, new ResultModel<>(null, "Các trường dữ lệu không được để trống hoặc < 0, Vui lòng kiểm tra lại"));
        } catch (Exception e) {
            return new DataResponse(false, new ResultModel<>(null, "Lỗi Sửa Khuyến mãi, vui lòng thử lại"));
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
    public Page<KhuyenMaiDto> findKhuyenMaiByDate(int page, int size, Date ngayBatDau, Date ngayKetThuc) {
        Pageable pageable = PageRequest.of(page, size);
        Page<KhuyenMaiEntity> khuyenMaiEntities;

        // Chuyển đổi Date sang LocalDate
        LocalDate startDate = ngayBatDau != null ? ngayBatDau.toInstant().atZone(ZoneId.systemDefault()).toLocalDate() : null;
        LocalDate endDate = ngayKetThuc != null ? ngayKetThuc.toInstant().atZone(ZoneId.systemDefault()).toLocalDate() : null;

        if (startDate == null && endDate == null) {
            // Nếu cả Ngay bắt đầu và ngày kết thuc đều null, thì tìm tất cả khuyến mãi
            khuyenMaiEntities = khuyenMaiRepository.findAll(pageable);
        } else if (startDate != null && endDate != null) {
            // Nếu cả hai không null, tìm khuyến mãi theo khoảng thời gian
            khuyenMaiEntities = khuyenMaiRepository
                    .findAllByThoiGianBatDauGreaterThanEqualAndThoiGianKetThucLessThanEqual(
                            Date.from(startDate.atStartOfDay(ZoneId.systemDefault()).toInstant()),
                            Date.from(endDate.atStartOfDay(ZoneId.systemDefault()).toInstant()),
                            pageable);
        } else if (startDate != null) {
            // Nếu chỉ có ngay bat dau, tìm khuyến mãi bắt đầu từ ngày đó trở đi
            khuyenMaiEntities = khuyenMaiRepository
                    .findAllByThoiGianBatDauGreaterThanEqual(Date.from(startDate.atStartOfDay(ZoneId.systemDefault()).toInstant()), pageable);
        } else {
            // Nếu chỉ có ngay kết thúc, tìm khuyến mãi kết thúc trước hoặc bằng ngày đó
            khuyenMaiEntities = khuyenMaiRepository
                    .findAllByThoiGianKetThucLessThanEqual(Date.from(endDate.atStartOfDay(ZoneId.systemDefault()).toInstant()), pageable);
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


    // hàm tự động cap nhap khuyến mãi khi đã hết hạn
    @Override
    @Scheduled(cron = "0 0 12 * * ?")
    public void CapNhapTrangThaiKhuyenMaiDhh() {
        try {
            // khai báo thời gian hiện tại
            Date currentDate = new Date();
            // lấy ra tất cả Khuyến mãi
            List<KhuyenMaiEntity> khuyenMaiEntities = khuyenMaiRepository.findAll();

            for (KhuyenMaiEntity khuyenMai : khuyenMaiEntities) {
                // Kiểm tra nếu có Khuyến mãi nào có Thời gian kết thúc nhỏ hơn so với thời gian hiện tại thì cập nhập lại trạng thái
                if (khuyenMai.getThoiGianKetThuc() != null && khuyenMai.getThoiGianKetThuc().before(currentDate)) {
                    khuyenMai.setTrangThai("Đã hết hạn");
                    khuyenMaiRepository.save(khuyenMai);
                }
                if (khuyenMai.getThoiGianKetThuc() != null && khuyenMai.getThoiGianBatDau() != null
                        && !khuyenMai.getThoiGianBatDau().after(currentDate) &&
                        !khuyenMai.getThoiGianKetThuc().before(currentDate)
                        && khuyenMai.getTrangThai().trim().equalsIgnoreCase("Sắp diễn ra")) {
                    khuyenMai.setTrangThai("Đang diễn ra");
                    khuyenMaiRepository.save(khuyenMai);
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    @Override
    public Boolean CapNhapTrangThaiKhuyenMai(Integer id) throws DataNotFoundException {
        Date ngayHienTai = new Date();
        LocalDate currentDate = ngayHienTai.toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
        KhuyenMaiEntity khuyenMai = khuyenMaiRepository.findById(id).orElseThrow(
                () -> new DataNotFoundException("Không thể cập nhập trạng thái với id : "+ id)
        );

        LocalDate thoiGianBatDau = khuyenMai.getThoiGianBatDau().toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
        LocalDate thoiGianKetThuc = khuyenMai.getThoiGianKetThuc().toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
        if (khuyenMai.getTrangThai().trim().equalsIgnoreCase("Đang diễn ra") || khuyenMai.getTrangThai().equalsIgnoreCase("Sắp diễn ra")){
            khuyenMai.setTrangThai("Không hoạt động");
            khuyenMaiRepository.save(khuyenMai);
            return true;
        }
        if (khuyenMai.getTrangThai().trim().equalsIgnoreCase("Không hoạt động")){
            if (thoiGianKetThuc.isBefore(currentDate)) {
                khuyenMai.setTrangThai("Đã hết hạn");
            } else if (thoiGianBatDau.isEqual(currentDate)) {
                khuyenMai.setTrangThai("Đang diễn ra");
            } else if (thoiGianBatDau.isBefore(currentDate) && thoiGianKetThuc.isAfter(currentDate)) {
                khuyenMai.setTrangThai("Đang diễn ra");
            } else {
                khuyenMai.setTrangThai("Sắp diễn ra");
            }
            khuyenMaiRepository.save(khuyenMai);
            return true;
        }
        return false;
    }

}
