package com.example.datn_f5_store.service.impl;

import com.example.datn_f5_store.dto.NhanVienDto;
import com.example.datn_f5_store.entity.NhanVienEntity;
import com.example.datn_f5_store.repository.INhanVienRepository;
import com.example.datn_f5_store.request.NhanVienRequest;
import com.example.datn_f5_store.response.DataResponse;
import com.example.datn_f5_store.response.ResultModel;
import com.example.datn_f5_store.service.NhanVienService;
import com.example.datn_f5_store.service.sendEmail.SendEmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Date;
import java.util.List;
import java.util.UUID;

@Service
public class NhanVienServiceImpl implements NhanVienService {

    //Inject cac respository can thiet cho nhan vien
    @Autowired
    private INhanVienRepository nhanVienRepo;
    @Autowired
    private SendEmailService sendEmailService;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Override
    public Page<NhanVienDto> getAll(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return nhanVienRepo.getAll(pageable);
    }

    //Tim san pham theo ten hoac ma voi phan trang
    @Override
    public Page<NhanVienDto> findByTenOrMa(int page, int size, String ten, String ma) {
        Pageable pageable = PageRequest.of(page, size);
        Page<NhanVienEntity> nhanVienEntityPage;
        //Neu ten va ma = null, lay tat ca san pham
        if (ten == null && ma == null) {
            nhanVienEntityPage = nhanVienRepo.findAll(pageable);
        } else {
            //Neu co ten hoac ma, tim theo ten hoac ma
            nhanVienEntityPage = nhanVienRepo.getByTenContainingOrMaContaining(ten, ma, pageable);
        }
        //chuyen doi tu NhanVienEntity sang NhanVienDto
        return nhanVienEntityPage.map(entity -> new NhanVienDto(
                entity.getId(),
                entity.getMa(),
                entity.getTen(),
                entity.getGioiTinh(),
                entity.getNgayThangNamSinh(),
                entity.getEmail(),
                entity.getSdt(),
                entity.getDiaChi(),
                entity.getAnh(),
                entity.getRoles(),
                entity.getUsername(),
                entity.getPassword(),
                entity.getNguoiTao(),
                entity.getThoiGianTao(),
                entity.getNguoiSua(),
                entity.getThoiGianSua(),
                entity.getTrangThai()
        ));
    }

    @Override
    public DataResponse create(NhanVienRequest request) {
        // Kiểm tra dữ liệu đầu vào
        if (!this.checkNhanVien(request)) {
            // Kiểm tra trùng mã nhân viên
            if (!this.checkDuplicate(request)) {
                // Tạo mã nhân viên và thông tin tài khoản
                request.setMa(this.generateMaNhanVien());
                request.setUsername(request.getEmail());

                // Tạo mật khẩu ban đầu và mã hóa trước khi lưu
                String rawPassword = this.generatePassword();
                String encodedPassword = passwordEncoder.encode(rawPassword);
                request.setPassword(encodedPassword);

                // Lưu hoặc cập nhật nhân viên
                DataResponse response = this.saveOfUpdate(new NhanVienEntity(), request);
                if (response.isStatus()) {
                    // Gửi email với thông tin tài khoản và mật khẩu không mã hóa
                    String toEmail = request.getEmail();
                    String username = request.getUsername();
                    sendEmailService.sendSimpleEmail(toEmail, username, rawPassword);
                    return response;
                } else {
                    return response;
                }
            } else {
                return new DataResponse(false, new ResultModel<>(null, "Mã nhân viên đã tồn tại!"));
            }
        } else {
            return new DataResponse(false, new ResultModel<>(null, "Dữ liệu đầu vào lỗi!"));
        }
    }


