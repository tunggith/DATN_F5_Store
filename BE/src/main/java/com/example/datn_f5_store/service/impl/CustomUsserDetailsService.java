package com.example.datn_f5_store.service.impl;

import com.example.datn_f5_store.entity.CustomUserDetails;
import com.example.datn_f5_store.entity.KhachHangEntity;
import com.example.datn_f5_store.entity.NhanVienEntity;
import com.example.datn_f5_store.repository.IKhachHangRepository;
import com.example.datn_f5_store.repository.INhanVienRepository;
import com.example.datn_f5_store.utils.permission.Permission;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class CustomUsserDetailsService implements UserDetailsService {
    @Autowired
    private INhanVienRepository nhanVienRepository;
    @Autowired
    private IKhachHangRepository khachHangRepository;
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        List<GrantedAuthority> authorities = new ArrayList<>();
        NhanVienEntity nhanVien = nhanVienRepository.findByUsername(username);
        if (nhanVien != null) {
            // Thêm quyền cho nhân viên
            String role = nhanVien.getRoles();
            if ("ADMIN".equalsIgnoreCase(role)) {
                authorities.add(new SimpleGrantedAuthority(Permission.ADMIN_READ.getPermission()));
            } else if ("USER".equalsIgnoreCase(role)) {
                authorities.add(new SimpleGrantedAuthority(Permission.USER_READ.getPermission()));
            }
            return new CustomUserDetails(nhanVien.getUsername(), nhanVien.getPassword(), authorities);
        }

        KhachHangEntity khachHang = khachHangRepository.findByUserName(username);
        if (khachHang != null) {
            authorities.add(new SimpleGrantedAuthority(Permission.CUSTOMER_READ.getPermission()));
            return new CustomUserDetails(khachHang.getUserName(), khachHang.getPassword(), authorities);
        }

        throw new UsernameNotFoundException("User not found");
    }
}
