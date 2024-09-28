package com.example.datn_f5_store.service.impl;

import com.example.datn_f5_store.dto.ChiTietHoaDonDto;
import com.example.datn_f5_store.dto.HoaDonDto;
import com.example.datn_f5_store.entity.ChiTietHoaDonEntity;
import com.example.datn_f5_store.entity.ChiTietSanPhamEntity;
import com.example.datn_f5_store.entity.HoaDonEntity;
import com.example.datn_f5_store.entity.KhachHangEntity;
import com.example.datn_f5_store.entity.NhanVienEntity;
import com.example.datn_f5_store.entity.ThanhToanEntity;
import com.example.datn_f5_store.entity.VoucherEntity;
import com.example.datn_f5_store.repository.IChiTietHoaDonRepository;
import com.example.datn_f5_store.repository.IChiTietSanPhamRepository;
import com.example.datn_f5_store.repository.IHoaDonRepository;
import com.example.datn_f5_store.repository.IKhachHangRepository;
import com.example.datn_f5_store.repository.INhanVienRepository;
import com.example.datn_f5_store.repository.IThanhToanRepository;
import com.example.datn_f5_store.repository.IVoucherRepository;
import com.example.datn_f5_store.request.ChiTietHoaDonRequest;
import com.example.datn_f5_store.request.HoaDonRequest;
import com.example.datn_f5_store.response.DataResponse;
import com.example.datn_f5_store.response.ResultModel;
import com.example.datn_f5_store.service.IHoaDonService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.config.ConfigDataResourceNotFoundException;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class HoaDonServiceImpl implements IHoaDonService {
    @Autowired
    private IHoaDonRepository hoaDonRepository;
    @Autowired
    private IKhachHangRepository khachHangRepository;
    @Autowired
    private INhanVienRepository nhanVienRepository;
    @Autowired
    private IVoucherRepository voucherRepository;
    @Autowired
    private IThanhToanRepository thanhToanRepository;
    @Autowired
    private IChiTietHoaDonRepository chiTietHoaDonRepository;
    @Autowired
    private IChiTietSanPhamRepository chiTietSanPhamRepository;

    @Override
    public List<HoaDonDto> getAll() {
        // lấy thời gian hiện tại
        LocalDate today = LocalDate.now();
        // lấy dách sách hóa đơn
        List<HoaDonEntity> hoaDon = hoaDonRepository.findAll();
        // lọc danh sách hóa đơn theo điều kiện
        List<HoaDonDto> hoaDonFilter = hoaDon.stream()
                .filter(entity -> {
                    // Chuyển đổi Date sang LocalDate
                    LocalDate thoiGianTaoLocalDate = convertToLocalDateViaInstant(entity.getThoiGianTao());
                    // lọc hóa đơn có trạng thái là đang thanh toán của ngày hôm nay
                    boolean isToday = thoiGianTaoLocalDate.equals(today);
                    boolean isTrangThaiNow = entity.getTrangThai().equals("đang thanh toán");
                    // giữ lại hóa đơn ngày hôm nay có trạng thái là đang thanh toán
                    if (isToday && isTrangThaiNow) {
                        return true;
                    }
                    //hủy hóa đơn của những ngày trước đó có trạng thái là chờ thanh toán và đang thanh toán
                    boolean isBeforeToday = thoiGianTaoLocalDate.isBefore(today);
                    boolean isTrangThaiBefore = entity.getTrangThai().equals("chờ thanh toán");
                    if (isBeforeToday && (isTrangThaiNow || isTrangThaiBefore)) {
                        entity.setTrangThai("đã hủy");
                        hoaDonRepository.save(entity);
                        ChiTietHoaDonEntity chiTietHoaDon = chiTietHoaDonRepository.findByHoaDon(entity);
                        if (chiTietHoaDon != null) {
                            ChiTietSanPhamEntity chiTietSanPham = chiTietSanPhamRepository.findById(chiTietHoaDon.getChiTietSanPham().getId()).orElse(null);
                            chiTietSanPham.setSoLuong(chiTietSanPham.getSoLuong() + chiTietHoaDon.getSoLuong());
                            chiTietSanPhamRepository.save(chiTietSanPham);
                        }
                    }

                    List<HoaDonEntity> currentDangThanhToan = hoaDonRepository.findByTrangThai("đang thanh toán");
                    if (currentDangThanhToan.size() < 5) {
                        List<HoaDonEntity> choThanhToan = hoaDonRepository.findByTrangThai("chờ thanh toán");
                        if (!choThanhToan.isEmpty()) {
                            HoaDonEntity hoaDonChoThanhToan = choThanhToan.get(0);
                            hoaDonChoThanhToan.setTrangThai("đang thanh toán");
                            hoaDonRepository.save(hoaDonChoThanhToan);
                        }
                    }
                    return false;
                })
                .map(entity -> new HoaDonDto(
                        entity.getId(),
                        entity.getKhachHang(),
                        entity.getNhanVien(),
                        entity.getVoucher(),
                        entity.getThanhToan(),
                        entity.getMa(),
                        entity.getTongTienBanDau(),
                        entity.getTongTienSauVoucher(),
                        entity.getTenNguoiNhan(),
                        entity.getSdtNguoiNhan(),
                        entity.getEmailNguoiNhan(),
                        entity.getDiaChiNhanHang(),
                        entity.getNgayNhanDuKien(),
                        entity.getThoiGianTao(),
                        entity.getGhiChu(),
                        entity.getTrangThai()
                )).collect(Collectors.toList());
        return hoaDonFilter;
    }

    @Override
    public DataResponse craete(HoaDonRequest request) {
        if (this.isNullHoaDon(request)) {
            String maHoaDon = this.generateMaHoaDon();

            // Kiểm tra mã hóa đơn có trùng không, nếu trùng thì sinh lại
            while (hoaDonRepository.existsByMa(maHoaDon)) {
                maHoaDon = this.generateMaHoaDon();
            }
            request.setMa(maHoaDon);
            if (request.getIdKhachHang() == null || request.getIdKhachHang() == 0) {
                request.setIdKhachHang(1);
            }
            request.setIdThanhToan(1);
            request.setTongTienBanDau(0.0);
            request.setThoiGianTao(new Date());
            if (hoaDonRepository.findByTrangThai("đang thanh toán").size() >= 5) {
                request.setTrangThai("chờ thanh toán");
            } else {
                request.setTrangThai("đang thanh toán");
            }
            return this.saveOrUpdate(new HoaDonEntity(), request);
        } else {
            return new DataResponse(false, new ResultModel<>(null, "dữ liệu không hợp lệ"));
        }
    }

    @Override
    public DataResponse update(HoaDonRequest request, Integer id) {
        // Kiểm tra tính hợp lệ của dữ liệu
        if (this.isNullHoaDon(request)) {
            // Tìm kiếm hóa đơn theo ID
            HoaDonEntity hoaDon = hoaDonRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Hoá đơn không tồn tại"));

            request.setId(hoaDon.getId());
            VoucherEntity voucher = voucherRepository.findById(request.getIdVoucher())
                    .orElseThrow(() -> new EntityNotFoundException("voucher không tồn tại!"));
            double giaTriVoucher = 0.0;
            if (voucher.getKieuGiamGia().equals("%")) {
                System.out.println(hoaDon.getTongTienBanDau());
                System.out.println(voucher.getGiaTriVoucher());
                giaTriVoucher = hoaDon.getTongTienBanDau() * (voucher.getGiaTriVoucher() / 100.0);
                System.out.println(giaTriVoucher);
            } else {
                giaTriVoucher = voucher.getGiaTriVoucher();
            }
            double voucherMoney = Math.min(giaTriVoucher, voucher.getGiaTriGiamToiDa());
            if (hoaDon.getTongTienBanDau() >= voucher.getGiaTriHoaDonToiThieu()) {
                request.setTongTienSauVoucher(hoaDon.getTongTienBanDau() - voucherMoney);
            } else {
                return new DataResponse(false, new ResultModel<>(null, "hóa đơn không hợp lệ để dùng voucher này"));
            }
            if (voucher == null) {
                request.setTongTienSauVoucher(request.getTongTienBanDau());
            }
            // Kiểm tra tổng tiền sau khi áp dụng voucher
            if (request.getTongTienSauVoucher() == 0) {
                return new DataResponse(false, new ResultModel<>(null, "Không thể thanh toán hóa đơn 0đ"));
            }
            // Cập nhật trạng thái của hóa đơn
            request.setTrangThai("đã thanh toán");
            request.setMa(hoaDon.getMa());
            request.setIdNhanVien(hoaDon.getNhanVien().getId());
            request.setTongTienBanDau(hoaDon.getTongTienBanDau());
            if (!hoaDon.getKhachHang().getId().equals(1)) {
                String diaChiNhanHang = hoaDon.getKhachHang().getDiaChiKhachHang().getSoNha() + ","
                        + hoaDon.getKhachHang().getDiaChiKhachHang().getDuong() + ","
                        + hoaDon.getKhachHang().getDiaChiKhachHang().getPhuongXa() + ","
                        + hoaDon.getKhachHang().getDiaChiKhachHang().getQuanHuyen() + ","
                        + hoaDon.getKhachHang().getDiaChiKhachHang().getQuocGia();
                request.setDiaChiNhanHang(diaChiNhanHang);
                request.setEmailNguoiNhan(hoaDon.getKhachHang().getEmail());
                request.setSdtNguoiNhan(hoaDon.getKhachHang().getSdt());
                request.setTenNguoiNhan(hoaDon.getKhachHang().getTen());
                request.setThoiGianTao(hoaDon.getThoiGianTao());
                request.setGhiChu(hoaDon.getGhiChu());
            } else {
                request.setIdKhachHang(1);
            }
            if (hoaDon.getThanhToan().getId().equals(1)) {
                request.setIdThanhToan(1);
            }
            // Cập nhật hóa đơn mà không thay đổi ID
            return this.saveOrUpdate(hoaDon, request);
        } else {
            return new DataResponse(false, new ResultModel<>(null, "Dữ liệu không hợp lệ"));
        }
    }

    @Override
    public DataResponse huyHoaDon(Integer id) {
        HoaDonEntity hoaDon = hoaDonRepository.findById(id).orElse(null);
        if (hoaDon == null) {
            return new DataResponse(false, new ResultModel<>(null, "hóa đơn không tồn tại"));
        }
        List<ChiTietHoaDonEntity> chiTietHoaDon = chiTietHoaDonRepository.getChiTietHoaDonEntityByHoaDon(hoaDon);
        if (chiTietHoaDon != null) {
            for (ChiTietHoaDonEntity x : chiTietHoaDon) {
                ChiTietSanPhamEntity chiTietSanPham = chiTietSanPhamRepository.findById(x.getChiTietSanPham().getId()).orElse(null);
                if (chiTietSanPham != null) {
                    chiTietSanPham.setSoLuong(chiTietSanPham.getSoLuong() + x.getSoLuong());
                    chiTietSanPhamRepository.save(chiTietSanPham);
                }
            }
        }
        hoaDon.setTrangThai("đã hủy");
        hoaDonRepository.save(hoaDon);
        return new DataResponse(true, new ResultModel<>(null, "hủy hóa đơn thành công"));
    }

    @Override
    public List<ChiTietHoaDonDto> getChiTietHoaDon(Integer id) {
        HoaDonEntity hoaDon = hoaDonRepository.findById(id).orElse(null);
        if (hoaDon == null) {
            return Collections.emptyList();
        }
        List<ChiTietHoaDonEntity> chiTietHoaDon = chiTietHoaDonRepository.getChiTietHoaDonEntityByHoaDon(hoaDon);
        return chiTietHoaDon.stream()
                .map(enity -> new ChiTietHoaDonDto(
                        enity.getId(),
                        enity.getHoaDon(),
                        enity.getChiTietSanPham(),
                        enity.getMa(),
                        enity.getSoLuong(),
                        enity.getGiaSpctHienTai(),
                        enity.getTrangThai()
                )).collect(Collectors.toList());
    }

    @Override
    public DataResponse chonSanPham(ChiTietHoaDonRequest request, Integer idSanPham) {
        // Tìm chi tiết sản phẩm theo ID
        ChiTietSanPhamEntity chiTietSanPham = chiTietSanPhamRepository.findById(idSanPham).orElse(null);
        if (chiTietSanPham == null) {
            return new DataResponse(false, new ResultModel<>(null, "Sản phẩm không tồn tại"));
        }

        // Kiểm tra số lượng sản phẩm
        if (request.getSoLuong() <= 0 || request.getSoLuong() > chiTietSanPham.getSoLuong()) {
            return new DataResponse(false, new ResultModel<>(null, "Số lượng sản phẩm không đủ"));
        }

        // Tìm hóa đơn
        HoaDonEntity hoaDon = hoaDonRepository.findById(request.getHoaDon())
                .orElseThrow(() -> new EntityNotFoundException("Hóa đơn không tồn tại"));

        // Tìm chi tiết hóa đơn theo hóa đơn
        List<ChiTietHoaDonEntity> chiTietHoaDonDetail = chiTietHoaDonRepository.getChiTietHoaDonEntityByHoaDon(hoaDon);

        // Xử lý nếu chi tiết hóa đơn chưa tồn tại hoặc đã tồn tại
        if (chiTietHoaDonDetail == null) {
            // Tạo mới chi tiết hóa đơn
            ChiTietHoaDonEntity chiTietHoaDon = this.convertChiTietHoaDon(new ChiTietHoaDonEntity(), request);
            chiTietHoaDon.setChiTietSanPham(chiTietSanPham);
            chiTietHoaDon.setGiaSpctHienTai(chiTietSanPham.getDonGia() * request.getSoLuong());
            chiTietHoaDon.setSoLuong(request.getSoLuong());
            chiTietHoaDonRepository.save(chiTietHoaDon);
        } else {
            boolean updated = false;
            for (ChiTietHoaDonEntity x : chiTietHoaDonDetail) {
                if (chiTietSanPham.equals(x.getChiTietSanPham())) {
                    // Cập nhật số lượng sản phẩm trong chi tiết hóa đơn
                    int newQuantity = x.getSoLuong() + request.getSoLuong();
                    x.setSoLuong(newQuantity);
                    x.setGiaSpctHienTai(chiTietSanPham.getDonGia() * newQuantity);
                    chiTietHoaDonRepository.save(x);
                    updated = true;
//                    break; // Kết thúc vòng lặp khi đã cập nhật
                }
            }

            // Nếu không cập nhật chi tiết hóa đơn (sản phẩm mới)
            if (!updated) {
                ChiTietHoaDonEntity chiTietHoaDon = this.convertChiTietHoaDon(new ChiTietHoaDonEntity(), request);
                chiTietHoaDon.setChiTietSanPham(chiTietSanPham);
                chiTietHoaDon.setGiaSpctHienTai(chiTietSanPham.getDonGia() * request.getSoLuong());
                chiTietHoaDon.setSoLuong(request.getSoLuong());
                chiTietHoaDonRepository.save(chiTietHoaDon);
                chiTietHoaDonDetail.add(chiTietHoaDon);
            }
        }
        double tongTien = 0.0;
        for (ChiTietHoaDonEntity x : chiTietHoaDonDetail) {
            if (x.getHoaDon().equals(hoaDon)) {
                tongTien += x.getGiaSpctHienTai();
            }
        }
        hoaDon.setTongTienBanDau(tongTien);
        hoaDonRepository.save(hoaDon);
        // Cập nhật số lượng trong kho
        chiTietSanPham.setSoLuong(chiTietSanPham.getSoLuong() - request.getSoLuong());
        chiTietSanPhamRepository.save(chiTietSanPham);

        return new DataResponse(true, new ResultModel<>(null, "Chọn thành công"));
    }


    @Override
    public DataResponse deleteHoaDonChiTiet(Integer idHoaDonCt) {
        ChiTietHoaDonEntity chiTietHoaDon = chiTietHoaDonRepository.findById(idHoaDonCt)
                .orElseThrow(() -> new EntityNotFoundException("hóa đơn chi tiết không tồn tại"));
        ChiTietSanPhamEntity chiTietSanPham = chiTietSanPhamRepository.findById(chiTietHoaDon.getChiTietSanPham().getId())
                .orElseThrow(() -> new EntityNotFoundException("chi tiết sản phẩm không tồn tại"));
        HoaDonEntity hoaDon = hoaDonRepository.findById(chiTietHoaDon.getHoaDon().getId())
                .orElseThrow(() -> new EntityNotFoundException("hóa đơn không tồn tại"));
        chiTietHoaDonRepository.delete(chiTietHoaDon);
        chiTietSanPham.setSoLuong(chiTietSanPham.getSoLuong() + chiTietHoaDon.getSoLuong());
        chiTietSanPhamRepository.save(chiTietSanPham);
        hoaDon.setTongTienBanDau(hoaDon.getTongTienBanDau() - chiTietHoaDon.getGiaSpctHienTai());
        hoaDonRepository.save(hoaDon);
        return new DataResponse(true, new ResultModel<>(null, "xóa hóa đơn chi tiết thành công"));
    }

    private ChiTietHoaDonEntity convertChiTietHoaDon(ChiTietHoaDonEntity entity, ChiTietHoaDonRequest request) {
        HoaDonEntity hoaDon = hoaDonRepository.findById(request.getHoaDon()).orElse(null);
        entity.setHoaDon(hoaDon);
        ChiTietSanPhamEntity chiTietSanPham = chiTietSanPhamRepository.findById(request.getChiTietSanPham()).orElse(null);
        entity.setChiTietSanPham(chiTietSanPham);
        entity.setSoLuong(request.getSoLuong());
        entity.setMa(request.getMa());
        entity.setGiaSpctHienTai(request.getGiaSpctHienTai());
        entity.setTrangThai(request.getTrangThai());
        return entity;
    }

    // Phương thức chuyển đổi từ Date sang LocalDate
    private LocalDate convertToLocalDateViaInstant(Date dateToConvert) {
        return dateToConvert.toInstant()
                .atZone(ZoneId.systemDefault())
                .toLocalDate();
    }

    private DataResponse saveOrUpdate(HoaDonEntity entity, HoaDonRequest request) {
        try {
            this.convertHoaDon(entity, request);
            hoaDonRepository.save(entity);
            return new DataResponse(false, new ResultModel<>(null, "create or update successfully!"));
        } catch (Exception e) {
            e.printStackTrace();
            return new DataResponse(false, new ResultModel<>(null, "create or update exception"));
        }
    }

    private Boolean isNullHoaDon(HoaDonRequest request) {
        if (request.getIdNhanVien() == null) {
            return new DataResponse(false, new ResultModel<>(null, "nhân viên không được null")).isStatus();
        }
        if (request.getIdThanhToan() == null) {
            return new DataResponse(false, new ResultModel<>(null, "phuong thức thanh toán không được null")).isStatus();
        }
        if (request.getMa() == null || request.getMa().isEmpty()) {
            return new DataResponse(false, new ResultModel<>(null, "mã không được null")).isStatus();
        }
        if (request.getTongTienBanDau() == null) {
            return new DataResponse(false, new ResultModel<>(null, "tổng tiền sau bán không được null")).isStatus();
        }
        return true;
    }

    private HoaDonEntity convertHoaDon(HoaDonEntity entity, HoaDonRequest request) {
//        if(request.getId()==null) {
        entity.setId(request.getId());
//        }
        KhachHangEntity khachHang = khachHangRepository.findById(request.getIdKhachHang()).orElse(null);
        entity.setKhachHang(khachHang);
        NhanVienEntity nhanVien = nhanVienRepository.findById(request.getIdNhanVien()).orElse(null);
        entity.setNhanVien(nhanVien);
        VoucherEntity voucher = voucherRepository.findById(request.getIdVoucher()).orElse(null);
        entity.setVoucher(voucher);
        ThanhToanEntity thanhToan = thanhToanRepository.findById(request.getIdThanhToan()).orElse(null);
        entity.setThanhToan(thanhToan);
        entity.setMa(request.getMa());
        entity.setTongTienBanDau(request.getTongTienBanDau());
        entity.setTongTienSauVoucher(request.getTongTienSauVoucher());
        entity.setTenNguoiNhan(request.getTenNguoiNhan());
        entity.setSdtNguoiNhan(request.getSdtNguoiNhan());
        entity.setEmailNguoiNhan(request.getEmailNguoiNhan());
        entity.setDiaChiNhanHang(request.getDiaChiNhanHang());
        entity.setNgayNhanDuKien(request.getNgayNhanDuKien());
        entity.setThoiGianTao(request.getThoiGianTao());
        entity.setGhiChu(request.getGhiChu());
        entity.setGhiChu(request.getGhiChu());
        entity.setTrangThai(request.getTrangThai());
        return entity;
    }

    public String generateMaHoaDon() {
        // Lấy thời gian hiện tại
        LocalDateTime now = LocalDateTime.now();

        // Định dạng phút và giây thành chuỗi "MMss"
        DateTimeFormatter dateTimeFormatter = DateTimeFormatter.ofPattern("mmss");
        String timeFormat = now.format(dateTimeFormatter);

        // Lấy một phần từ UUID để đảm bảo tính duy nhất
        String uuidPart = UUID.randomUUID().toString().substring(0, 3); // lấy 3 ký tự đầu của UUID

        // Kết hợp chuỗi "HD" với UUID và chuỗi thời gian
        return "HD" + uuidPart + timeFormat;
    }
}