package com.example.datn_f5_store.service.impl;

import com.example.datn_f5_store.dto.KhachHangDto;
import com.example.datn_f5_store.entity.KhachHangEntity;
import com.example.datn_f5_store.repository.IKhachHangRepository;
import com.example.datn_f5_store.request.KhachHangRequest;
import com.example.datn_f5_store.response.DataResponse;
import com.example.datn_f5_store.response.ResultModel;
import com.example.datn_f5_store.service.KhachHangService;
import com.example.datn_f5_store.service.sendEmail.SendEmailService;
import org.apache.coyote.BadRequestException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Calendar;
import java.util.Date;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;
import java.util.Random;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class KhachHangServiceImpl implements KhachHangService {

    @Autowired
    private IKhachHangRepository khachHangRepository;
    @Autowired
    private SendEmailService sendEmailService;


    @Override
    public Page<KhachHangDto> getAllKhachHang(int page, int size, String search) {
        Pageable pageable = PageRequest.of(page, size);
        Page<KhachHangEntity> khachHangPage;

        // Tìm kiếm khách hàng theo tên, số điện thoại, email, hoặc mã
        if (search != null && !search.trim().isEmpty()) {
            khachHangPage = khachHangRepository.findBySearch(search, pageable);
        } else {
            khachHangPage = khachHangRepository.findAll(pageable);
        }
        return khachHangPage.map(khachHangEntity -> new KhachHangDto(
                khachHangEntity.getId(),
                khachHangEntity.getMa(),
                khachHangEntity.getTen(),
                khachHangEntity.getGioiTinh(),
                khachHangEntity.getNgayThangNamSinh(),
                khachHangEntity.getEmail(),
                khachHangEntity.getAnh(),
                khachHangEntity.getSdt(),
                khachHangEntity.getUserName(),
                khachHangEntity.getPassword(),
                khachHangEntity.getRoles(),
                khachHangEntity.getTrangThai()
        ));
    }

    @Override
    public DataResponse addKhachHang(KhachHangRequest khachHangRequest) throws BadRequestException {
        // Kiểm tra mã, số điện thoại, email, và username
        if (khachHangRepository.existsByMa(khachHangRequest.getMa())) {
            throw new BadRequestException("Mã khách hàng đã tồn tại, không thể thêm mới!");
        }
        if (khachHangRepository.existsBySdt(khachHangRequest.getSdt())) {
            throw new BadRequestException("Số điện thoại đã tồn tại, không thể thêm mới!");
        }
        if (khachHangRepository.existsByEmail(khachHangRequest.getEmail())) {
            throw new BadRequestException("Email đã tồn tại, không thể thêm mới!");
        }

        String username;
        String password;
        try {
            username = khachHangRequest.getEmail();
            password = khachHangRequest.getPassword();
            KhachHangEntity khachHang = new KhachHangEntity();
            khachHang.setMa(generateMaKhachHang());
            khachHang.setTen(khachHangRequest.getTen());
            khachHang.setGioiTinh(khachHangRequest.getGioiTinh());
            khachHang.setNgayThangNamSinh(khachHangRequest.getNgayThangNamSinh());
            khachHang.setEmail(khachHangRequest.getEmail());
            khachHang.setSdt(khachHangRequest.getSdt());
            khachHang.setRoles(khachHangRequest.getRoles());
            khachHang.setAnh(khachHangRequest.getAnh());
            khachHang.setUserName(username);
            khachHang.setPassword(password);
            khachHang.setTrangThai("Đang hoạt động");

            // Lưu khách hàng vào database
            khachHangRepository.save(khachHang);
            // Gửi email thông báo

            DataResponse emailResponse = sendEmailService.sendSimpleEmail(khachHangRequest.getEmail(), username, password);

            // Kiểm tra phản hồi từ việc gửi email
            if (!emailResponse.isStatus()) {
                return new DataResponse(false, new ResultModel<>(null, "Tạo khách hàng thành công nhưng gửi email thất bại: " + emailResponse.getResult()));
            }

            return new DataResponse(true, new ResultModel<>(null, "Tạo khách hàng thành công và đã gửi email"));
        } catch (Exception e) {
            e.printStackTrace();
            return new DataResponse(false, new ResultModel<>(null, "Lỗi trong quá trình tạo khách hàng"));
        }
    }


    @Override
    public DataResponse create(KhachHangRequest request) throws BadRequestException{
        // Kiểm tra sự tồn tại của email
        if (khachHangRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email đã tồn tại");
        }
        // Kiểm tra sự tồn tại của số điện thoại
        if (khachHangRepository.existsBySdt(request.getSdt())) {
            throw new BadRequestException("Số điện thoại đã tồn tại");
        }
        String username = request.getEmail();
        String password = this.generatePassword();
        // Tạo mã khách hàng
        var ma = this.generateMaKhachHang();
        KhachHangEntity khachHang = new KhachHangEntity();
        khachHang.setMa(ma);
        khachHang.setTen(request.getTen());
        khachHang.setGioiTinh(request.getGioiTinh());
        khachHang.setNgayThangNamSinh(request.getNgayThangNamSinh());
        khachHang.setEmail(request.getEmail());
        khachHang.setAnh(request.getAnh());
        khachHang.setSdt(request.getSdt());
        khachHang.setRoles("CUSTOMER");
        khachHang.setUserName(username);
        khachHang.setPassword(password);
        khachHang.setTrangThai("Đang hoạt động");
        // Lưu khách hàng vào database
        khachHangRepository.save(khachHang);
        request.setUserName(request.getEmail());
        // Gửi email thông báo

        DataResponse emailResponse = sendEmailService.sendSimpleEmail(request.getEmail(), username, password);

        // Kiểm tra phản hồi từ việc gửi email
        if (!emailResponse.isStatus()) {
            return new DataResponse(false, new ResultModel<>(null, "Tạo khách hàng thành công nhưng gửi email thất bại: " + emailResponse.getResult()));
        }

        return new DataResponse(true, new ResultModel<>(null, "Tạo khách hàng thành công và đã gửi email")
        );
    }

    private int hamTinhTuoi(Date birthDate) {
        Calendar birthCal = Calendar.getInstance();
        birthCal.setTime(birthDate);

        Calendar todayCal = Calendar.getInstance();
        int age = todayCal.get(Calendar.YEAR) - birthCal.get(Calendar.YEAR);

        // Kiểm tra nếu ngày sinh chưa đến trong năm hiện tại
        if (todayCal.get(Calendar.DAY_OF_YEAR) < birthCal.get(Calendar.DAY_OF_YEAR)) {
            age--;
        }
        // Nguyễn Ngọc Hiển
        return age;
    }
    private void validateNgaySinh(Date ngaySinh) {
        Date ngayHienTai = new Date(); // Dùng để lấy ngày hiện tại
        if (ngaySinh.after(ngayHienTai)) {
            throw new RuntimeException("Ngày sinh phải là ngày hiện tại");
        }
    }


    // Phương thức để sinh mã khách hàng
    private String generateMaKhachHang() {
        // Chữ cái đầu tiên
        char letter = (char) ('A' + new Random().nextInt(26)); // Sinh một chữ cái ngẫu nhiên từ A-Z

        // Sinh 5 chữ số ngẫu nhiên
        StringBuilder numberPart = new StringBuilder();
        for (int i = 0; i < 5; i++) {
            numberPart.append(new Random().nextInt(10)); // Sinh số từ 0-9
        }

        // Kết hợp chữ cái và số
        return letter + numberPart.toString();
    }

    @Override
    public DataResponse updateKhachHang(Integer id, KhachHangRequest khachHangRequest) throws BadRequestException {
        Optional<KhachHangEntity> kiemTraTonTaiKhachHang = khachHangRepository.findById(id);
        if (kiemTraTonTaiKhachHang.isPresent()) {
            KhachHangEntity khachHang = kiemTraTonTaiKhachHang.get();
//
//            if (khachHangRepository.existsByEmail(khachHangRequest.getEmail())) {
//                throw new BadRequestException("Email đã tồn tại");
//            }
//            // Kiểm tra sự tồn tại của số điện thoại
//            if (khachHangRepository.existsBySdt(khachHangRequest.getSdt())) {
//                throw new BadRequestException("Số điện thoại đã tồn tại");
//            }

            // Cập nhật thông tin khách hàng mà không làm các kiểm tra khác
            try {
                khachHang.setMa(khachHangRequest.getMa());
                khachHang.setTen(khachHangRequest.getTen());
                khachHang.setGioiTinh(khachHangRequest.getGioiTinh());
                khachHang.setNgayThangNamSinh(khachHangRequest.getNgayThangNamSinh());
                khachHang.setEmail(khachHangRequest.getEmail());
                khachHang.setAnh(khachHangRequest.getAnh());
                khachHang.setSdt(khachHangRequest.getSdt());
                khachHang.setUserName(khachHangRequest.getUserName());
                khachHang.setPassword(khachHangRequest.getPassword());
                khachHang.setRoles(khachHangRequest.getRoles());
                khachHang.setTrangThai(khachHangRequest.getTrangThai());

                khachHangRepository.save(khachHang);
                return new DataResponse(true, new ResultModel<>(null, "Cập nhật khách hàng thành công"));
            } catch (Exception e) {
                e.printStackTrace();
                return new DataResponse(false, new ResultModel<>(null, "Cập nhật khách hàng thất bại"));
            }
        } else {
            throw new BadRequestException("Khách hàng không tồn tại");
        }
    }



    @Override
    public List<KhachHangEntity> searchKhachHang(String name, String email, String sdt) {
        return khachHangRepository.findByNameOrEmailOrSdt(name, email, sdt);
    }

    @Override
    public List<KhachHangDto> getAllKhachHangKhongPhanTrang(String search) {
        List<KhachHangEntity> listKhachHang;
        if(search==null){
            listKhachHang = khachHangRepository.findAll(); // Lấy tất cả khách hàng
        }else {
            listKhachHang = khachHangRepository.getAll(search);
        }
        return listKhachHang.stream()
                .filter(khachHang -> khachHang.getId()!=1)
                .filter(khachHang->"Đang hoạt động".equals(khachHang.getTrangThai()))
                .map(entity->new KhachHangDto(
                        entity.getId(),
                        entity.getMa(),
                        entity.getTen(),
                        entity.getGioiTinh(),
                        entity.getNgayThangNamSinh(),
                        entity.getEmail(),
                        entity.getAnh(),
                        entity.getSdt(),
                        entity.getUserName(),
                        entity.getPassword(),
                        entity.getRoles(),
                        entity.getTrangThai()
                )).collect(Collectors.toList());
    }

    @Override
    public Page<KhachHangDto> findByTenContainingOrMaContainingOrEmailContainingOrSdtContaining(int page, int size, String ten, String ma, String email, String sdt) {
        Pageable pageable = PageRequest.of(page, size);
        Page<KhachHangEntity> khachHangEntityPage;

        if (ten == null || ma == null || email == null || sdt == null) {
            khachHangEntityPage = khachHangRepository.findAll(pageable);
        } else {
            khachHangEntityPage = khachHangRepository.findByTenContainingOrMaContainingOrEmailContainingOrSdtContaining(ten, ma, email, sdt, pageable);
        }
        return khachHangEntityPage.map(khachHangEntity -> new KhachHangDto(
                khachHangEntity.getId(),
                khachHangEntity.getMa(),
                khachHangEntity.getTen(),
                khachHangEntity.getGioiTinh(),
                khachHangEntity.getNgayThangNamSinh(),
                khachHangEntity.getEmail(),
                khachHangEntity.getAnh(),
                khachHangEntity.getSdt(),
                khachHangEntity.getUserName(),
                khachHangEntity.getPassword(),
                khachHangEntity.getRoles(),
                khachHangEntity.getTrangThai()
        ));
    }

    @Override
    public DataResponse updateTrangThai(Integer id) {
        KhachHangEntity khachHang = khachHangRepository.findById(id).orElse(null);
        if(khachHang.getTrangThai().equals("Không hoạt động")){
            khachHang.setTrangThai("Đang hoạt động");
        }else if(khachHang.getTrangThai().equals("Đang hoạt động")){
            khachHang.setTrangThai("Không hoạt động");
        }
        khachHangRepository.save(khachHang);
        return new DataResponse(true,new ResultModel<>(null,khachHang)) ;
    }

    @Override
    public List<KhachHangDto> getByTrangThai() {
        List<KhachHangEntity> khachHangEntities = khachHangRepository.findByTrangThai("Đang hoạt động");
        return khachHangEntities.stream()
                .map(entity -> new KhachHangDto(
                        entity.getId(),
                        entity.getMa(),
                        entity.getTen(),
                        entity.getGioiTinh(),
                        entity.getNgayThangNamSinh(),
                        entity.getEmail(),
                        entity.getAnh(),
                        entity.getSdt(),
                        entity.getUserName(),
                        entity.getPassword(),
                        entity.getRoles(),
                        entity.getTrangThai()
                )).collect(Collectors.toList());
    }

    @Override
    public KhachHangEntity detail(Integer id) {
        KhachHangEntity khachHang = khachHangRepository.findById(id).orElse(null);
        return khachHang;
    }
    public String generatePassword() {
        LocalDateTime now = LocalDateTime.now();
        DateTimeFormatter dateTimeFormatter = DateTimeFormatter.ofPattern("mmss");
        String timeFormat = now.format(dateTimeFormatter);
        String uuidPart = UUID.randomUUID().toString().substring(0, 5);
        return uuidPart + timeFormat;
    }
}


