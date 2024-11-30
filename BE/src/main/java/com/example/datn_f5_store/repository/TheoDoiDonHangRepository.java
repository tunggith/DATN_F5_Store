package com.example.datn_f5_store.repository;
import com.example.datn_f5_store.entity.ChiTietHoaDonEntity;
import com.example.datn_f5_store.entity.HoaDonEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface TheoDoiDonHangRepository extends JpaRepository<HoaDonEntity, Integer> {
    @Query("SELECT h FROM ChiTietHoaDonEntity h WHERE h.hoaDon.ma = :ma")
    List<ChiTietHoaDonEntity> findByMa(@Param("ma") String ma);

}
