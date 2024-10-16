package com.example.datn_f5_store.repository;

import com.example.datn_f5_store.entity.HoaDonEntity;
import com.example.datn_f5_store.entity.LichSuHoaDonEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Date;
import java.util.List;

public interface ILichSuHoaDonRepository extends JpaRepository<LichSuHoaDonEntity, Integer> {
    @Query("SELECT l FROM LichSuHoaDonEntity l WHERE l.thoiGianThucHien BETWEEN :startDate AND :endDate")
    Page<LichSuHoaDonEntity> findByThoiGianThucHienBetween(
            @Param("startDate") Date startDate,
            @Param("endDate") Date endDate,
            Pageable pageable
    );
    LichSuHoaDonEntity findByHoaDon(HoaDonEntity hoaDon);
    // Tìm tất cả nếu không có điều kiện
    Page<LichSuHoaDonEntity> findAll(Pageable pageable);
    List<LichSuHoaDonEntity> findByHoaDon_Id(Integer id);
    LichSuHoaDonEntity findTop1ByHoaDonOrderByThoiGianThucHienDesc(HoaDonEntity hoaDon);


}
