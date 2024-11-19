package com.example.datn_f5_store.service.client.impl;

import com.example.datn_f5_store.entity.DiaChiKhachHangEntity;
import com.example.datn_f5_store.entity.GioHangEntity;
import com.example.datn_f5_store.entity.KhachHangEntity;
import com.example.datn_f5_store.entity.NhanVienEntity;
import com.example.datn_f5_store.repository.IDiaChiKhachHangRepository;
import com.example.datn_f5_store.repository.IGioHangRepository;
import com.example.datn_f5_store.repository.IKhachHangRepository;
import com.example.datn_f5_store.repository.INhanVienRepository;
import com.example.datn_f5_store.request.DiaChiKhachHangResquest;
import com.example.datn_f5_store.request.KhachHangRequest;
import com.example.datn_f5_store.response.DataResponse;
import com.example.datn_f5_store.response.ResultModel;
import com.example.datn_f5_store.service.NhanVienService;
import com.example.datn_f5_store.service.client.UserClientService;
import com.example.datn_f5_store.service.sendEmail.SendEmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Date;
import java.util.List;
import java.util.UUID;

@Service
public class UserClientServiceImpl implements UserClientService {
    @Autowired
    private IKhachHangRepository khachHangRepository;
    @Autowired
    private IDiaChiKhachHangRepository diaChiKhachHangRepository;
    @Autowired
    private SendEmailService sendEmailService;
    @Autowired
    private IGioHangRepository gioHangRepository;
    @Override
    public DataResponse loginClient(String username, String password) {
        KhachHangEntity khachHang = khachHangRepository.findByUserNameAndPassword(username,password);
        if(khachHang!=null) {
            GioHangEntity gioHangEntity = gioHangRepository.findByKhachHang_Id(khachHang.getId());
            // Nếu khách hàng chưa có giỏ hàng, tạo mới giỏ hàng
            if (gioHangEntity == null) {
                gioHangEntity = new GioHangEntity();
                gioHangEntity.setKhachHang(khachHang);
                gioHangEntity.setThoiGianTao(new Date());
                gioHangRepository.save(gioHangEntity); // Lưu giỏ hàng mới
            }
            return new DataResponse(true,new ResultModel<>(null,khachHang));
        }else {
            throw new RuntimeException("Tài khoản hoặc mật khẩu không đúng!");
        }
    }

    @Override
    public DataResponse registerClient(KhachHangRequest request) {
        // Kiểm tra xem email đã tồn tại chưa
        if (khachHangRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email đã tồn tại!");
        }

        // Kiểm tra xem số điện thoại đã tồn tại chưa
        if (khachHangRepository.existsBySdt(request.getSdt())) {
            throw new RuntimeException("Số điện thoại đã tồn tại!");
        }
        // Validate request
        validateKhachHangRequest(request);

        // Tạo đối tượng khách hàng nếu validation thành công
        KhachHangEntity entity = new KhachHangEntity();
        entity.setAnh(request.getAnh());
        request.setMa(this.generateMaNhanVien());
        entity.setMa(request.getMa());
        entity.setTen(request.getTen());
        entity.setGioiTinh(request.getGioiTinh());
        entity.setNgayThangNamSinh(request.getNgayThangNamSinh());
        entity.setEmail(request.getEmail());
        entity.setSdt(request.getSdt());
        entity.setRoles("CUSTOMER");
        entity.setUserName(request.getEmail());
        entity.setPassword(this.generatePassword());
        entity.setTrangThai("Đang hoạt động");
        KhachHangEntity savedEntity = khachHangRepository.save(entity);
        GioHangEntity gioHangEntity = new GioHangEntity();
        gioHangEntity.setKhachHang(savedEntity);
        gioHangEntity.setThoiGianTao(new Date());
        gioHangRepository.save(gioHangEntity);

        // Gửi email thông báo đăng ký thành công và mật khẩu
        sendEmailService.sendSimpleEmail(request.getEmail(), request.getEmail(), savedEntity.getPassword());
        return new DataResponse(true, new ResultModel<>(null, "Đăng ký thành công!"));
    }

