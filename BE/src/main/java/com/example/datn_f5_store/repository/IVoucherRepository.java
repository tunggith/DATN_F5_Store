package com.example.datn_f5_store.repository;


import com.example.datn_f5_store.entity.VoucherEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Date;
import java.util.List;

public interface IVoucherRepository extends JpaRepository<VoucherEntity,Integer> {
    boolean existsByMa(String ma);
    Page<VoucherEntity> getByTenContainingOrMaContaining(String ten, String ma, Pageable pageable);

    @Query("SELECT k FROM VoucherEntity k WHERE CAST(k.thoiGianBatDau AS date) >= CAST(:ngayBatDau AS date) AND CAST(k.thoiGianKetThuc AS date) <= CAST(:ngayKetThuc AS date)")
    Page<VoucherEntity> findAllByThoiGianBatDauGreaterThanEqualAndThoiGianKetThucLessThanEqual(@Param("ngayBatDau") Date ngayBatDau, @Param("ngayKetThuc") Date ngayKetThuc, Pageable pageable);

    Page<VoucherEntity> findAllByThoiGianBatDauGreaterThanEqual(Date start, Pageable pageable);
    Page<VoucherEntity> findAllByThoiGianKetThucLessThanEqual(Date end, Pageable pageable);

    @Query("SELECT p FROM VoucherEntity p WHERE p.trangThai = ?1")
    Page<VoucherEntity> findByTrangThai(String trangThai, Pageable pageable);
    List<VoucherEntity> getByTrangThai(String trangThai);
}
