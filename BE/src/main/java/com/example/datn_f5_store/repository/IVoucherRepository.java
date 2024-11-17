package com.example.datn_f5_store.repository;


import com.example.datn_f5_store.entity.VoucherEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface IVoucherRepository extends JpaRepository<VoucherEntity,Integer> {
    boolean existsByMa(String ma);
    Page<VoucherEntity> getByTenContainingOrMaContaining(String ten, String ma, Pageable pageable);

    @Query("SELECT k FROM VoucherEntity k WHERE k.thoiGianBatDau >= :ngayBatDau AND k.thoiGianKetThuc <= :ngayKetThuc")
    Page<VoucherEntity> findAllByThoiGianBatDauGreaterThanEqualAndThoiGianKetThucLessThanEqual(
            @Param("ngayBatDau") LocalDateTime ngayBatDau,
            @Param("ngayKetThuc") LocalDateTime ngayKetThuc,
            Pageable pageable);

    Page<VoucherEntity> findAllByThoiGianBatDauGreaterThanEqual(LocalDateTime start, Pageable pageable);
    Page<VoucherEntity> findAllByThoiGianKetThucLessThanEqual(LocalDateTime end, Pageable pageable);

    @Query("SELECT p FROM VoucherEntity p WHERE p.trangThai = ?1")
    Page<VoucherEntity> findByTrangThai(String trangThai, Pageable pageable);
    List<VoucherEntity> getByTrangThai(String trangThai);

    @Query("SELECT p FROM VoucherEntity p WHERE p.trangThai = ?1 ORDER BY p.id DESC")
    Page<VoucherEntity> findByTrangThai2(String trangThai, Pageable pageable);
}
