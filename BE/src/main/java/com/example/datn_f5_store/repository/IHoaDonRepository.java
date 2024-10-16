package com.example.datn_f5_store.repository;

import com.example.datn_f5_store.entity.HoaDonEntity;
import com.example.datn_f5_store.response.DataResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IHoaDonRepository extends JpaRepository<HoaDonEntity, Integer> {
//    Page<HoaDonEntity> findByTrangThaiIn(List<String> trangThais, Pageable pageable);
    @Query("SELECT h FROM HoaDonEntity h WHERE " +
            "(LOWER(h.khachHang.ten) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
            "OR LOWER(h.ma) LIKE LOWER(CONCAT('%', :keyword, '%'))) " +
            "AND h.trangThai IN :trangThais")
    Page<HoaDonEntity> searchByKeywordAndTrangThai(@Param("keyword") String keyword,
                                                   @Param("trangThais") List<String> trangThais,
                                                   Pageable pageable);
    boolean existsByMa(String ma);
    List<HoaDonEntity> findByTrangThai(String trangThai);
    @Query("SELECT h FROM HoaDonEntity h WHERE h.trangThai IN :trangThai ORDER BY h.thoiGianTao DESC")
    Page<HoaDonEntity> findByTrangThaiIn(@Param("trangThai") List<String> trangThai,Pageable pageable);

}
