package com.example.datn_f5_store.repository;

import com.example.datn_f5_store.response.ChiTietSanPhamReponse;
import com.example.datn_f5_store.entity.ChiTietSanPhamEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IChiTietSanPhamRepository extends JpaRepository<ChiTietSanPhamEntity, Integer> {

    @Query("""
        select new com.example.datn_f5_store.response.ChiTietSanPhamReponse(
           ctsp.id,
            ctsp.sanPham,
            ctsp.mauSac,
            ctsp.size,
            ctsp.ma,
            ctsp.ten,
            ctsp.donGia,
            ctsp.soLuong,
            ctsp.trangThai
        ) 
        from ChiTietSanPhamEntity ctsp
    """)
    List<ChiTietSanPhamReponse> getAllCTSP();

    @Query("""
        select new com.example.datn_f5_store.response.ChiTietSanPhamReponse(
         ctsp.id,
            ctsp.sanPham,
            ctsp.mauSac,
            ctsp.size,
            ctsp.ma,
            ctsp.ten,
            ctsp.donGia,
            ctsp.soLuong,
            ctsp.trangThai
           
        ) 
        from ChiTietSanPhamEntity ctsp
    """)
    Page<ChiTietSanPhamReponse> getALLPhanTrang(Pageable pageable);

    @Query("""
        select new com.example.datn_f5_store.response.ChiTietSanPhamReponse(
       ctsp.id,
            ctsp.sanPham,
            ctsp.mauSac,
            ctsp.size,
            ctsp.ma,
            ctsp.ten,
            ctsp.donGia,
            ctsp.soLuong,
            ctsp.trangThai
        ) 
        from ChiTietSanPhamEntity ctsp 
        where ctsp.sanPham.id = :id
    """)
    Page<ChiTietSanPhamReponse> getALLByIDSPCTPhanTrang(@Param("id") Integer id, Pageable pageable);



        @Query("""
        SELECT COUNT(ctsp) > 0 
        FROM ChiTietSanPhamEntity ctsp
        WHERE ctsp.sanPham.id = :idSanPham 
          AND ctsp.mauSac.id = :idMauSac 
          AND ctsp.size.id = :idSize 
          AND ctsp.ma = :ma 
          AND ctsp.ten = :ten
    """)
        boolean checkTrung(@Param("idSanPham") Integer idSanPham,
                           @Param("idMauSac") Integer idMauSac,
                           @Param("idSize") Integer idSize,
                           @Param("ma") String ma,
                           @Param("ten") String ten);



    @Query("""
        select new com.example.datn_f5_store.response.ChiTietSanPhamReponse(
             ctsp.id,
            ctsp.sanPham,
            ctsp.mauSac,
            ctsp.size,
            ctsp.ma,
            ctsp.ten,
            ctsp.donGia,
            ctsp.soLuong,
            ctsp.trangThai
        ) 
        from ChiTietSanPhamEntity ctsp 
        where lower(ctsp.ten) like lower(concat('%', :keyword, '%')) 
          or lower(ctsp.ma) like lower(concat('%', :keyword, '%'))
    """)
    Page<ChiTietSanPhamReponse> searchByTenOrMa(@Param("keyword") String keyword, Pageable pageable);

    @Query("""
        select new com.example.datn_f5_store.response.ChiTietSanPhamReponse(
            ctsp.id,
            ctsp.sanPham,
            ctsp.mauSac,
            ctsp.size,
            ctsp.ma,
            ctsp.ten,
            ctsp.donGia,
            ctsp.soLuong,
            ctsp.trangThai
        ) 
        from ChiTietSanPhamEntity ctsp 
        where ctsp.donGia >= :minPrice and ctsp.donGia <= :maxPrice
    """)
    Page<ChiTietSanPhamReponse> filterByPrice(@Param("minPrice") Double minPrice,
                                              @Param("maxPrice") Double maxPrice,
                                              Pageable pageable);
    Page<ChiTietSanPhamEntity> findByTrangThaiAndSanPhamTrangThai(
            String chiTietSanPham,
            String sanPham,
            Pageable pageable);
    Page<ChiTietSanPhamEntity> getByTrangThaiAndSanPhamTrangThaiAndTenContainingOrMaContaining(
            String trangThai,
            String sanPhamTrangThai,
            String ma,
            String ten,
            Pageable pageable);

    boolean existsByMaOrTen(String ma, String ten);
}
