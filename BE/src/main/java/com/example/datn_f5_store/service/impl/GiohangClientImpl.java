package com.example.datn_f5_store.service.impl;

import com.example.datn_f5_store.dto.ChiTietGioHangDto;
import com.example.datn_f5_store.dto.GioHangDto;
import com.example.datn_f5_store.entity.ChiTietGioHangEntity;
import com.example.datn_f5_store.entity.ChiTietSanPhamEntity;
import com.example.datn_f5_store.entity.GioHangEntity;
import com.example.datn_f5_store.entity.KhachHangEntity;
import com.example.datn_f5_store.repository.IAnhChiTietSanPhamRepository;
import com.example.datn_f5_store.repository.IChiTietGioHangRepository;
import com.example.datn_f5_store.repository.IChiTietSanPhamRepository;
import com.example.datn_f5_store.repository.IDiaChiKhachHangRepository;
import com.example.datn_f5_store.repository.IGioHangRepository;
import com.example.datn_f5_store.repository.IKhachHangRepository;
import com.example.datn_f5_store.request.ChiTietGioHangRequest;
import com.example.datn_f5_store.request.KhachHangRequest;
import com.example.datn_f5_store.response.DataResponse;
import com.example.datn_f5_store.response.ResultModel;
import com.example.datn_f5_store.service.IGioHangClientService;
import com.example.datn_f5_store.service.sendEmail.SendEmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class GiohangClientImpl implements IGioHangClientService {


    @Autowired
    private IChiTietGioHangRepository repohgct; // Repository cho ChiTietGioHangEntity

    @Autowired
    private IGioHangRepository repohg;

    @Autowired
    private IChiTietSanPhamRepository repoCTSP;

    @Autowired
    private IKhachHangRepository khachHangRepository;
    @Autowired
    private IDiaChiKhachHangRepository diaChiKhachHangRepository;
    @Autowired
    private SendEmailService sendEmailService;
    @Autowired
    private IGioHangRepository gioHangRepository;



    @Override
    public ChiTietGioHangEntity addOrUpdateChiTietGioHang(ChiTietGioHangRequest chiTietGioHangRequest) {
        ChiTietSanPhamEntity chiTietSanPham = repoCTSP.findById(chiTietGioHangRequest.getIdChiTietSanPham()).get();

        // Kiểm tra số lượng sản phẩm trong kho
        if (chiTietGioHangRequest.getSoLuong() > chiTietSanPham.getSoLuong()) {
            throw new IllegalArgumentException("Số lượng sản phẩm yêu cầu không được lớn hơn số lượng có trong kho.");
        }

        ChiTietGioHangEntity existingChiTietGioHang = repohgct.findByGioHangAndChiTietSanPham(
                repohg.findById(chiTietGioHangRequest.getIdGioHang()).get(),
                chiTietSanPham
        );
        if (existingChiTietGioHang != null) {
            // Kiểm tra số lượng mới yêu cầu không vượt quá số lượng trong kho
            int soLuongMoi = chiTietGioHangRequest.getSoLuong();  // Sử dụng số lượng mới mà người dùng nhập

            // Kiểm tra tổng số lượng không vượt quá số lượng trong kho
            if (soLuongMoi > chiTietSanPham.getSoLuong()) {

                throw new IllegalArgumentException("Số lượng sản phẩm trong giỏ hàng không được lớn hơn số lượng có trong kho.");
            }
            existingChiTietGioHang.setSoLuong(soLuongMoi);  // Cập nhật lại số lượng giỏ hàng với số lượng mới
            return repohgct.save(existingChiTietGioHang); // Gọi save cho ChiTietGioHangEntity

        } else {
            // Nếu chưa có sản phẩm trong giỏ hàng, thêm sản phẩm vào giỏ với số lượng yêu cầu
            ChiTietGioHangEntity chiTietGioHangEntity = new ChiTietGioHangEntity();
            chiTietGioHangEntity.setGioHang(repohg.findById(chiTietGioHangRequest.getIdGioHang()).get());
            chiTietGioHangEntity.setChiTietSanPham(chiTietSanPham);
            chiTietGioHangEntity.setSoLuong(chiTietGioHangRequest.getSoLuong());  // Cập nhật số lượng từ yêu cầu

            return repohgct.save(chiTietGioHangEntity); // Gọi save cho ChiTietGioHangEntity
        }
    }

    @Override
    public ChiTietGioHangEntity addOrUpdateChiTietGioHang2(ChiTietGioHangRequest chiTietGioHangRequest) {
        ChiTietSanPhamEntity chiTietSanPham = repoCTSP.findById(chiTietGioHangRequest.getIdChiTietSanPham()).get();

        // Kiểm tra số lượng sản phẩm trong kho
        if (chiTietGioHangRequest.getSoLuong() > chiTietSanPham.getSoLuong()) {
            throw new IllegalArgumentException("Số lượng sản phẩm yêu cầu không được lớn hơn số lượng có trong kho.");
        }

        ChiTietGioHangEntity existingChiTietGioHang = repohgct.findByGioHangAndChiTietSanPham(
                repohg.findById(chiTietGioHangRequest.getIdGioHang()).get(),
                chiTietSanPham
        );

        if (existingChiTietGioHang != null) {
            // Cộng thêm số lượng sản phẩm vào giỏ hàng hiện có
            int soLuongMoi = existingChiTietGioHang.getSoLuong() + chiTietGioHangRequest.getSoLuong();

            // Kiểm tra số lượng không vượt quá số lượng trong kho
            if (soLuongMoi > chiTietSanPham.getSoLuong()) {
                throw new IllegalArgumentException("Số lượng sản phẩm trong giỏ hàng không được lớn hơn số lượng có trong kho.");
            }
            existingChiTietGioHang.setSoLuong(soLuongMoi);  // Cập nhật số lượng mới cho giỏ hàng
            return repohgct.save(existingChiTietGioHang); // Lưu vào cơ sở dữ liệu

        } else {
            // Nếu chưa có sản phẩm trong giỏ hàng, thêm sản phẩm mới vào giỏ với số lượng yêu cầu
            ChiTietGioHangEntity chiTietGioHangEntity = new ChiTietGioHangEntity();
            chiTietGioHangEntity.setGioHang(repohg.findById(chiTietGioHangRequest.getIdGioHang()).get());
            chiTietGioHangEntity.setChiTietSanPham(chiTietSanPham);
            chiTietGioHangEntity.setSoLuong(chiTietGioHangRequest.getSoLuong());  // Cập nhật số lượng mới

            return repohgct.save(chiTietGioHangEntity); // Gọi save cho ChiTietGioHangEntity
        }
    }


    @Override
    public Page<ChiTietGioHangDto> findByGioHang(int page,int size,Integer idgh) {
        Pageable pageable = PageRequest.of(page, size);


        Page<ChiTietGioHangEntity> chiTietGioHangEntities = repohgct.findByIdGioHang(pageable,idgh);


        List<ChiTietGioHangDto> dtoList = chiTietGioHangEntities.getContent().stream()
                .map(ChiTietGioHang -> new ChiTietGioHangDto(
                        ChiTietGioHang.getId(),
                        ChiTietGioHang.getGioHang(),
                        ChiTietGioHang.getChiTietSanPham(),
                        ChiTietGioHang.getSoLuong()
                ))
                .collect(Collectors.toList());


        return new PageImpl<>(dtoList, pageable, chiTietGioHangEntities.getTotalElements());
    }

    @Override
    public Page<GioHangDto> findByKhachHang(int page, int size, Integer idkh) {
        Pageable pageable = PageRequest.of(page, size);

        Page<GioHangEntity> gioHangEntities = repohg.findByIdKhachHang(pageable,idkh);

        List<GioHangDto> dtoList = gioHangEntities.getContent().stream()
                .map(ChiTietGioHang -> new GioHangDto(
                        ChiTietGioHang.getId(),
                        ChiTietGioHang.getKhachHang(),
                        ChiTietGioHang.getThoiGianTao()

                ))
                .collect(Collectors.toList());
        return new PageImpl<>(dtoList, pageable, gioHangEntities.getTotalElements());
    }

    @Override
    public KhachHangEntity registerClientGh() {

        KhachHangEntity entity = new KhachHangEntity();
        entity.setMa("KHVL");
        entity.setTen("Khách vãng lai");
        entity.setRoles("CUSTOMER");
        entity.setTrangThai("Đang hoạt động");
        KhachHangEntity savedEntity = khachHangRepository.save(entity);
        GioHangEntity gioHangEntity = new GioHangEntity();
        gioHangEntity.setKhachHang(savedEntity);
        gioHangEntity.setThoiGianTao(new Date());
        gioHangRepository.save(gioHangEntity);

        return savedEntity;
    }

}
