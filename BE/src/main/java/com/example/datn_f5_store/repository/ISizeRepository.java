package com.example.datn_f5_store.repository;

import com.example.datn_f5_store.entity.SizeEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ISizeRepository extends JpaRepository<SizeEntity, Integer> {
    boolean existsByMaOrTen(String ma,String ten);
}