    @Override
    public DataResponse detailclient(Integer id) {
        KhachHangEntity khachHang = khachHangRepository.findById(id).orElseThrow(()->new RuntimeException("khách hàng không tồn tại"));
        return new DataResponse(true,new ResultModel<>(null,khachHang));
    }

    @Override
    public DataResponse createDiaChiClient(DiaChiKhachHangResquest request) {
        // Validate request
        validateDiaChiKhachHangRequest(request);

        // Tìm khách hàng theo ID
        KhachHangEntity khachHang = khachHangRepository.findById(request.getIdKhachHang())
                .orElseThrow(() -> new RuntimeException("Khách hàng không tồn tại"));

        // Tạo đối tượng địa chỉ khách hàng mới nếu validation thành công
        DiaChiKhachHangEntity diaChi = new DiaChiKhachHangEntity();
        diaChi.setKhackHang(khachHang);
        diaChi.setSoNha(request.getSoNha());
        diaChi.setDuong(request.getDuong());
        diaChi.setPhuongXa(request.getPhuongXa());
        diaChi.setQuanHuyen(request.getQuanHuyen());
        diaChi.setTinhThanh(request.getTinhThanh());
        diaChi.setQuocGia(request.getQuocGia());
        diaChi.setTrangThai("Còn sử dụng");
        diaChiKhachHangRepository.save(diaChi);
        return new DataResponse(true, new ResultModel<>(null, "Thêm địa chỉ thành công"));
    }

    private void validateDiaChiKhachHangRequest(DiaChiKhachHangResquest request) {
        if (request.getIdKhachHang() == null) {
            throw new IllegalArgumentException("ID khách hàng không được để trống");
        }

        if (request.getSoNha() == null || request.getSoNha().isEmpty()) {
            throw new IllegalArgumentException("Số nhà không được để trống");
        }

        if (request.getDuong() == null || request.getDuong().isEmpty()) {
            throw new IllegalArgumentException("Đường không được để trống");
        }

        if (request.getPhuongXa() == null || request.getPhuongXa().isEmpty()) {
            throw new IllegalArgumentException("Phường/Xã không được để trống");
        }

        if (request.getQuanHuyen() == null || request.getQuanHuyen().isEmpty()) {
            throw new IllegalArgumentException("Quận/Huyện không được để trống");
        }

        if (request.getTinhThanh() == null || request.getTinhThanh().isEmpty()) {
            throw new IllegalArgumentException("Tỉnh/Thành phố không được để trống");
        }

        if (request.getQuocGia() == null || request.getQuocGia().isEmpty()) {
            throw new IllegalArgumentException("Quốc gia không được để trống");
        }
    }


    @Override
    public DataResponse updateAnh(Integer id,KhachHangRequest request) {
        KhachHangEntity khachHang = khachHangRepository.findById(id).orElseThrow(()->new RuntimeException("khách hàng không tồn tại"));
        validateKhachHangRequest(request);

        // Tạo đối tượng khách hàng nếu validation thành công
        KhachHangEntity entity = new KhachHangEntity();
        khachHang.setAnh(request.getAnh());
        entity.setTen(request.getTen());
        entity.setGioiTinh(request.getGioiTinh());
        entity.setNgayThangNamSinh(request.getNgayThangNamSinh());
        entity.setEmail(request.getEmail());
        entity.setSdt(request.getSdt());
        entity.setTrangThai(request.getTrangThai());
        khachHangRepository.save(entity);
        return new DataResponse(true,new ResultModel<>(null,"update thành công"));
    }

    @Override
    public DataResponse changePassword(String username, String passwordOld, String passwordNew) {
        KhachHangEntity entity = khachHangRepository.findByUserNameAndPassword(username,passwordOld);
        if(entity==null) {
            throw new RuntimeException("Vui lòng kiểm tra lại tên đăng nhập hoặc mật khẩu cũ!");
        }else {
            entity.setPassword(passwordNew);
            khachHangRepository.save(entity);
            return new DataResponse(true,new ResultModel<>(null,"Đổi mật khẩu thành công!"));
        }
    }

