package com.example.datn_f5_store.repository;
import com.example.datn_f5_store.entity.HoaDonEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface TheoDoiDonHangRepository extends JpaRepository<HoaDonEntity, Integer> {
    @Query("SELECT h FROM HoaDonEntity h WHERE h.ma = :ma")
    Optional<HoaDonEntity> findByMa(@Param("ma") String ma);
}
