package com.example.datn_f5_store.service.impl;

import com.example.datn_f5_store.dto.ChiTietHoaDonDto;
import com.example.datn_f5_store.dto.HoaDonDto;
import com.example.datn_f5_store.dto.KhuyenMaiDto;
import com.example.datn_f5_store.entity.ChiTietHoaDonEntity;
import com.example.datn_f5_store.entity.ChiTietSanPhamEntity;
import com.example.datn_f5_store.entity.HoaDonEntity;
import com.example.datn_f5_store.entity.KhachHangEntity;
import com.example.datn_f5_store.entity.KhuyenMaiEntity;
import com.example.datn_f5_store.entity.LichSuHoaDonEntity;
import com.example.datn_f5_store.entity.NhanVienEntity;
import com.example.datn_f5_store.entity.PhuongThucThanhToanEntity;
import com.example.datn_f5_store.entity.VoucherEntity;
import com.example.datn_f5_store.repository.IChiTietHoaDonRepository;
import com.example.datn_f5_store.repository.IChiTietSanPhamRepository;
import com.example.datn_f5_store.repository.IHoaDonRepository;
import com.example.datn_f5_store.repository.IKhachHangRepository;
import com.example.datn_f5_store.repository.ILichSuHoaDonRepository;
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
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.Arrays;
import java.util.Collections;
import java.util.Comparator;
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
    @Autowired
    private ILichSuHoaDonRepository lichSuHoaDonRepository;



    @Override
    public Page<HoaDonDto> getAllHoaDon(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<HoaDonEntity> khuyenMaiEntities = hoaDonRepository.findAll(pageable);

        Page<HoaDonDto> khuyenMaiDtos = khuyenMaiEntities.map(entity -> new HoaDonDto(
                entity.getId(),
                entity.getKhachHang(),
                entity.getNhanVien(),
                entity.getVoucher(),
                entity.getThanhToan(),
                entity.getMa(),
                entity.getTongTienBanDau(),
                entity.getPhiShip(),
                entity.getTongTienSauVoucher(),
                entity.getTenNguoiNhan(),
                entity.getSdtNguoiNhan(),
                entity.getEmailNguoiNhan(),
                entity.getDiaChiNhanHang(),
                entity.getNgayNhanDuKien(),
                entity.getThoiGianTao(),
                entity.getGiaoHang(),
                entity.getGhiChu(),
                entity.getTrangThai()
        ));
        return khuyenMaiDtos;
    }


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
                            chiTietHoaDon.setTrangThai("đã hủy");
                            chiTietHoaDonRepository.save(chiTietHoaDon);
                        }
                        LichSuHoaDonEntity lichSuHoaDon = lichSuHoaDonRepository.findByHoaDon(entity);
                        lichSuHoaDon.setThoiGianThucHien(new Date());
                        lichSuHoaDon.setTrangThaiCu(lichSuHoaDon.getTrangThaiMoi());
                        lichSuHoaDon.setTrangThaiMoi("đã hủy");
                        lichSuHoaDon.setLoaiThayDoi("hủy hóa đơn hết hạn");
                        lichSuHoaDonRepository.save(lichSuHoaDon);
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
                        entity.getPhiShip(),
                        entity.getTongTienSauVoucher(),
                        entity.getTenNguoiNhan(),
                        entity.getSdtNguoiNhan(),
                        entity.getEmailNguoiNhan(),
                        entity.getDiaChiNhanHang(),
                        entity.getNgayNhanDuKien(),
                        entity.getThoiGianTao(),
                        entity.getGiaoHang(),
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

            // Set giá trị mặc định cho khách hàng và thanh toán
            if (request.getIdKhachHang() == null || request.getIdKhachHang() == 0) {
                request.setIdKhachHang(1);
            }
            request.setIdThanhToan(1);
            request.setTongTienBanDau(0.0);
            request.setThoiGianTao(new Date());

            // Kiểm tra số lượng hóa đơn "đang thanh toán"
            if (hoaDonRepository.findByTrangThai("đang thanh toán").size() >= 5) {
                request.setTrangThai("chờ thanh toán");
            } else {
                request.setTrangThai("đang thanh toán");
            }

            // Tạo và lưu hóa đơn, nhận DataResponse
            HoaDonEntity hoaDon = this.saveOrUpdate(new HoaDonEntity(), request);

            // Kiểm tra nếu việc lưu hóa đơn thành công
            if (hoaDon != null) {
                // Tạo lịch sử hóa đơn và gán hóa đơn vừa tạo
                LichSuHoaDonEntity lichSuHoaDon = new LichSuHoaDonEntity();
                lichSuHoaDon.setHoaDon(hoaDon);
                lichSuHoaDon.setNhanVien(hoaDon.getNhanVien());
                lichSuHoaDon.setTrangThaiCu(null);
                lichSuHoaDon.setTrangThaiMoi(hoaDon.getTrangThai());
                lichSuHoaDon.setThoiGianThucHien(hoaDon.getThoiGianTao());
                lichSuHoaDon.setLoaiThayDoi("tạo hóa đơn");
                // Lưu lịch sử hóa đơn vào cơ sở dữ liệu
                lichSuHoaDonRepository.save(lichSuHoaDon);

                // Trả về DataResponse với thông báo thành công
                return new DataResponse(true, new ResultModel<>(null, "tạo hóa đơn thành công"));
            } else {
                // Trả về thông báo lỗi nếu việc tạo hóa đơn thất bại
                return new DataResponse(false, new ResultModel<>(null, "Không thể tạo hóa đơn"));
            }
        } else {
            // Trả về thông báo lỗi nếu dữ liệu không hợp lệ
            return new DataResponse(false, new ResultModel<>(null, "Dữ liệu không hợp lệ"));
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
            if(request.getIdVoucher()!=null){
                VoucherEntity voucher = voucherRepository.findById(request.getIdVoucher()).orElse(null);
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
            }
            request.setTongTienSauVoucher(request.getTongTienBanDau());
            // Kiểm tra tổng tiền sau khi áp dụng voucher
            if (request.getTongTienSauVoucher() == 0) {
                return new DataResponse(false, new ResultModel<>(null, "Không thể thanh toán hóa đơn 0đ"));
            }
            // Cập nhật trạng thái của hóa đơn
            request.setTrangThai("chờ xác nhận");
            request.setMa(hoaDon.getMa());
            request.setIdNhanVien(hoaDon.getNhanVien().getId());
            request.setTongTienBanDau(hoaDon.getTongTienBanDau());
            request.setThoiGianTao(hoaDon.getThoiGianTao());
            request.setGhiChu(hoaDon.getGhiChu());
            if (request.getGiaoHang() == 0) {
                request.setPhiShip(0.0);
            }
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
            } else {
                request.setIdKhachHang(1);
            }
            LichSuHoaDonEntity lichSuHoaDon = lichSuHoaDonRepository.findByHoaDon(hoaDon);
            lichSuHoaDon.setThoiGianThucHien(new Date());
            lichSuHoaDon.setTrangThaiCu(lichSuHoaDon.getTrangThaiMoi());
            lichSuHoaDon.setTrangThaiMoi(hoaDon.getTrangThai());
            lichSuHoaDon.setLoaiThayDoi("thanh toán");
            lichSuHoaDonRepository.save(lichSuHoaDon);
            List<ChiTietHoaDonEntity> chiTietHoaDon = chiTietHoaDonRepository.getChiTietHoaDonEntityByHoaDon(hoaDon);
            for(ChiTietHoaDonEntity x: chiTietHoaDon) {
                x.setTrangThai(hoaDon.getTrangThai());
                chiTietHoaDonRepository.save(x);
            }
            // Cập nhật hóa đơn mà không thay đổi ID
            this.saveOrUpdate(hoaDon, request);
            return new DataResponse(false, new ResultModel<>(null, "Thanh toán thành công"));
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
        LichSuHoaDonEntity lichSuHoaDon = lichSuHoaDonRepository.findByHoaDon(hoaDon);
        lichSuHoaDon.setThoiGianThucHien(new Date());
        lichSuHoaDon.setTrangThaiCu(lichSuHoaDon.getTrangThaiMoi());
        lichSuHoaDon.setTrangThaiMoi("đã hủy");
        lichSuHoaDon.setLoaiThayDoi("hủy hóa đơn");
        lichSuHoaDonRepository.save(lichSuHoaDon);
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

        // Tạo mới chi tiết hóa đơn
        ChiTietHoaDonEntity chiTietHoaDon = this.convertChiTietHoaDon(new ChiTietHoaDonEntity(), request);
        // Xử lý nếu chi tiết hóa đơn chưa tồn tại hoặc đã tồn tại
        if (chiTietHoaDonDetail == null) {
            chiTietHoaDon.setChiTietSanPham(chiTietSanPham);
            chiTietHoaDon.setGiaSpctHienTai(chiTietSanPham.getDonGia() * request.getSoLuong());
            chiTietHoaDon.setSoLuong(request.getSoLuong());
            chiTietHoaDon.setMa(hoaDon.getMa());
            chiTietHoaDon.setTrangThai(hoaDon.getTrangThai());
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
                chiTietHoaDon.setChiTietSanPham(chiTietSanPham);
                chiTietHoaDon.setGiaSpctHienTai(chiTietSanPham.getDonGia() * request.getSoLuong());
                chiTietHoaDon.setSoLuong(request.getSoLuong());
                chiTietHoaDon.setMa(hoaDon.getMa());
                chiTietHoaDon.setTrangThai(hoaDon.getTrangThai());
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
    public DataResponse giamSoLuongSanPham(Integer idHdct) {
        ChiTietHoaDonEntity chiTietHoaDon = chiTietHoaDonRepository.findById(idHdct)
                .orElseThrow(() -> new EntityNotFoundException("chi tiết hóa đơn không tồn tại"));
        ChiTietSanPhamEntity chiTietSanPham = chiTietSanPhamRepository.findById(chiTietHoaDon.getChiTietSanPham().getId())
                .orElseThrow(() -> new EntityNotFoundException("chi tiết sản phẩm không tồn tại"));
        HoaDonEntity hoaDon = hoaDonRepository.findById(chiTietHoaDon.getHoaDon().getId())
                .orElseThrow(()->new EntityNotFoundException("hóa đơn không tồn tại"));
        chiTietHoaDon.setGiaSpctHienTai(chiTietHoaDon.getGiaSpctHienTai()-chiTietSanPham.getDonGia());
        List<ChiTietHoaDonEntity> chitietHoaDonDetail = chiTietHoaDonRepository.getChiTietHoaDonEntityByHoaDon(hoaDon);
        if(chiTietHoaDon.getSoLuong()>0) {
            chiTietHoaDon.setSoLuong(chiTietHoaDon.getSoLuong() - 1);
            chiTietHoaDonRepository.save(chiTietHoaDon);
        }else {
            throw new RuntimeException("số lượng đã hết");
        }
        chiTietSanPham.setSoLuong(chiTietSanPham.getSoLuong() + 1);
        chiTietSanPhamRepository.save(chiTietSanPham);
        double tongTien = 0.0;
        for (ChiTietHoaDonEntity x : chitietHoaDonDetail) {
            if (x.getHoaDon().equals(hoaDon)) {
                tongTien += x.getGiaSpctHienTai();
            }
        }
        hoaDon.setTongTienBanDau(tongTien);
        hoaDonRepository.save(hoaDon);
        return new DataResponse(true,new ResultModel<>(null,"giảm thành công"));
    }
    @Override
    public DataResponse updateKhachhang(Integer idHoaDon,Integer idKhachHang) {
        HoaDonEntity hoaDon = hoaDonRepository.findById(idHoaDon).orElse(null);
        KhachHangEntity khachHang = khachHangRepository.findById(idKhachHang).orElse(null);
        hoaDon.setKhachHang(khachHang);
        hoaDonRepository.save(hoaDon);
        return new DataResponse(true,new ResultModel<>(null,"cập nhật khách hàng thành công"));
    }

    @Override
    public List<HoaDonDto> getByTrangThai() {
        List<String> trangThaiList = Arrays.asList("chờ xác nhận", "đã xác nhận", "đang giao hàng", "hoàn thành");

        List<HoaDonEntity> hoaDon = hoaDonRepository.findByTrangThaiIn(trangThaiList);

        // Sắp xếp theo thời gian tạo giảm dần (mới nhất trước)
        return hoaDon.stream()
                .sorted(Comparator.comparing(HoaDonEntity::getThoiGianTao).reversed()) // Sắp xếp giảm dần
                .map(entity -> new HoaDonDto(
                        entity.getId(),
                        entity.getKhachHang(),
                        entity.getNhanVien(),
                        entity.getVoucher(),
                        entity.getThanhToan(),
                        entity.getMa(),
                        entity.getTongTienBanDau(),
                        entity.getPhiShip(),
                        entity.getTongTienSauVoucher(),
                        entity.getTenNguoiNhan(),
                        entity.getSdtNguoiNhan(),
                        entity.getEmailNguoiNhan(),
                        entity.getDiaChiNhanHang(),
                        entity.getNgayNhanDuKien(),
                        entity.getThoiGianTao(),
                        entity.getGiaoHang(),
                        entity.getGhiChu(),
                        entity.getTrangThai()
                )).collect(Collectors.toList());
    }



    @Override
    public HoaDonEntity getDetailHoaDonCho(Integer id) {
        HoaDonEntity hoaDon = hoaDonRepository.findById(id).orElse(null);
        return hoaDon;
    }

    @Override
    public DataResponse updateTrangThaiHoaDon(Integer id) {
        HoaDonEntity hoaDon = hoaDonRepository.findById(id).orElse(null);
        if(hoaDon.getTrangThai().equals("chờ xác nhận")) {
            hoaDon.setTrangThai("đã xác nhận");
        }else if(hoaDon.getTrangThai().equals("đã xác nhận")&&hoaDon.getGiaoHang()==1){
            hoaDon.setTrangThai("đang giao hàng");
        }else if(hoaDon.getTrangThai().equals("đã xác nhận")&&hoaDon.getGiaoHang()==0){
            hoaDon.setTrangThai("hoàn thành");
        }else if(hoaDon.getTrangThai().equals("đang giao hàng")){
            hoaDon.setTrangThai("hoàn thành");
        }
        hoaDonRepository.save(hoaDon);
        return new DataResponse(true,new ResultModel<>(null,"chuyển đổi thành công!") );
    }

    @Override
    public Page<HoaDonDto> getByTrangThaiHoanThanh(Integer page, Integer size,String keyWord) {
        Pageable pageable = PageRequest.of(page, size);

        // Tạo danh sách các trạng thái muốn tìm kiếm
        List<String> trangThais = Arrays.asList("hoàn thành", "đã hủy");

        // Sử dụng phương thức repository mới để tìm kiếm các hóa đơn có trạng thái trong danh sách
        Page<HoaDonEntity> hoaDon;
        if(keyWord==null||keyWord.isEmpty()) {
            hoaDon = hoaDonRepository.findByTrangThaiIn(trangThais, pageable);
        }else {
            hoaDon = hoaDonRepository.searchByKeywordAndTrangThai(keyWord,trangThais,pageable);
        }

        // Chuyển đổi Page<HoaDonEntity> thành Page<HoaDonDto>
        return hoaDon.map(entity -> new HoaDonDto(
                entity.getId(),
                entity.getKhachHang(),
                entity.getNhanVien(),
                entity.getVoucher(),
                entity.getThanhToan(),
                entity.getMa(),
                entity.getTongTienBanDau(),
                entity.getPhiShip(),
                entity.getTongTienSauVoucher(),
                entity.getTenNguoiNhan(),
                entity.getSdtNguoiNhan(),
                entity.getEmailNguoiNhan(),
                entity.getDiaChiNhanHang(),
                entity.getNgayNhanDuKien(),
                entity.getThoiGianTao(),
                entity.getGiaoHang(),
                entity.getGhiChu(),
                entity.getTrangThai()
        ));
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

    private HoaDonEntity saveOrUpdate(HoaDonEntity entity, HoaDonRequest request) {
        try {
            this.convertHoaDon(entity, request);
            return hoaDonRepository.save(entity);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    private Boolean isNullHoaDon(HoaDonRequest request) {
        if (request.getIdNhanVien() == null) {
            return new DataResponse(false, new ResultModel<>(null, "nhân viên không được null")).isStatus();
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
        if(request.getIdVoucher()!=null) {
            VoucherEntity voucher = voucherRepository.findById(request.getIdVoucher()).orElse(null);
            entity.setVoucher(voucher);
        }else {
            entity.setVoucher(null);
        }
        PhuongThucThanhToanEntity thanhToan = thanhToanRepository.findById(request.getIdThanhToan()).orElse(null);
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
        entity.setGiaoHang(request.getGiaoHang());
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
