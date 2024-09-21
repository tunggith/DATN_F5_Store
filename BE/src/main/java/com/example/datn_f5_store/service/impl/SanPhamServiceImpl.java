package com.example.datn_f5_store.service.impl;

import com.example.datn_f5_store.Response.DataResponse;
import com.example.datn_f5_store.Response.ResultModel;
import com.example.datn_f5_store.dto.SanPhamDto;
import com.example.datn_f5_store.entity.ChatLieuEntity;
import com.example.datn_f5_store.entity.SanPhamEntity;
import com.example.datn_f5_store.entity.ThuongHieuEntity;
import com.example.datn_f5_store.entity.XuatXuEntity;
import com.example.datn_f5_store.repository.IChatLieuRepository;
import com.example.datn_f5_store.repository.ISanPhamRepository;
import com.example.datn_f5_store.repository.IThuongHieuRepository;
import com.example.datn_f5_store.repository.IXuatXuRepository;
import com.example.datn_f5_store.request.ChatLieuRequest;
import com.example.datn_f5_store.request.SanPhamRequest;
import com.example.datn_f5_store.request.ThuongHieuRequest;
import com.example.datn_f5_store.request.XuatXuRequest;
import com.example.datn_f5_store.service.SanPhamService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.ArrayList;


@Service
public class SanPhamServiceImpl implements SanPhamService {
    @Autowired
    private ISanPhamRepository sanPhamRepo;
    @Autowired
    private IXuatXuRepository xuatXuRepo;
    @Autowired
    private IThuongHieuRepository thuongHieuRepo;
    @Autowired
    private IChatLieuRepository chatLieuRepo;
    @Override
    public Page<SanPhamDto> getAll(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<SanPhamEntity> sanPhamPage = sanPhamRepo.findAll(pageable);

        // Sử dụng phương thức map của Page để chuyển đổi từ SanPhamEntity sang SanPhamDto
        Page<SanPhamDto> sanPhamDtos = sanPhamPage.map(entity -> new SanPhamDto(
                entity.getId(),
                entity.getMa(),
                entity.getTen(),
                entity.getXuatXu(),
                entity.getThuongHieu(),
                entity.getChatLieu(),
                entity.getTrangThai()
        ));
        return sanPhamDtos;
    }

    @Override
    public Page<SanPhamDto> findByTenOrMa(int page, int size,String ten, String ma) {
        Pageable pageable = PageRequest.of(page,size);
        Page<SanPhamEntity> sanPhamPage;
        if(ten==null&&ma==null) {
            sanPhamPage = sanPhamRepo.findAll(pageable);
        }else {
            sanPhamPage = sanPhamRepo.getByTenContainingOrMaContaining(ten, ma, pageable);
        }
        Page<SanPhamDto> sanPhamDtos = sanPhamPage.map(entity -> new SanPhamDto(
                entity.getId(),
                entity.getMa(),
                entity.getTen(),
                entity.getXuatXu(),
                entity.getThuongHieu(),
                entity.getChatLieu(),
                entity.getTrangThai()
        ));
        return sanPhamDtos;
    }
    @Override
    public DataResponse create(SanPhamRequest sanPhamRequest) {
        return this.saveOfUpdate(new SanPhamEntity(),sanPhamRequest);
    }
    @Override
    public DataResponse update(SanPhamRequest sanPhamRequest, Integer id) {
        SanPhamEntity sanPham = sanPhamRepo.findById(id).orElse(null);
        if(sanPham==null){
            return new DataResponse(false,new ResultModel<>(null,"sản phẩm không tồn tại"));
        }
        return this.saveOfUpdate(sanPham,sanPhamRequest);
    }

    private DataResponse saveOfUpdate(SanPhamEntity entity,SanPhamRequest request){
        try {
            this.convertSanPham(entity, request);
            sanPhamRepo.save(entity);
            return new DataResponse(true, new ResultModel<>(null, "create of update succesfully!"));
        }catch (Exception e) {
            e.printStackTrace();
            return new DataResponse(false,new ResultModel<>(null,"create of update exception"));
        }
    }
    private void convertSanPham(SanPhamEntity entity,SanPhamRequest request){
        entity.setId(request.getId());
        entity.setMa(request.getMa());
        entity.setTen(request.getTen());
        XuatXuEntity xuatXu = xuatXuRepo.findById(request.getXuatXu().getId()).orElse(null);
        entity.setXuatXu(xuatXu);
        ThuongHieuEntity thuongHieu = thuongHieuRepo.findById(request.getThuongHieu().getId()).orElse(null);
        entity.setThuongHieu(thuongHieu);
        ChatLieuEntity chatLieu = chatLieuRepo.findById(request.getChatLieu().getId()).orElse(null);
        entity.setChatLieu(chatLieu);
    }
    private void convertXuatXu(XuatXuEntity entity,XuatXuRequest request){
        entity.setId(request.getId());
        entity.setMa(request.getMa());
        entity.setTen(request.getTen());
    }
    private void convertThuongHieu(ThuongHieuEntity entity, ThuongHieuRequest request){
        entity.setId(request.getId());
        entity.setMa(request.getMa());
        entity.setTen(request.getTen());
    }
    private void convertChatLieu(ChatLieuEntity entity, ChatLieuRequest request){
        entity.setId(request.getId());
        entity.setMa(request.getMa());
        entity.setTen(request.getTen());
    }

}
