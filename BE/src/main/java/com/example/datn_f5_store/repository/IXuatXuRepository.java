package com.example.datn_f5_store.repository;

import com.example.datn_f5_store.entity.XuatXuEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.RequestBody;

@Repository
public interface IXuatXuRepository extends JpaRepository<XuatXuEntity,Integer> {
    boolean existsByMaOrTen(String ma,String ten);
}
