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

        if (request.getSdt() == null || !request.getSdt().matches("^\\d{10,11}$")) {
            throw new IllegalArgumentException("Số điện thoại không hợp lệ");
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
    public DataResponse updateAnh(Integer id, KhachHangRequest request) {
        // Tìm kiếm khách hàng theo ID
        KhachHangEntity khachHang = khachHangRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Khách hàng không tồn tại"));

        // Thực hiện kiểm tra hợp lệ (validation)
        validateKhachHangRequest(request);

        // Cập nhật thông tin cho đối tượng khách hàng đã tìm thấy
        khachHang.setAnh(request.getAnh());
        khachHang.setTen(request.getTen());
        khachHang.setGioiTinh(request.getGioiTinh());
        khachHang.setNgayThangNamSinh(request.getNgayThangNamSinh());
        khachHang.setEmail(request.getEmail());
        khachHang.setSdt(request.getSdt());
        khachHang.setTrangThai(request.getTrangThai());

        // Lưu lại đối tượng đã được cập nhật
        khachHangRepository.save(khachHang);

        return new DataResponse(true, new ResultModel<>(null, "Update thành công"));
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

    // Phương thức cập nhật thông tin khách hàng
    @Override
    public KhachHangEntity updateKhachHang(Integer id, KhachHangEntity khachHang) {
        // Kiểm tra xem khách hàng có tồn tại trong cơ sở dữ liệu không
        if (khachHangRepository.existsById(id)) {
            // Lấy thông tin khách hàng từ cơ sở dữ liệu
            KhachHangEntity existingKhachHang = khachHangRepository.findById(id).orElse(null);

            // Nếu khách hàng tồn tại, tiến hành cập nhật các trường thông tin
            if (existingKhachHang != null) {
                existingKhachHang.setMa(khachHang.getMa());
                existingKhachHang.setTen(khachHang.getTen());
                existingKhachHang.setGioiTinh(khachHang.getGioiTinh());
                existingKhachHang.setNgayThangNamSinh(khachHang.getNgayThangNamSinh());
                existingKhachHang.setEmail(khachHang.getEmail());
                existingKhachHang.setAnh(khachHang.getAnh());
                existingKhachHang.setSdt(khachHang.getSdt());
                existingKhachHang.setRoles(khachHang.getRoles());
                existingKhachHang.setUserName(khachHang.getUserName());
                existingKhachHang.setPassword(khachHang.getPassword());
                existingKhachHang.setTrangThai(khachHang.getTrangThai());

                // Lưu khách hàng đã được cập nhật
                return khachHangRepository.save(existingKhachHang);
            }
        }
        return null; // Nếu không tìm thấy khách hàng, trả về null
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
}
