package com.example.datn_f5_store.service.user;

import com.example.datn_f5_store.entity.NhanVienEntity;
import com.example.datn_f5_store.repository.INhanVienRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import javax.management.relation.Role;
import java.util.Collection;
import java.util.Collections;
import java.util.stream.Collectors;

@Service
public class CustomUserDetailsService implements UserDetailsService {
    @Autowired
    private INhanVienRepository nhanVienRepository;
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // Tìm người dùng trong database thông qua repository
        NhanVienEntity nhanVien = nhanVienRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username));
        String role  = this.getRoleOfNhanVien(nhanVien);
        // Chuyển thông tin người dùng thành đối tượng UserDetails
        return new org.springframework.security.core.userdetails.User(
                nhanVien.getUsername(),
                nhanVien.getPassword(),
                Collections.singletonList(new SimpleGrantedAuthority(role)) // Chỉ lấy role
        );
    }

    // Hàm này chuyển đổi danh sách các role thành các authority cho Spring Security
    private Collection<? extends GrantedAuthority> mapRolesToAuthorities(Collection<Role> roles) {
        return roles.stream()
                .map(role -> new SimpleGrantedAuthority(role.getRoleName()))
                .collect(Collectors.toList());
    }
    public String getRoleOfNhanVien(NhanVienEntity nhanVien) {
        long count = nhanVienRepository.count();

        if (nhanVien.getId() == 1) { // Nếu id = 1, là nhân viên đầu tiên
            return "ADMIN"; // Trả về ADMIN nếu là nhân viên đầu tiên
        } else {
            return "USER"; // Trả về USER cho các nhân viên khác
        }
    }
}
