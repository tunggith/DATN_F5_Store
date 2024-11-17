package com.example.datn_f5_store.repository;

import com.example.datn_f5_store.entity.SanPhamEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ISanPhamRepository extends JpaRepository<SanPhamEntity,Integer> {
    Page<SanPhamEntity> getByTenContainingOrMaContaining(String ten, String ma, Pageable pageable);

    @Query("SELECT sp FROM SanPhamEntity sp WHERE "
            + "(:thuongHieuId IS NULL OR sp.thuongHieu.id = :thuongHieuId) AND "
            + "(:xuatXuId IS NULL OR sp.xuatXu.id = :xuatXuId) AND "
            + "(:gioiTinhId IS NULL OR sp.gioiTinh.id = :gioiTinhId)")
    Page<SanPhamEntity> filterSanPham(@Param("thuongHieuId") Long thuongHieuId,
                                @Param("xuatXuId") Long xuatXuId,
                                @Param("gioiTinhId") Long gioiTinhId,
                                Pageable pageable);

    @Query("SELECT sp FROM SanPhamEntity sp WHERE sp.trangThai = 'Đang hoạt động'")
    List<SanPhamEntity> findProductsByStatus();





    @Query("SELECT sp FROM SanPhamEntity sp WHERE sp.id = :id")
    List<SanPhamEntity> finfbyidSP(@Param("id") Integer id);


}
