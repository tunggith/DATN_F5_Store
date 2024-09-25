package com.example.datn_f5_store.repository;

import com.example.datn_f5_store.entity.HoaDonEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IHoaDonRepository extends JpaRepository<HoaDonEntity,Integer> {
    Page<HoaDonEntity> findByTrangThai(String trangThai, Pageable pageable);
}