    //Phuong thuc cap nhat nhan vien
    @Override
    public DataResponse update(NhanVienRequest nhanVienRequest, Integer id) {
        // Kiểm tra dữ liệu đầu vào
        if (!this.checkNhanVien(nhanVienRequest)){
            // Tìm nhân viên theo ID
            NhanVienEntity nhanVien = nhanVienRepo.findById(id).orElse(null);
            if (nhanVien == null) {
                return new DataResponse(false, new ResultModel<>(null, "Nhân viên không tồn tại"));
            }

            // Kiểm tra trùng lặp với các nhân viên khác (trừ nhân viên hiện tại)
            List<NhanVienEntity> nhanVienList = nhanVienRepo.findAll();
            for (NhanVienEntity e : nhanVienList) {
                if (!e.getId().equals(id) &&
                        (e.getMa().equals(nhanVienRequest.getMa()) ||
                                e.getEmail().equals(nhanVienRequest.getEmail()) ||
                                e.getSdt().equals(nhanVienRequest.getSdt()))) {
                    return new DataResponse(false, new ResultModel<>(null, "Mã, email hoặc số điện thoại đã tồn tại!"));
                }
            }

            nhanVienRequest.setNguoiSua("ADMIN");
            nhanVienRequest.setThoiGianSua(new Date());

            // Lưu hoặc cập nhật nhân viên
            return this.saveOfUpdate(nhanVien, nhanVienRequest);
        } else {
            return new DataResponse(false, new ResultModel<>(null, "Lỗi dữ liệu đầu vào"));
        }
    }


    @Override
    public DataResponse delete(Integer id) {
        if (nhanVienRepo.existsById(id)) {  // Sử dụng nhanVienRepo thay vì nhanVienRepository
            nhanVienRepo.deleteById(id);
            return new DataResponse(true, new ResultModel<>(null, "Xóa nhân viên thành công")); // Cập nhật để dùng ResultModel
        }
        return new DataResponse(false, new ResultModel<>(null, "Nhân viên không tồn tại")); // Cập nhật để dùng ResultModel
    }

    @Override
    public NhanVienEntity detail(Integer id) {
        NhanVienEntity nhanVien = nhanVienRepo.findById(id).orElse(null);
        return nhanVien;
    }

    @Override
    public NhanVienEntity findByUserName(String username) {
        NhanVienEntity nhanVien = nhanVienRepo.findByUsername(username);
        return nhanVien;
    }


    //phuong thuc luu va update nhan vien
    private DataResponse saveOfUpdate(NhanVienEntity entity, NhanVienRequest request) {
        try {
            //luu san pham vao db
            this.convertNhanVien(entity, request);
            nhanVienRepo.save(entity);
            return new DataResponse(true, new ResultModel<>(null, "Thành công"));
        } catch (Exception e) {
            e.printStackTrace();
            return new DataResponse(false, new ResultModel<>(null, "Lỗi trong quá trình lưu/cập nhật"));
        }
    }

    //kiem tra dau vao
    private boolean checkNhanVien(NhanVienRequest request){
        boolean check = false;
        //kiem tra ma nhan vien
        if (request.getMa() == null || request.getTen().isEmpty()){
            check = true;
        }
        return check;
    }

    // Kiểm tra trùng lặp mã, email và số điện thoại
    private boolean checkDuplicate(NhanVienRequest request){
        List<NhanVienEntity> nhanVien = nhanVienRepo.findAll();

        // Kiểm tra mã, email và số điện thoại có trùng lặp hay không
        for (NhanVienEntity e : nhanVien) {
            if (e.getMa().equals(request.getMa()) ||
                    e.getEmail().equals(request.getEmail()) ||
                    e.getSdt().equals(request.getSdt())) {
                return true;
            }
        }
        return false;
    }


    private void convertNhanVien(NhanVienEntity entity, NhanVienRequest request) {
        // Chỉ set ID nếu entity mới được tạo (ID = null)
        if (entity.getId() == null) {
            entity.setId(request.getId());  // Đảm bảo chỉ set ID cho entity mới
        }
        entity.setMa(request.getMa());
        entity.setTen(request.getTen());
        entity.setGioiTinh(request.getGioiTinh());
        entity.setNgayThangNamSinh(request.getNgayThangNamSinh());
        entity.setEmail(request.getEmail());
        entity.setSdt(request.getSdt());
        entity.setDiaChi(request.getDiaChi());
        entity.setAnh(request.getAnh());
        entity.setRoles("USER");
        entity.setUsername(request.getUsername());
        entity.setPassword(request.getPassword());
        entity.setNguoiTao("ADMIN");
        entity.setThoiGianTao(new Date());
        entity.setNguoiSua(request.getNguoiSua());
        entity.setThoiGianSua(request.getThoiGianSua());
        entity.setTrangThai(request.getTrangThai());
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

