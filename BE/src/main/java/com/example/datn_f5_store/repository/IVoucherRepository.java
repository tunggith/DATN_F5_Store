package com.example.datn_f5_store.repository;

import com.example.datn_f5_store.entity.Voucher;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IVoucherRepository extends JpaRepository<Voucher,Integer> {
    boolean existsByMa(String ma);
}
