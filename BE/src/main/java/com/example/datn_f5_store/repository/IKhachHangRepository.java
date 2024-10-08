package com.example.datn_f5_store.repository;

import com.example.datn_f5_store.contanst.ConfigContanst;
import com.example.datn_f5_store.entity.KhachHangEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface IKhachHangRepository extends JpaRepository<KhachHangEntity, Integer> {

    List<KhachHangEntity> findByTenContainingIgnoreCase(String name);

    @Query("SELECT k FROM KhachHangEntity k WHERE " +
            "k.sdt LIKE %:search% OR " +
            "k.email LIKE %:search% OR " +
            "k.ma LIKE %:search% OR " +
            "k.ten LIKE %:search%")
    Page<KhachHangEntity> findBySearch(@Param("search") String search, Pageable pageable);

    Boolean existsByMa(String ma); // Kiểm tra trùng mã
    Boolean existsBySdt(String sdt); // Kiểm tra trùng số điện thoại
    Boolean existsByEmail(String email); // Kiểm tra trùng email
    Boolean existsByUserName(String userName); // Kiểm tra trùng username

}
