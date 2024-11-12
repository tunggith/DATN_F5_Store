package com.example.datn_f5_store.repository;

import com.example.datn_f5_store.entity.AnhChiTietSanPham;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface IAnhChiTietSanPhamRepository extends JpaRepository<AnhChiTietSanPham,Integer> {
    @Query("SELECT a FROM AnhChiTietSanPham a WHERE a.urlAnh LIKE %:search% ")
    Page<AnhChiTietSanPham> findBySearch(@Param("search") String search, Pageable pageable);
    Boolean existsByUrlAnh(String urlAnh);// Kiểm tra trùng tên đường dẫn
    Page<AnhChiTietSanPham> findByChiTietSanPham_Id(Integer id,Pageable pageable);


    @Query("""
    SELECT anh 
    FROM AnhChiTietSanPham anh 
    JOIN FETCH anh.chiTietSanPham chiTiet
    JOIN chiTiet.sanPham sanPham
    WHERE sanPham.trangThai = :trangThai 
    AND anh.id IN (
        SELECT MIN(a.id)
        FROM AnhChiTietSanPham a
        GROUP BY a.chiTietSanPham.sanPham.id
    )
    ORDER BY anh.chiTietSanPham.sanPham.id desc 
    """)
    List<AnhChiTietSanPham> findTop5ActiveProducts(@Param("trangThai") String trangThai, Pageable pageable);

    List<AnhChiTietSanPham> findByIdIn(List<Long> ids);

    @Query(value = """
        WITH Most_Sold_Product AS (
            SELECT TOP 5 ID_CHI_TIET_SAN_PHAM, SUM(SO_LUONG) AS Total_Quantity
            FROM CHI_TIET_HOA_DON
            GROUP BY ID_CHI_TIET_SAN_PHAM
            ORDER BY Total_Quantity DESC
        )
        SELECT msp.ID_CHI_TIET_SAN_PHAM,
               STRING_AGG(i.URL_ANH, ', ') AS URL_ANH,
               MAX(i.ID) AS ID
        FROM ANH_CHI_TIET_SAN_PHAM i
        JOIN Most_Sold_Product msp ON i.ID_CHI_TIET_SAN_PHAM = msp.ID_CHI_TIET_SAN_PHAM
        GROUP BY msp.ID_CHI_TIET_SAN_PHAM;
        """, nativeQuery = true)
    List<Object[]> findTop10MostSoldProducts();


    @Query("SELECT a FROM AnhChiTietSanPham a WHERE a.chiTietSanPham.id = :id")
    Page<AnhChiTietSanPham> finfbyidSpct(@Param("id") String id, Pageable pageable);


    @Query("""
    SELECT anh 
    FROM AnhChiTietSanPham anh 
    JOIN FETCH anh.chiTietSanPham chiTiet
    JOIN chiTiet.sanPham sanPham
    WHERE sanPham.trangThai = :trangThai 
    AND anh.id IN (
        SELECT MIN(a.id)
        FROM AnhChiTietSanPham a
        GROUP BY a.chiTietSanPham.sanPham.id
    )
    ORDER BY anh.chiTietSanPham.sanPham.id DESC
    """)
    Page<AnhChiTietSanPham> getallAnhSanPham(@Param("trangThai") String trangThai, Pageable pageable);

}
