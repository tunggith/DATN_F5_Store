package com.example.datn_f5_store.repository;

import com.example.datn_f5_store.entity.SanPhamEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ISanPhamRepository extends JpaRepository<SanPhamEntity,Integer> {
}
