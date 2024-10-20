package com.example.datn_f5_store.service.impl;

import com.example.datn_f5_store.dto.KhachHangDto;
import com.example.datn_f5_store.entity.KhachHangEntity;
import com.example.datn_f5_store.repository.IKhachHangRepository;
import com.example.datn_f5_store.request.KhachHangRequest;
import com.example.datn_f5_store.response.DataResponse;
import com.example.datn_f5_store.response.ResultModel;
import com.example.datn_f5_store.service.KhachHangService;
import org.apache.coyote.BadRequestException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.Random;
import java.util.stream.Collectors;

@Service
public class KhachHangServiceImpl implements KhachHangService {

    @Autowired
    private IKhachHangRepository khachHangRepository;


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
                khachHangEntity.getTrangThai()
        ));
    }

    @Override
    public Boolean addKhachHang(KhachHangRequest khachHangRequest) {
        // Kiểm tra mã, số điện thoại, email, và username
        if (khachHangRepository.existsByMa(khachHangRequest.getMa())) {
            System.out.println("Mã khách hàng đã tồn tại, không thể thêm mới!");
            return false;
        }
        if (khachHangRepository.existsBySdt(khachHangRequest.getSdt())) {
            System.out.println("Số điện thoại đã tồn tại, không thể thêm mới!");
            return false;
        }
        if (khachHangRepository.existsByEmail(khachHangRequest.getEmail())) {
            System.out.println("Email đã tồn tại, không thể thêm mới!");
            return false;
        }
        if (khachHangRepository.existsByUserName(khachHangRequest.getUserName())) {
            System.out.println("Username đã tồn tại, không thể thêm mới!");
            return false;
        }
        if (!khachHangRequest.getEmail().endsWith("@gmail.com")) {
            System.out.println("Email phải có đuôi @gmail.com");
            return false;
        }

        try {
            KhachHangEntity khachHang = new KhachHangEntity();
            khachHang.setMa(generateMaKhachHang());
            khachHang.setTen(khachHangRequest.getTen());
            khachHang.setGioiTinh(khachHangRequest.getGioiTinh());
            khachHang.setNgayThangNamSinh(khachHangRequest.getNgayThangNamSinh());
            khachHang.setEmail(khachHangRequest.getEmail());
            khachHang.setSdt(khachHangRequest.getSdt());
            khachHang.setUserName(khachHangRequest.getUserName());
            khachHang.setPassword(khachHangRequest.getPassword());
            khachHang.setTrangThai("Đang hoạt động");

            khachHangRepository.save(khachHang);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    @Override
    public DataResponse create(KhachHangRequest request) throws BadRequestException {
        // Validate dữ liệu
        if (request.getTen() == null || request.getTen().isEmpty()) {
            throw new BadRequestException("Tên khách hàng không được để trống");
        }
        if (request.getNgayThangNamSinh() == null) {
            throw new BadRequestException("Ngày sinh không được để trống");
        }
        if (request.getEmail() == null || !request.getEmail().matches("^[A-Za-z0-9+_.-]+@(.+)$")) {
            throw new BadRequestException("Email không hợp lệ");
        }
        if (request.getSdt() == null || !request.getSdt().matches("^\\d{10}$")) {
            throw new BadRequestException("Số điện thoại không hợp lệ, phải có 10 chữ số");
        }
        var ma = this.generateCustomerCode();
        KhachHangEntity khachHang = new KhachHangEntity();
        khachHang.setMa(ma);
        khachHang.setTen(request.getTen());
        khachHang.setGioiTinh(request.getGioiTinh());
        khachHang.setNgayThangNamSinh(request.getNgayThangNamSinh());
        khachHang.setEmail(request.getEmail());
        khachHang.setSdt(request.getSdt());
        khachHangRepository.save(khachHang);
        return new DataResponse(true,new ResultModel<>(null,"create khach hang successfull"));
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
    public Boolean updateKhachHang(Integer id, KhachHangRequest khachHangRequest) {
        Optional<KhachHangEntity> kiemTraTonTaiKhachHang = khachHangRepository.findById(id);
        if (kiemTraTonTaiKhachHang.isPresent()) {
            KhachHangEntity khachHang = kiemTraTonTaiKhachHang.get();

            if (!khachHangRequest.getEmail().endsWith("@gmail.com")) {
                System.out.println("Email phải có đuôi @gmail.com");
                return false;
            }

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
                khachHang.setTrangThai(khachHangRequest.getTrangThai());

                khachHangRepository.save(khachHang);
                return true;
            } catch (Exception e) {
                e.printStackTrace();
                return false;
            }
        } else {
            return false;
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
                khachHangEntity.getTrangThai()
        ));
    }

    @Override
    public DataResponse updateTrangThai(Integer id) {
        KhachHangEntity khachHang = khachHangRepository.findById(id).orElse(null);
        if(khachHang.getTrangThai().equals("không hoạt động")){
            khachHang.setTrangThai("đang hoạt động");
        }else if(khachHang.getTrangThai().equals("đang hoạt động")){
            khachHang.setTrangThai("không hoạt động");
        }
        khachHangRepository.save(khachHang);
        return new DataResponse(true,new ResultModel<>(null,khachHang)) ;
    }

    public String generateCustomerCode() {
        // Lấy khách hàng cuối cùng trong cơ sở dữ liệu (giả sử khách hàng có cột mã là 'ma')
        KhachHangEntity lastCustomer = khachHangRepository.findTopByOrderByIdDesc(); // Giả sử lấy khách hàng theo ID giảm dần

        if (lastCustomer != null && lastCustomer.getMa() != null) {
            String lastCode = lastCustomer.getMa();
            // Tách số từ mã khách hàng (giả sử mã có định dạng KHXXX)
            int numberPart = Integer.parseInt(lastCode.substring(2));
            String newCode = String.format("KH%03d", numberPart + 1); // Tăng số lên 1 và format với 3 chữ số
            return newCode;
        } else {
            // Nếu chưa có khách hàng nào, trả về mã khách hàng đầu tiên
            return "KH001";
        }
    }

}


