package com.example.datn_f5_store.repository;

import com.example.datn_f5_store.entity.ChiTietGioHangEntity;
import com.example.datn_f5_store.entity.ChiTietHoaDonEntity;
import com.example.datn_f5_store.entity.ChiTietSanPhamEntity;
import com.example.datn_f5_store.entity.GioHangEntity;
import com.example.datn_f5_store.response.ChiTietGioHangReponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IChiTietGioHangRepository extends JpaRepository<ChiTietGioHangEntity, Integer> {

    @Query("""

            select new com.example.datn_f5_store.response.ChiTietGioHangReponse(
                    ctgh.id,
                    ctgh.gioHang.id,
                    ctgh.chiTietSanPham.moTa,
                    ctgh.soLuong
            ) from ChiTietGioHangEntity ctgh
            """)
    Page<ChiTietGioHangReponse> getallPhanTrang(
            Pageable pageable
    );


    // tìm ghct theo tên sản phẩm
    @Query("""
                select new com.example.datn_f5_store.response.ChiTietGioHangReponse(
                    ctgh.id,
                    ctgh.gioHang.id,
                    ctgh.chiTietSanPham.moTa,
                    ctgh.soLuong
                )
                from ChiTietGioHangEntity ctgh
                where ctgh.chiTietSanPham.moTa like %:tenSanPham%
            """)
    Page<ChiTietGioHangReponse> searchByTenSanPham(
            @Param("tenSanPham") String tenSanPham,
            Pageable pageable
    );


    ChiTietGioHangEntity findByGioHangAndChiTietSanPham(GioHangEntity gioHang, ChiTietSanPhamEntity chiTietSanPham);

    @Query("""
            select p  from ChiTietGioHangEntity  p where p.gioHang.id = ?1
            """)
    Page<ChiTietGioHangEntity> findByIdGioHang(Pageable pageable, Integer idgh);

    List<ChiTietGioHangEntity> findByGioHang_Id(Integer id);

    ChiTietHoaDonEntity deleteByGioHang_Id(Integer id);

    List<ChiTietGioHangEntity> findByIdIn(List<Integer> id);
    void deleteAllByIdIn(List<Integer> ids);
}



