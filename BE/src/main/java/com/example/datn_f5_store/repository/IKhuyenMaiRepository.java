package com.example.datn_f5_store.repository;

import com.example.datn_f5_store.entity.KhuyenMaiEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Date;


public interface IKhuyenMaiRepository extends JpaRepository<KhuyenMaiEntity,Integer> {
    Page<KhuyenMaiEntity> getByTenContainingOrMaContaining(String ten, String ma, Pageable pageable);
    @Query("SELECT k FROM KhuyenMaiEntity k WHERE CAST(k.thoiGianBatDau AS date) >= CAST(:ngayBatDau AS date) AND CAST(k.thoiGianKetThuc AS date) <= CAST(:ngayKetThuc AS date)")
    Page<KhuyenMaiEntity> findAllByThoiGianBatDauGreaterThanEqualAndThoiGianKetThucLessThanEqual(@Param("ngayBatDau") Date ngayBatDau, @Param("ngayKetThuc") Date ngayKetThuc, Pageable pageable);

    Page<KhuyenMaiEntity> findAllByThoiGianBatDauGreaterThanEqual(Date ngayBatDau, Pageable pageable);
    Page<KhuyenMaiEntity> findAllByThoiGianKetThucLessThanEqual(Date ngayKetThuc, Pageable pageable);
    KhuyenMaiEntity findByMa(String ma);
}
