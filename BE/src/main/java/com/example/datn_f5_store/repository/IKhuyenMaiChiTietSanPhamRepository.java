package com.example.datn_f5_store.repository;

import com.example.datn_f5_store.entity.ChiTietSanPhamEntity;
import com.example.datn_f5_store.entity.KhuyenMaiChiTietSanPham;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface IKhuyenMaiChiTietSanPhamRepository extends JpaRepository<KhuyenMaiChiTietSanPham, Integer> {
    Optional<KhuyenMaiChiTietSanPham> findFirstByChiTietSanPham(ChiTietSanPhamEntity chiTietSanPham);
    @Query(" select p  from KhuyenMaiChiTietSanPham p where p.chiTietSanPham.id = ?1")
    Optional<KhuyenMaiChiTietSanPham> findByChiTietSanPhamId(Integer chiTietSanPhamId);
    @Query(" select p  from KhuyenMaiChiTietSanPham p where p.khuyenMai.id = ?1")
    Page<KhuyenMaiChiTietSanPham> findByKhuyenMai( Pageable pageable,Integer khuyenMaiId);


}
