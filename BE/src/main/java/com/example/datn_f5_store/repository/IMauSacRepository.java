package com.example.datn_f5_store.repository;

import com.example.datn_f5_store.entity.MauSacEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IMauSacRepository extends JpaRepository<MauSacEntity,Integer> {
    boolean existsByMaOrTen(String ma,String ten);
}
