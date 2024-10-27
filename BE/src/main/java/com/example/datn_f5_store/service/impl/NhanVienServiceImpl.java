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

    @Override
    public Page<NhanVienDto> getAll(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<NhanVienEntity> nhanVienPage = nhanVienRepo.findAll(pageable);

        //chuyen doi tu NhanVienEntity sang NhanVienDto su dung phuong thuc map cua page
        return nhanVienPage.map(entity -> new NhanVienDto(
                entity.getId(),
                entity.getMa(),
                entity.getTen(),
                entity.getGioiTinh(),
                entity.getNgayThangNamSinh(),
                entity.getEmail(),
                entity.getSdt(),
                entity.getDiaChi(),
                entity.getAnh(),
                entity.getUsername(),
                entity.getPassword(),
                entity.getNguoiTao(),
                entity.getThoiGianTao(),
                entity.getNguoiSua(),
                entity.getThoiGianSua(),
                entity.getTrangThai()
        ));
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
        //Kiem tra du lieu dau vao
        if (!this.checkNhanVien(request)){
            //check trung ma nhan vien
            if (!this.checkDuplicate(request)){
                request.setMa(this.generateMaNhanVien());
                request.setUsername(request.getEmail());
                request.setPassword(this.generatePassword());
                //luu hoac cap nhat nhan vien
                DataResponse response = this.saveOfUpdate(new NhanVienEntity(), request);
                if(response.isStatus()){
                    String toEmail = request.getEmail();
                    String username = request.getUsername();
                    String password = request.getPassword();
                    sendEmailService.sendSimpleEmail(toEmail,username,password);
                    return response;
                }else {
                    return  response;
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
        //Kiem tra du lieu dau vao
        if (!this.checkNhanVien(nhanVienRequest)){
            //Tim nhan vien theo id
            NhanVienEntity nhanVien = nhanVienRepo.findById(id).orElse(null);
            if (nhanVien == null) {
                return new DataResponse(false, new ResultModel<>(null, "Nhân viên không tồn tại"));
            }

            nhanVienRequest.setNguoiSua("admin");
            nhanVienRequest.setThoiGianSua(new Date());
            //luu hoac cap nhat nhan vien
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

    //check trung lap ma nhan vien
    private boolean checkDuplicate(NhanVienRequest request){
        boolean check = false;
        List<NhanVienEntity> nhanVien = nhanVienRepo.findAll();
        //kiem tra ma nhan vien co trung lap hay khong
        for (NhanVienEntity e : nhanVien) {
            if (e.getMa().equals(request.getMa())){
                return true;
            }
        }
        return check;
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
        entity.setUsername(request.getUsername());
        entity.setPassword(request.getPassword());
        entity.setNguoiTao("admin");
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

