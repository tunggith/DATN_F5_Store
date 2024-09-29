package com.example.datn_f5_store.repository;

import com.example.datn_f5_store.entity.DiaChiKhachHangEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface IDiaChiKhachHangRepository extends JpaRepository<DiaChiKhachHangEntity,Integer> {
    @Query("SELECT d FROM DiaChiKhachHangEntity d WHERE " +
            "d.hoTen LIKE %:searchTerm% OR " +
            "d.SDT LIKE %:searchTerm% OR " +
            "d.soNha LIKE %:searchTerm% OR " +
            "d.duong LIKE %:searchTerm% OR " +
            "d.phuongXa LIKE %:searchTerm% OR " +
            "d.quanHuyen LIKE %:searchTerm% OR " +
            "d.tinhThanh LIKE %:searchTerm% OR " +
            "d.quocGia LIKE %:searchTerm% OR " +
            "d.loaiDiaChi LIKE %:searchTerm%")
    Page<DiaChiKhachHangEntity> findBySearchTerm(@Param("searchTerm") String searchTerm, Pageable pageable);

    Boolean existsBySDT(String SDT);// Kiểm tra trùng số điện thoại
}
