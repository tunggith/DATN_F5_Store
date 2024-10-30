package com.example.datn_f5_store.entity;

import com.example.datn_f5_store.contanst.ConfigContanst;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;

@Data
@Table(name = ConfigContanst.NhanVien.TABLE)
@Entity
public class NhanVienEntity implements UserDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    @Column(name = ConfigContanst.NhanVien.MA)
    private String ma;
    @Column(name = ConfigContanst.NhanVien.HO_TEN)
    private String ten;
    @Column(name = ConfigContanst.NhanVien.GIOI_TINH)
    private String gioiTinh;
    @Column(name = ConfigContanst.NhanVien.NGAY_THANG_NAM_SINH)
    private Date ngayThangNamSinh;
    @Column(name = ConfigContanst.NhanVien.EMAIL)
    private String email;
    @Column(name = ConfigContanst.NhanVien.SDT)
    private String sdt;
    @Column(name = ConfigContanst.NhanVien.DIA_CHI)
    private String diaChi;
    @Column(name = ConfigContanst.NhanVien.ANH)
    private String anh;
    @Column(name = ConfigContanst.NhanVien.ROLE)
    private String role;
    @Column(name = ConfigContanst.NhanVien.USERNAME)
    private String username;
    @Column(name = ConfigContanst.NhanVien.PASSWORD)
    private String password;
    @Column(name = ConfigContanst.NhanVien.NGUOI_TAO)
    private String nguoiTao;
    @Column(name = ConfigContanst.NhanVien.THOI_GIAN_TAO)
    private Date thoiGianTao;
    @Column(name = ConfigContanst.NhanVien.NGUOI_SUA)
    private String nguoiSua;
    @Column(name = ConfigContanst.NhanVien.THOI_GIAN_SUA)
    private Date thoiGianSua;
    @Column(name = ConfigContanst.NhanVien.TRANG_THAI)
    private String trangThai;
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        Set<GrantedAuthority> authorities = new HashSet<>();
        authorities.add(new SimpleGrantedAuthority(role)); // Thêm quyền từ biến role
        return authorities; // Trả về tập hợp quyền hạn;
    }

    @Override
    public boolean isAccountNonExpired() {
        return UserDetails.super.isAccountNonExpired();
    }

    @Override
    public boolean isAccountNonLocked() {
        return UserDetails.super.isAccountNonLocked();
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return UserDetails.super.isCredentialsNonExpired();
    }

    @Override
    public boolean isEnabled() {
        return UserDetails.super.isEnabled();
    }
}
