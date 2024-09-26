package com.example.datn_f5_store.repository;

import com.example.datn_f5_store.entity.ThuongHieuEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IThuongHieuRepository extends JpaRepository<ThuongHieuEntity,Integer> {
    boolean existsByMaOrTen(String ma,String ten);
}
