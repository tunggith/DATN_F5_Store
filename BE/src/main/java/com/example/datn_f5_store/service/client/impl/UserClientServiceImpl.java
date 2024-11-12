package com.example.datn_f5_store.service.client.impl;

import com.example.datn_f5_store.entity.DiaChiKhachHangEntity;
import com.example.datn_f5_store.entity.KhachHangEntity;
import com.example.datn_f5_store.entity.NhanVienEntity;
import com.example.datn_f5_store.repository.IDiaChiKhachHangRepository;
import com.example.datn_f5_store.repository.IKhachHangRepository;
import com.example.datn_f5_store.repository.INhanVienRepository;
import com.example.datn_f5_store.request.DiaChiKhachHangResquest;
import com.example.datn_f5_store.request.KhachHangRequest;
import com.example.datn_f5_store.response.DataResponse;
import com.example.datn_f5_store.response.ResultModel;
import com.example.datn_f5_store.service.NhanVienService;
import com.example.datn_f5_store.service.client.UserClientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;

@Service
public class UserClientServiceImpl implements UserClientService {
    @Autowired
    private IKhachHangRepository khachHangRepository;
    @Autowired
    private IDiaChiKhachHangRepository diaChiKhachHangRepository;
    @Override
    public DataResponse loginClient(String username, String password) {
        KhachHangEntity khachHang = khachHangRepository.findByUserNameAndPassword(username,password);
        if(khachHang!=null) {
            return new DataResponse(true,new ResultModel<>(null,khachHang));
        }else {
            throw new RuntimeException("Tài khoản hoặc mật khẩu không đúng!");
        }
    }

    @Override
    public DataResponse registerClient(KhachHangRequest request) {
        // Validate request
        validateKhachHangRequest(request);

        // Tạo đối tượng khách hàng nếu validation thành công
        KhachHangEntity entity = new KhachHangEntity();
        entity.setMa(this.generateMaNhanVien());
        entity.setTen(request.getTen());
        entity.setGioiTinh(request.getGioiTinh());
        entity.setNgayThangNamSinh(request.getNgayThangNamSinh());
        entity.setEmail(request.getEmail());
        entity.setSdt(request.getSdt());
        entity.setRoles("CUSTOMER");
        entity.setUserName(request.getUserName());
        entity.setPassword(this.generatePassword());
        entity.setTrangThai("Đang hoạt động");

        khachHangRepository.save(entity);
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

        if (request.getGioiTinh() == null ||
                (!request.getGioiTinh().equalsIgnoreCase("Nam") && !request.getGioiTinh().equalsIgnoreCase("Nữ"))) {
            throw new IllegalArgumentException("Giới tính không hợp lệ");
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

        if (request.getUserName() == null || request.getUserName().isEmpty()) {
            throw new IllegalArgumentException("Tên đăng nhập không được để trống");
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
