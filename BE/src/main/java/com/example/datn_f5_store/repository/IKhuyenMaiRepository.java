package com.example.datn_f5_store.repository;

import com.example.datn_f5_store.entity.KhuyenMaiEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.Date;


public interface IKhuyenMaiRepository extends JpaRepository<KhuyenMaiEntity,Integer> {
    Page<KhuyenMaiEntity> getByTenContainingOrMaContaining(String ten, String ma, Pageable pageable);
    @Query("SELECT k FROM KhuyenMaiEntity k WHERE k.thoiGianBatDau >= :ngayBatDau AND k.thoiGianKetThuc <= :ngayKetThuc")
    Page<KhuyenMaiEntity> findAllByThoiGianBatDauGreaterThanEqualAndThoiGianKetThucLessThanEqual(
            @Param("ngayBatDau") LocalDateTime ngayBatDau,
            @Param("ngayKetThuc") LocalDateTime ngayKetThuc,
            Pageable pageable);


    Page<KhuyenMaiEntity> findAllByThoiGianBatDauGreaterThanEqual(LocalDateTime ngayBatDau, Pageable pageable);
    Page<KhuyenMaiEntity> findAllByThoiGianKetThucLessThanEqual(LocalDateTime ngayKetThuc, Pageable pageable);
    KhuyenMaiEntity findByMa(String ma);

    @Query("SELECT p FROM KhuyenMaiEntity p WHERE p.trangThai = ?1")
    Page<KhuyenMaiEntity> findByTrangThai(String trangThai, Pageable pageable);

}