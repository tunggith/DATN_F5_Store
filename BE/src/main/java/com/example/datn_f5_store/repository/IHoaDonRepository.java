package com.example.datn_f5_store.repository;

import com.example.datn_f5_store.entity.HoaDonEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IHoaDonRepository extends JpaRepository<HoaDonEntity,Integer> {
    Page<HoaDonEntity> findByTrangThai(String trangThai, Pageable pageable);
    boolean existsByMa(String ma);
    List<HoaDonEntity> findByTrangThai(String trangThai);
}
