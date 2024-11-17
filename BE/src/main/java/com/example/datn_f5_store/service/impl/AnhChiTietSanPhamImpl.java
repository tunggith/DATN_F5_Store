package com.example.datn_f5_store.service.impl;

import com.example.datn_f5_store.dto.AnhChiTietSanPhamDto;
import com.example.datn_f5_store.entity.AnhChiTietSanPham;
import com.example.datn_f5_store.entity.ChiTietSanPhamEntity;
import com.example.datn_f5_store.repository.IAnhChiTietSanPhamRepository;
import com.example.datn_f5_store.repository.IChiTietSanPhamRepository;
import com.example.datn_f5_store.request.AnhChiTietSanPhamRequest;
import com.example.datn_f5_store.response.DataResponse;
import com.example.datn_f5_store.response.ResultModel;
import com.example.datn_f5_store.service.IAnhChiTietSanPhamService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AnhChiTietSanPhamImpl implements IAnhChiTietSanPhamService {
    @Autowired
    private IAnhChiTietSanPhamRepository anhChiTietSanPhamRepository;
    @Autowired
    private IChiTietSanPhamRepository chiTietSanPhamRepository;
    @Override
    public Page<AnhChiTietSanPhamDto> getBySanPham(Integer page, Integer size, Integer id) {
        Pageable pageable = PageRequest.of(page,size);
        Page<AnhChiTietSanPham> anh = anhChiTietSanPhamRepository.findByChiTietSanPham_Id(id,pageable);
        return anh.map(entity->new AnhChiTietSanPhamDto(
                entity.getId(),
                entity.getChiTietSanPham(),
                entity.getUrlAnh()
        ));
    }

    @Override
    public DataResponse create(AnhChiTietSanPhamRequest request) {
        return this.createOfUpdate(new AnhChiTietSanPham(),request);
    }

    @Override
    public DataResponse update(Integer id, AnhChiTietSanPhamRequest request) {
        AnhChiTietSanPham entity = anhChiTietSanPhamRepository.findById(id).orElse(null);
        request.setId(id);
        return this.createOfUpdate(entity,request);
    }

    @Override
    public AnhChiTietSanPham detail(Integer id) {
        AnhChiTietSanPham entity = anhChiTietSanPhamRepository.findById(id).orElse(null);
        return entity;
    }

    @Override
    public DataResponse removeAnh(Integer id) {
        // Kiểm tra xem thực thể có tồn tại không trước khi xóa
        Optional<AnhChiTietSanPham> entityOptional = anhChiTietSanPhamRepository.findById(id);

        // Nếu tồn tại, xóa thực thể
        if (entityOptional.isPresent()) {
            anhChiTietSanPhamRepository.deleteById(id);
            return new DataResponse(true, new ResultModel<>(null, "xóa thành công"));
        } else {
            return new DataResponse(false, null); // Trả về status lỗi
        }
    }





    private DataResponse createOfUpdate(AnhChiTietSanPham entity,AnhChiTietSanPhamRequest request){
        try {
            ChiTietSanPhamEntity chiTietSanPham = chiTietSanPhamRepository.findById(request.getIdChiTietSanPham())
                    .orElse(null);
            if(request.getUrlAnh().isEmpty()){
                throw new RuntimeException("url ảnh không được để trống!");
            }else {
                entity.setId(request.getId());
                entity.setChiTietSanPham(chiTietSanPham);
                entity.setUrlAnh(request.getUrlAnh());
                anhChiTietSanPhamRepository.save(entity);
                return new DataResponse(true, new ResultModel<>(null, "create of update success"));
            }
        }catch (Exception e){
            e.printStackTrace();
            return new DataResponse(false,new ResultModel<>(null,"create of update exception"));
        }
    }



}
