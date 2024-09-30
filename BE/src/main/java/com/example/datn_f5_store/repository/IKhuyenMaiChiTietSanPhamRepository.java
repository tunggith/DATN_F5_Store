package com.example.datn_f5_store.repository;

import com.example.datn_f5_store.entity.ChiTietSanPhamEntity;
import com.example.datn_f5_store.entity.KhuyenMaiChiTietSanPham;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface IKhuyenMaiChiTietSanPhamRepository extends JpaRepository<KhuyenMaiChiTietSanPham, Integer> {
    Optional<KhuyenMaiChiTietSanPham> findFirstByChiTietSanPham(ChiTietSanPhamEntity chiTietSanPham);
}
