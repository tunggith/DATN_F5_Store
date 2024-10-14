package com.example.datn_f5_store.repository;

import com.example.datn_f5_store.entity.ChiTietHoaDonEntity;
import com.example.datn_f5_store.entity.ChiTietSanPhamEntity;
import com.example.datn_f5_store.entity.HoaDonEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface IChiTietHoaDonRepository extends JpaRepository<ChiTietHoaDonEntity,Integer> {
    ChiTietHoaDonEntity findByHoaDon(HoaDonEntity hoaDon);
    List<ChiTietHoaDonEntity> getChiTietHoaDonEntityByHoaDon(HoaDonEntity hoaDon);
    ChiTietHoaDonEntity findByChiTietSanPham(ChiTietSanPhamEntity chiTietSanPham);


    @Query("SELECT c.chiTietSanPham, SUM(c.soLuong) as totalSold, COUNT(c.hoaDon) as totalOrders " +
            "FROM ChiTietHoaDonEntity c " +
            "WHERE c.hoaDon.trangThai = 'Hoàn Thành' " +
            "GROUP BY c.chiTietSanPham " +
            "ORDER BY totalSold DESC")
    List<Object[]> top10sanphambanchay();


    @Query(value = "WITH MonthSeries AS ( " +
            "    SELECT 1 AS thang " +
            "    UNION ALL " +
            "    SELECT thang + 1 FROM MonthSeries WHERE thang < 12 " +
            ") " +
            "SELECT TOP 5 sp.id AS idSP, sp.ten AS tenSP, SUM(c.so_luong) AS totalSold " +  // Sử dụng TOP 5
            "FROM hoa_don h " +
            "LEFT JOIN chi_tiet_hoa_don c ON c.ID_HOA_DON = h.id " +
            "LEFT JOIN chi_tiet_san_pham ctsp ON c.ID_CHI_TIET_SAN_PHAM = ctsp.id " +
            "LEFT JOIN san_pham sp ON ctsp.ID_SAN_PHAM = sp.id " +
            "WHERE YEAR(h.thoi_gian_tao) = :year " +  // Chọn theo năm
            "AND h.trang_thai = 'Hoàn Thành' " +  // Chỉ lấy đơn hàng đã hoàn thành
            "GROUP BY sp.id, sp.ten " +  // Group theo ID và tên sản phẩm
            "ORDER BY totalSold DESC", nativeQuery = true)  // Sắp xếp theo tổng số lượng bán giảm dần
    List<Object[]> findTop5SanPhamTheoThang(@Param("year") int year);







    @Query(value = "WITH DateSeries AS (" +
            "    SELECT CAST(:startDate AS DATE) AS ngay " +
            "    UNION ALL " +
            "    SELECT DATEADD(DAY, 1, ngay) " +
            "    FROM DateSeries " +
            "    WHERE ngay < :endDate " +
            ") " +
            "SELECT sp.id AS idSanPham, sp.ten AS tenSanPham, SUM(c.so_luong) AS totalSold " +  // Lấy ID và tên sản phẩm, gộp số lượng
            "FROM DateSeries ds " +
            "LEFT JOIN hoa_don h ON CAST(h.THOI_GIAN_TAO AS DATE) = ds.ngay AND h.trang_thai = 'Hoàn Thành' " +
            "LEFT JOIN chi_tiet_hoa_don c ON c.ID_HOA_DON = h.id " +
            "LEFT JOIN chi_tiet_san_pham ctsp ON c.ID_CHI_TIET_SAN_PHAM = ctsp.id " +  // Join với chi_tiet_san_pham
            "LEFT JOIN san_pham sp ON ctsp.ID_SAN_PHAM = sp.id " +  // Join với san_pham để lấy tên
            "GROUP BY sp.id, sp.ten " +  // Chỉ nhóm theo ID và tên sản phẩm
            "ORDER BY totalSold DESC " +
            "OPTION (MAXRECURSION 0)", nativeQuery = true)
    List<Object[]> findTopSanPhamTheoNgay(@Param("startDate") String startDate, @Param("endDate") String endDate);





    @Query(value = "WITH QuarterSeries AS (" +
            "    SELECT 1 AS quy " +
            "    UNION ALL " +
            "    SELECT 2 " +
            "    UNION ALL " +
            "    SELECT 3 " +
            "    UNION ALL " +
            "    SELECT 4 " +
            ") " +
            "SELECT TOP 5 sp.id AS idSanPham, sp.ten AS tenSanPham, SUM(c.so_luong) AS totalSold " +  // Chỉ lấy ID và tên sản phẩm
            "FROM QuarterSeries qs " +
            "LEFT JOIN hoa_don h ON " +
            "    CASE " +
            "        WHEN MONTH(h.THOI_GIAN_TAO) IN (1, 2, 3) THEN 1 " +
            "        WHEN MONTH(h.THOI_GIAN_TAO) IN (4, 5, 6) THEN 2 " +
            "        WHEN MONTH(h.THOI_GIAN_TAO) IN (7, 8, 9) THEN 3 " +
            "        WHEN MONTH(h.THOI_GIAN_TAO) IN (10, 11, 12) THEN 4 " +
            "    END = qs.quy " +
            "AND YEAR(h.THOI_GIAN_TAO) = ?1 " +
            "AND h.trang_thai = 'Hoàn Thành' " +
            "LEFT JOIN chi_tiet_hoa_don c ON c.ID_HOA_DON = h.id " +
            "LEFT JOIN chi_tiet_san_pham ctsp ON c.ID_CHI_TIET_SAN_PHAM = ctsp.id " +
            "LEFT JOIN san_pham sp ON ctsp.ID_SAN_PHAM = sp.id " +
            "GROUP BY sp.id, sp.ten " +  // Chỉ nhóm theo ID và tên sản phẩm
            "ORDER BY totalSold DESC", nativeQuery = true)
    List<Object[]> findTopSanPhamTheoQuy(int year);








    @Query(value = "WITH YearSeries AS (" +
            "    SELECT ?1 AS nam " +
            "    UNION ALL " +
            "    SELECT nam + 1 " +
            "    FROM YearSeries " +
            "    WHERE nam < ?2 " +
            ") " +
            "SELECT TOP 5 sp.id AS idSanPham, sp.ten AS tenSanPham, SUM(c.so_luong) AS totalSold " +  // Lấy ID và tên sản phẩm
            "FROM YearSeries ys " +
            "LEFT JOIN hoa_don h ON YEAR(h.THOI_GIAN_TAO) = ys.nam AND h.trang_thai = 'Hoàn Thành' " +
            "LEFT JOIN chi_tiet_hoa_don c ON c.ID_HOA_DON = h.id " +
            "LEFT JOIN chi_tiet_san_pham ctsp ON c.ID_CHI_TIET_SAN_PHAM = ctsp.id " +  // Join với chi_tiet_san_pham
            "LEFT JOIN san_pham sp ON ctsp.ID_SAN_PHAM = sp.id " +  // Join với san_pham để lấy tên
            "GROUP BY sp.id, sp.ten " +  // Nhóm theo ID và tên sản phẩm
            "ORDER BY totalSold DESC", nativeQuery = true)
    List<Object[]> findTopSanPhamTheoKhoangNam(int startYear, int endYear);








}
