package com.example.datn_f5_store.repository;

import com.example.datn_f5_store.entity.VoucherEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IVoucherRepository extends JpaRepository<VoucherEntity,Integer> {
    boolean existsByMa(String ma);
}
