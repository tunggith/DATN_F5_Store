package com.example.datn_f5_store.repository;

import com.example.datn_f5_store.response.GioHangResponse;
import com.example.datn_f5_store.entity.GioHangEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface IGioHangRepository extends JpaRepository<GioHangEntity,Integer> {

    @Query(
            """
                select  new com.example.datn_f5_store.response.GioHangResponse(
                    gh.id,
                    gh.khachHang.ten,
                    gh.thoiGianTao
                ) from GioHangEntity gh
    
"""
    )
    Page<GioHangResponse> getallPhanTrang(Pageable pageable);
    GioHangEntity findByKhachHang_Id(Integer id);

}