    @Override
    public DataResponse detailDiaChi(Integer id) {
        DiaChiKhachHangEntity diaChiKhachHang = diaChiKhachHangRepository.findById(id).orElseThrow(
                ()->new RuntimeException("Địa chỉ không tồn tại")
        );
        return new DataResponse(true,new ResultModel<>(null,diaChiKhachHang));
    }

    @Override
    public DataResponse getDiaChiByKhachHang(Integer id) {
        List<DiaChiKhachHangEntity> listDiaChi = diaChiKhachHangRepository.findByKhackHang_Id(id);
        return new DataResponse(true,new ResultModel<>(null,listDiaChi));
    }

    private void validateKhachHangRequest(KhachHangRequest request) {
        if (request.getTen() == null || request.getTen().isEmpty()) {
            throw new IllegalArgumentException("Tên không được để trống");
        }

        if (request.getNgayThangNamSinh() == null) {
            throw new IllegalArgumentException("Ngày sinh không được để trống");
        }

        if (request.getEmail() == null || !request.getEmail().matches("^[A-Za-z0-9+_.-]+@(.+)$")) {
            throw new IllegalArgumentException("Email không hợp lệ");
        }

        if (request.getSdt() == null || !request.getSdt().matches("^\\d{10,11}$")) {
            throw new IllegalArgumentException("Số điện thoại không hợp lệ");
        }
    }


    public String generatePassword() {
        LocalDateTime now = LocalDateTime.now();
        DateTimeFormatter dateTimeFormatter = DateTimeFormatter.ofPattern("mmss");
        String timeFormat = now.format(dateTimeFormatter);
        String uuidPart = UUID.randomUUID().toString().substring(0, 5);
        return uuidPart + timeFormat;
    }
    public String generateMaNhanVien() {
        LocalDateTime now = LocalDateTime.now();
        DateTimeFormatter dateTimeFormatter = DateTimeFormatter.ofPattern("mmss");
        String timeFormat = now.format(dateTimeFormatter);
        String uuidPart = UUID.randomUUID().toString().substring(0, 2);
        return "NV"+ uuidPart + timeFormat;
    }




    @Override
    public DataResponse updateDiaChiClient(DiaChiKhachHangResquest request) {
        // Validate request
        validateDiaChiKhachHangRequest(request);

        // Tìm địa chỉ khách hàng theo ID
        DiaChiKhachHangEntity diaChi = diaChiKhachHangRepository.findById(request.getId())
                .orElseThrow(() -> new RuntimeException("Địa chỉ không tồn tại"));

        // Tìm khách hàng theo ID từ request (nếu cần cập nhật khách hàng liên quan)
        if (request.getIdKhachHang() != null) {
            KhachHangEntity khachHang = khachHangRepository.findById(request.getIdKhachHang())
                    .orElseThrow(() -> new RuntimeException("Khách hàng không tồn tại"));
            diaChi.setKhackHang(khachHang);
        }

        // Cập nhật thông tin địa chỉ
        if (request.getSoNha() != null) diaChi.setSoNha(request.getSoNha());
        if (request.getDuong() != null) diaChi.setDuong(request.getDuong());
        if (request.getPhuongXa() != null) diaChi.setPhuongXa(request.getPhuongXa());
        if (request.getQuanHuyen() != null) diaChi.setQuanHuyen(request.getQuanHuyen());
        if (request.getTinhThanh() != null) diaChi.setTinhThanh(request.getTinhThanh());
        if (request.getQuocGia() != null) diaChi.setQuocGia(request.getQuocGia());
        if (request.getTrangThai() != null) diaChi.setTrangThai(request.getTrangThai());

        // Lưu thay đổi
        diaChiKhachHangRepository.save(diaChi);
        return new DataResponse(true, new ResultModel<>(null, "Cập nhật địa chỉ thành công"));
    }

}
