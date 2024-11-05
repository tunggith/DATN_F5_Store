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
    where ctsp.sanPham.id = :sanPhamId 
    and (:donGia is null or ctsp.donGia = :donGia)
    and (:mauSacId is null or ctsp.mauSac.id = :mauSacId)
    and (:sizeId is null or ctsp.size.id = :sizeId)
""")
    Page<ChiTietSanPhamReponse> filterBySanPhamAndPriceAndAttributes(
            @Param("sanPhamId") Long sanPhamId,
            @Param("donGia") Double donGia,
            @Param("mauSacId") Long mauSacId,
            @Param("sizeId") Long sizeId,
            Pageable pageable);



    @Query("""
        select ctsp
        from ChiTietSanPhamEntity ctsp 
        where lower(ctsp.ten) like lower(concat('%', :keyword, '%')) 
          or lower(ctsp.ma) like lower(concat('%', :keyword, '%'))
    """)
    Page<ChiTietSanPhamEntity> searchByTenOrMa1(@Param("keyword") String keyword, Pageable pageable);

    @Query("""
        select ctsp
        from ChiTietSanPhamEntity ctsp 
        where ctsp.trangThai = ?1
    """)
    Page<ChiTietSanPhamEntity> finByTTSp( String keyword, Pageable pageable);

    @Query("SELECT ctsp FROM ChiTietSanPhamEntity ctsp WHERE " +
            "ctsp.trangThai = :chiTietSanPham " +
            "AND ctsp.sanPham.trangThai = :sanPham " +
            "AND (:mauSac IS NULL OR ctsp.mauSac.id = :mauSac) " +
            "AND (:size IS NULL OR ctsp.size.id = :size) " +
            "AND (:thuongHieu IS NULL OR ctsp.sanPham.thuongHieu.id = :thuongHieu) " +
            "AND (:xuatXu IS NULL OR ctsp.sanPham.xuatXu.id = :xuatXu) " +
            "AND (:gioiTinh IS NULL OR ctsp.sanPham.gioiTinh.id = :gioiTinh)")
    Page<ChiTietSanPhamEntity> findByTrangThaiAndSanPhamTrangThai(
            @Param("chiTietSanPham") String chiTietSanPham,
            @Param("sanPham") String sanPham,
            @Param("mauSac") String mauSac,
            @Param("size") String size,
            @Param("thuongHieu") String thuongHieu,
            @Param("xuatXu") String xuatXu,
            @Param("gioiTinh") String gioiTinh,
            Pageable pageable);
    @Query("SELECT ctsp FROM ChiTietSanPhamEntity ctsp WHERE " +
            "(ctsp.ma LIKE %:keyword% OR ctsp.sanPham.ten LIKE %:keyword%)" +
            "AND ctsp.trangThai = :trangThai " +
            "AND ctsp.sanPham.trangThai = :sanPhamTrangThai " +
            "AND (:mauSac IS NULL OR ctsp.mauSac.id = :mauSac) " +
            "AND (:size IS NULL OR ctsp.size.id = :size) " +
            "AND (:thuongHieu IS NULL OR ctsp.sanPham.thuongHieu.id = :thuongHieu) " +
            "AND (:xuatXu IS NULL OR ctsp.sanPham.xuatXu.id = :xuatXu) " +
            "AND (:gioiTinh IS NULL OR ctsp.sanPham.gioiTinh.id = :gioiTinh)")
    Page<ChiTietSanPhamEntity> getByTrangThai(
            @Param("trangThai") String trangThai,
            @Param("sanPhamTrangThai") String sanPhamTrangThai,
            @Param("keyword") String keyword,
            @Param("mauSac") String mauSac,
            @Param("size") String size,
            @Param("thuongHieu") String thuongHieu,
            @Param("xuatXu") String xuatXu,
            @Param("gioiTinh") String gioiTinh,
            Pageable pageable);


    boolean existsByMaOrTen(String ma, String ten);


    boolean existsBySanPhamIdAndMauSacIdAndSizeId(Long sanPhamId, Long mauSacId, Long sizeId);


    @Query("""
    SELECT COUNT(ctsp) > 0
    FROM ChiTietSanPhamEntity ctsp
    WHERE ctsp.sanPham.id = :sanPhamId
    AND ctsp.mauSac.id = :mauSacId
    AND ctsp.size.id = :sizeId
    AND ctsp.id <> :chiTietSanPhamId
""")
    boolean existsBySanPhamIdAndMauSacIdAndSizeIdAndNotId(
            @Param("sanPhamId") Long sanPhamId,
            @Param("mauSacId") Long mauSacId,
            @Param("sizeId") Long sizeId,
            @Param("chiTietSanPhamId") Long chiTietSanPhamId);

}
