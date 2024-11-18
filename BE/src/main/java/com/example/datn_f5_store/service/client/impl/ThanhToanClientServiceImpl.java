package com.example.datn_f5_store.service.client.impl;

import com.example.datn_f5_store.entity.ChiTietGioHangEntity;
import com.example.datn_f5_store.entity.ChiTietHoaDonEntity;
import com.example.datn_f5_store.entity.ChiTietSanPhamEntity;
import com.example.datn_f5_store.entity.GioHangEntity;
import com.example.datn_f5_store.entity.HoaDonEntity;
import com.example.datn_f5_store.entity.KhachHangEntity;
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

    @Override
    public DataResponse luuGioHang(List<GioHangRequest> gioHangRequestList) {

        return null;
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
