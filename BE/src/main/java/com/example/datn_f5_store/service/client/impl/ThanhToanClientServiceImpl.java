package com.example.datn_f5_store.service.client.impl;

import com.example.datn_f5_store.entity.ChiTietGioHangEntity;
import com.example.datn_f5_store.entity.ChiTietHoaDonEntity;
import com.example.datn_f5_store.entity.ChiTietSanPhamEntity;
import com.example.datn_f5_store.entity.GioHangEntity;
import com.example.datn_f5_store.entity.HoaDonEntity;
import com.example.datn_f5_store.entity.KhachHangEntity;
import com.example.datn_f5_store.entity.LichSuHoaDonEntity;
import com.example.datn_f5_store.entity.NhanVienEntity;
import com.example.datn_f5_store.entity.PhuongThucThanhToanEntity;
import com.example.datn_f5_store.entity.VoucherEntity;
import com.example.datn_f5_store.repository.IChiTietGioHangRepository;
import com.example.datn_f5_store.repository.IChiTietHoaDonRepository;
import com.example.datn_f5_store.repository.IChiTietSanPhamRepository;
import com.example.datn_f5_store.repository.IGioHangRepository;
import com.example.datn_f5_store.repository.IHoaDonRepository;
import com.example.datn_f5_store.repository.IKhachHangRepository;
import com.example.datn_f5_store.repository.ILichSuHoaDonRepository;
import com.example.datn_f5_store.repository.INhanVienRepository;
import com.example.datn_f5_store.repository.IThanhToanRepository;
import com.example.datn_f5_store.repository.IVoucherRepository;
import com.example.datn_f5_store.request.ChiTietGioHangRequest;
import com.example.datn_f5_store.request.GioHangRequest;
import com.example.datn_f5_store.request.HoaDonRequest;
import com.example.datn_f5_store.request.ThanhToanRequest;
import com.example.datn_f5_store.response.DataResponse;
import com.example.datn_f5_store.response.ResultModel;
import com.example.datn_f5_store.service.IHoaDonService;
import com.example.datn_f5_store.service.client.ThanhToanClientService;
import com.example.datn_f5_store.service.sendEmail.SendEmailService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Date;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ThanhToanClientServiceImpl implements ThanhToanClientService {
    @Autowired
    private IGioHangRepository gioHangRepository;
    @Autowired
    private IHoaDonRepository hoaDonRepository;
    @Autowired
    private IChiTietHoaDonRepository chiTietHoaDonRepository;
    @Autowired
    private IChiTietGioHangRepository chiTietGioHangRepository;
    @Autowired
    private IKhachHangRepository khachHangRepository;
    @Autowired
    private INhanVienRepository nhanVienRepository;
    @Autowired
    private IVoucherRepository voucherRepository;
    @Autowired
    private IThanhToanRepository thanhToanRepository;
    @Autowired
    private IChiTietSanPhamRepository chiTietSanPhamRepository;
    @Autowired
    private ILichSuHoaDonRepository lichSuHoaDonRepository;
    @Autowired
    private IHoaDonService hoaDonService;
    @Autowired
    private SendEmailService sendEmailService;

    @Override
    public DataResponse luuGioHang(List<ChiTietGioHangRequest> requests) {
        try {
            // Chuyển đổi từ DTO (ChiTietGioHangRequest) sang Entity (ChiTietGioHangEntity)
            List<ChiTietGioHangEntity> chiTietGioHangEntities = requests.stream().map(request -> {
                ChiTietGioHangEntity entity = new ChiTietGioHangEntity();
                ChiTietSanPhamEntity chiTietSanPham = chiTietSanPhamRepository.findById(request.getIdChiTietSanPham()).orElse(null);
                entity.setChiTietSanPham(chiTietSanPham);
                entity.setSoLuong(request.getSoLuong());
                return entity;
            }).collect(Collectors.toList());

            // Lưu danh sách vào cơ sở dữ liệu
            List<ChiTietGioHangEntity> savedEntities = chiTietGioHangRepository.saveAll(chiTietGioHangEntities);

            // Trả về phản hồi thành công
            return new DataResponse(true, new ResultModel<>(null, "thành công!"));
        } catch (Exception e) {
            e.printStackTrace();
            // Trả về phản hồi thất bại
            return new DataResponse(true, new ResultModel<>(null, "thất bại!"));
        }
    }

    @Override
    @Transactional
    public DataResponse thanhToan(ThanhToanRequest request) {
        // Tạo hóa đơn
        HoaDonEntity hoaDon = new HoaDonEntity();
        KhachHangEntity khachHang = khachHangRepository.findById(request.getHoaDonRequest().getIdKhachHang()).orElse(null);
        hoaDon.setKhachHang(khachHang);
        NhanVienEntity nhanVien = nhanVienRepository.findById(request.getHoaDonRequest().getIdNhanVien()).orElse(null);
        hoaDon.setNhanVien(nhanVien);
        if (request.getHoaDonRequest().getIdVoucher() != null) {
            VoucherEntity voucher = voucherRepository.findById(request.getHoaDonRequest().getIdVoucher()).orElse(null);
            hoaDon.setVoucher(voucher);
        }
        PhuongThucThanhToanEntity thanhToan = thanhToanRepository.findById(request.getHoaDonRequest().getIdThanhToan()).orElse(null);
        hoaDon.setMa(this.generateMaHoaDon());
        hoaDon.setThanhToan(thanhToan);
        hoaDon.setHinhThucThanhToan(request.getHoaDonRequest().getHinhThucThanhToan());
        hoaDon.setTongTienBanDau(request.getHoaDonRequest().getTongTienBanDau());
        hoaDon.setPhiShip(request.getHoaDonRequest().getPhiShip());
        hoaDon.setTongTienSauVoucher(request.getHoaDonRequest().getTongTienSauVoucher());
        hoaDon.setTenNguoiNhan(request.getHoaDonRequest().getTenNguoiNhan());
        hoaDon.setSdtNguoiNhan(request.getHoaDonRequest().getSdtNguoiNhan());
        hoaDon.setEmailNguoiNhan(request.getHoaDonRequest().getEmailNguoiNhan());
        hoaDon.setDiaChiNhanHang(request.getHoaDonRequest().getDiaChiNhanHang());
        hoaDon.setNgayNhanDuKien(new Date());
        hoaDon.setThoiGianTao(new Date());
        hoaDon.setGiaoHang(request.getHoaDonRequest().getGiaoHang());
        hoaDon.setGhiChu(request.getHoaDonRequest().getGhiChu());
        hoaDon.setTrangThai("Chờ xác nhận");
        hoaDon.setGiaTriGiam(request.getHoaDonRequest().getGiaTriGiam());
        hoaDon = hoaDonRepository.save(hoaDon);

        // Lấy danh sách chi tiết giỏ hàng được chọn
        List<ChiTietGioHangEntity> selectedChiTietGioHang = chiTietGioHangRepository.findByIdIn(request.getIdChiTietGioHang());

        // Chuyển chi tiết giỏ hàng sang hóa đơn chi tiết
        for (ChiTietGioHangEntity chiTiet : selectedChiTietGioHang) {
            ChiTietHoaDonEntity hoaDonChiTiet = new ChiTietHoaDonEntity();
            hoaDonChiTiet.setHoaDon(hoaDon);
            hoaDonChiTiet.setChiTietSanPham(chiTiet.getChiTietSanPham());
            hoaDonChiTiet.setMa(this.generateMaHoaDon());
            hoaDonChiTiet.setSoLuong(chiTiet.getSoLuong());
            hoaDonChiTiet.setGiaSpctHienTai(chiTiet.getSoLuong() * chiTiet.getChiTietSanPham().getDonGia()); // Giá sản phẩm hiện tại
            hoaDonChiTiet.setTrangThai("Thành công");
            chiTietHoaDonRepository.save(hoaDonChiTiet);
        }

        // Xóa các chi tiết giỏ hàng đã thanh toán
        chiTietGioHangRepository.deleteAll(selectedChiTietGioHang);

        return new DataResponse(true, new ResultModel<>(null, "Thanh toán thành công!"));
    }

    @Override
    @Transactional
    public DataResponse xuLyGioHangVaThanhToan(List<ChiTietGioHangRequest> gioHangRequests, ThanhToanRequest thanhToanRequest) {
        try {
            // 1. Nếu có danh sách chi tiết giỏ hàng, lưu vào cơ sở dữ liệu
            if (gioHangRequests != null && !gioHangRequests.isEmpty()) {
                List<ChiTietGioHangEntity> chiTietGioHangEntities = gioHangRequests.stream().map(request -> {
                    // Tìm chi tiết giỏ hàng hiện có theo ID từ request
                    ChiTietGioHangEntity entityOld = chiTietGioHangRepository.findById(request.getId()).orElse(null);

                    ChiTietGioHangEntity entity;

                    if (entityOld == null) {
                        // Nếu không tìm thấy, tạo mới entity
                        entity = new ChiTietGioHangEntity();
                        ChiTietSanPhamEntity chiTietSanPham = chiTietSanPhamRepository.findById(request.getIdChiTietSanPham()).orElse(null);
                        entity.setChiTietSanPham(chiTietSanPham);
                        entity.setSoLuong(request.getSoLuong());
                    } else {
                        // Nếu đã tồn tại, cập nhật entity hiện có
                        entity = entityOld;
                        ChiTietSanPhamEntity chiTietSanPham = chiTietSanPhamRepository.findById(request.getIdChiTietSanPham()).orElse(null);
                        entity.setChiTietSanPham(chiTietSanPham); // Cập nhật thông tin sản phẩm chi tiết
                        entity.setSoLuong(request.getSoLuong());  // Cập nhật số lượng
                    }

                    System.out.println("Chi tiết giỏ hàng trước khi lưu: " + entity);
                    return entity;
                }).collect(Collectors.toList());

                // Lưu danh sách chi tiết giỏ hàng vào DB
                List<ChiTietGioHangEntity> savedEntities = chiTietGioHangRepository.saveAll(chiTietGioHangEntities);

                // Lấy ID của các chi tiết giỏ hàng đã lưu
                List<Integer> savedIds = savedEntities.stream()
                        .map(ChiTietGioHangEntity::getId)
                        .collect(Collectors.toList());

                // Set các ID chi tiết giỏ hàng vào trong ThanhToanRequest
                thanhToanRequest.setIdChiTietGioHang(savedIds);
            }


            // 2. Thực hiện logic thanh toán như cũ
            HoaDonEntity hoaDon = new HoaDonEntity();
            KhachHangEntity khachHang = khachHangRepository.findById(thanhToanRequest.getHoaDonRequest().getIdKhachHang()).orElse(null);
            hoaDon.setKhachHang(khachHang);
            NhanVienEntity nhanVien = nhanVienRepository.findById(thanhToanRequest.getHoaDonRequest().getIdNhanVien()).orElse(null);
            hoaDon.setNhanVien(nhanVien);
            if (thanhToanRequest.getHoaDonRequest().getIdVoucher() != null) {
                VoucherEntity voucher = voucherRepository.findById(thanhToanRequest.getHoaDonRequest().getIdVoucher()).orElse(null);
                hoaDon.setVoucher(voucher);
                voucher.setSoLuong(voucher.getSoLuong()-1);
                voucherRepository.save(voucher);
            }
            PhuongThucThanhToanEntity thanhToan = thanhToanRepository.findById(thanhToanRequest.getHoaDonRequest().getIdThanhToan()).orElse(null);
            hoaDon.setMa(this.generateMaHoaDon());
            hoaDon.setThanhToan(thanhToan);
            hoaDon.setHinhThucThanhToan(thanhToanRequest.getHoaDonRequest().getHinhThucThanhToan());
            hoaDon.setTongTienBanDau(thanhToanRequest.getHoaDonRequest().getTongTienBanDau());
            hoaDon.setPhiShip(thanhToanRequest.getHoaDonRequest().getPhiShip());
            hoaDon.setTongTienSauVoucher(thanhToanRequest.getHoaDonRequest().getTongTienSauVoucher());
            hoaDon.setTenNguoiNhan(thanhToanRequest.getHoaDonRequest().getTenNguoiNhan());
            hoaDon.setSdtNguoiNhan(thanhToanRequest.getHoaDonRequest().getSdtNguoiNhan());
            hoaDon.setEmailNguoiNhan(thanhToanRequest.getHoaDonRequest().getEmailNguoiNhan());
            hoaDon.setDiaChiNhanHang(thanhToanRequest.getHoaDonRequest().getDiaChiNhanHang());
            hoaDon.setNgayNhanDuKien(new Date());
            hoaDon.setThoiGianTao(new Date());
            hoaDon.setGiaoHang(thanhToanRequest.getHoaDonRequest().getGiaoHang());
            hoaDon.setGhiChu(thanhToanRequest.getHoaDonRequest().getGhiChu());
            if(thanhToanRequest.getHoaDonRequest().getIdThanhToan()==1){
                hoaDon.setTrangThai("Đã xác nhận");
            }else {
                hoaDon.setTrangThai("Chờ xác nhận");
            }
            hoaDon.setGiaTriGiam(thanhToanRequest.getHoaDonRequest().getGiaTriGiam());
            HoaDonEntity hoaDon1 = hoaDonRepository.save(hoaDon);

            // 3. Xử lý chi tiết giỏ hàng và thêm vào hóa đơn chi tiết
            List<ChiTietGioHangEntity> selectedChiTietGioHang = chiTietGioHangRepository.findByIdIn(thanhToanRequest.getIdChiTietGioHang());
            for (ChiTietGioHangEntity chiTiet : selectedChiTietGioHang) {
                ChiTietHoaDonEntity hoaDonChiTiet = new ChiTietHoaDonEntity();
                hoaDonChiTiet.setHoaDon(hoaDon1);
                hoaDonChiTiet.setChiTietSanPham(chiTiet.getChiTietSanPham());
                hoaDonChiTiet.setMa(this.generateMaHoaDon());
                hoaDonChiTiet.setSoLuong(chiTiet.getSoLuong());
                hoaDonChiTiet.setGiaSpctHienTai(chiTiet.getSoLuong() * chiTiet.getChiTietSanPham().getDonGia());
                hoaDonChiTiet.setTrangThai("Thành công");
                chiTietHoaDonRepository.save(hoaDonChiTiet);

                if (thanhToanRequest.getHoaDonRequest().getIdThanhToan() == 2) {
                    // 4. Trừ số lượng sản phẩm trong ChiTietSanPhamEntity sau khi thanh toán
                    ChiTietSanPhamEntity chiTietSanPham = chiTiet.getChiTietSanPham();
                    if (chiTietSanPham != null) {
                        int soLuongConLai = chiTietSanPham.getSoLuong() - chiTiet.getSoLuong();
                        chiTietSanPham.setSoLuong(soLuongConLai);
                        chiTietSanPhamRepository.save(chiTietSanPham);  // Lưu lại đối tượng đã cập nhật
                    }
                }
            }

            // Lưu lịch sử hóa đơn vào cơ sở dữ liệu
            LichSuHoaDonEntity lichSuHoaDon = new LichSuHoaDonEntity();
            lichSuHoaDon.setHoaDon(hoaDon1);
            lichSuHoaDon.setNhanVien(hoaDon1.getNhanVien());
            lichSuHoaDon.setTrangThaiCu(null);
            lichSuHoaDon.setTrangThaiMoi(hoaDon1.getTrangThai());
            lichSuHoaDon.setThoiGianThucHien(hoaDon1.getThoiGianTao());
            lichSuHoaDon.setLoaiThayDoi("Thanh toán");
            lichSuHoaDonRepository.save(lichSuHoaDon);

            // 5. Xóa chi tiết giỏ hàng sau thanh toán
            chiTietGioHangRepository.deleteAll(selectedChiTietGioHang);

            // 6. Gửi email cảm ơn khi thanh toán thành công
            String emailNguoiNhan = hoaDon1.getEmailNguoiNhan(); // Lấy email người nhận
            String maHoaDon = hoaDon1.getMa(); // Lấy mã hóa đơn
            sendEmailService.sendSimpleEmailCamOn(emailNguoiNhan, maHoaDon);

            return new DataResponse(true, new ResultModel<>(null, "Xử lý giỏ hàng và thanh toán thành công!"));
        } catch (Exception e) {
            e.printStackTrace();
            return new DataResponse(false, new ResultModel<>(null, "Xử lý giỏ hàng hoặc thanh toán thất bại!"));
        }
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
