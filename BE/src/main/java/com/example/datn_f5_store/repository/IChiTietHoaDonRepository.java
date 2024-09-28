package com.example.datn_f5_store.repository;

import com.example.datn_f5_store.entity.ChiTietHoaDonEntity;
import com.example.datn_f5_store.entity.ChiTietSanPhamEntity;
import com.example.datn_f5_store.entity.HoaDonEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface IChiTietHoaDonRepository extends JpaRepository<ChiTietHoaDonEntity,Integer> {
    ChiTietHoaDonEntity findByHoaDon(HoaDonEntity hoaDon);
    List<ChiTietHoaDonEntity> getChiTietHoaDonEntityByHoaDon(HoaDonEntity hoaDon);
    ChiTietHoaDonEntity findByChiTietSanPham(ChiTietSanPhamEntity chiTietSanPham);

}
