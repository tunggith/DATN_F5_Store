package com.example.datn_f5_store.repository;

import com.example.datn_f5_store.entity.NhanVienEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface INhanVienRepository extends JpaRepository<NhanVienEntity, Integer> {
    Page<NhanVienEntity> getByTenContainingOrMaContaining(String ten, String ma, Pageable pageable);
    NhanVienEntity getByUsernameAndPassword(String username,String password);
    NhanVienEntity getByEmail(String email);
}
