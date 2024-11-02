package com.example.datn_f5_store.service.impl;

import com.example.datn_f5_store.controller.NhanVienController;
import com.example.datn_f5_store.entity.NhanVienEntity;
import com.example.datn_f5_store.repository.INhanVienRepository;
import com.example.datn_f5_store.request.NhanVienRequest;
import com.example.datn_f5_store.response.DataResponse;
import com.example.datn_f5_store.response.ResultModel;
import com.example.datn_f5_store.service.IUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl implements IUserService {
    @Autowired
    private INhanVienRepository nhanVienRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;

    public DataResponse changePassword(String username,String passwordOld,String passwordNew) {
        // Tìm nhân viên dựa trên tên đăng nhập
        NhanVienEntity entity = nhanVienRepository.findByUsername(username);

        if (entity != null) {
            // Kiểm tra mật khẩu cũ
            if (passwordOld.equals(entity.getPassword())) {
                // Mã hóa mật khẩu mới
                String newEncodedPassword = passwordEncoder.encode(passwordNew);
                entity.setPassword(newEncodedPassword);
                nhanVienRepository.save(entity);
                return new DataResponse(true, new ResultModel<>(null, "Đổi mật khẩu thành công!"));
            } else {
                throw new RuntimeException("Mật khẩu cũ không đúng!");
            }
        } else {
            throw new RuntimeException("Tài khoản không tồn tại!");
        }
    }

}
