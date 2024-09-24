package com.example.datn_f5_store.repository;

import com.example.datn_f5_store.contanst.ConfigContanst;
import com.example.datn_f5_store.entity.KhachHangEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import javax.swing.text.html.Option;
import java.util.List;

public interface IKhachHangRepository extends JpaRepository<KhachHangEntity,Integer> {
    List<KhachHangEntity> findByTenContainingIgnoreCase(String name);
    Boolean existsByMa(String ma);// Kiểm tra trùng mã
    Boolean existsBySdt(String sdt); // Kiểm tra trùng số điện thoại
    Boolean existsByEmail(String email); // Kiểm tra trùng email
    Boolean existsByUserName(String userName); // Kiểm tra trùng username

}
