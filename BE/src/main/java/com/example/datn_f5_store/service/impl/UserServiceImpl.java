package com.example.datn_f5_store.service.impl;

import com.example.datn_f5_store.controller.NhanVienController;
import com.example.datn_f5_store.entity.NhanVienEntity;
import com.example.datn_f5_store.repository.INhanVienRepository;
import com.example.datn_f5_store.request.NhanVienRequest;
import com.example.datn_f5_store.response.DataResponse;
import com.example.datn_f5_store.response.ResultModel;
import com.example.datn_f5_store.service.IUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl implements IUserService {
    @Autowired
    private INhanVienRepository nhanVienRepository;
    @Override
    public DataResponse login(NhanVienRequest request) {
        NhanVienEntity entity = nhanVienRepository.getByUsernameAndPassword(request.getUsername(),request.getPassword());
        if(entity!=null) {
            return new DataResponse(true,new ResultModel<>(null,"Đăng nhập thành công!"));
        }else {
            return new DataResponse(false,new ResultModel<>(null,"Username hoặc password không đúng!"));
        }
    }

    @Override
    public DataResponse changePassword(NhanVienRequest request) {
        NhanVienEntity entity = nhanVienRepository.getByUsernameAndPassword(request.getUsername(), request.getPassword());
        if(entity!=null){
            entity.setPassword(request.getPassword());
            nhanVienRepository.save(entity);
            return new DataResponse(true,new ResultModel<>(null,"Đổi mật khẩu thành công!"));
        }else {
            return new DataResponse(false,new ResultModel<>(null,"Tài khoản không tồn tại!"));
        }
    }
}
