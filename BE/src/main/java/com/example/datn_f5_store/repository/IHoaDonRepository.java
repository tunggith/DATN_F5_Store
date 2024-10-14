package com.example.datn_f5_store.repository;

import com.example.datn_f5_store.entity.HoaDonEntity;
import com.example.datn_f5_store.response.DataResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

@Repository
public interface IHoaDonRepository extends JpaRepository<HoaDonEntity, Integer> {
    Page<HoaDonEntity> findByTrangThai(String trangThai, Pageable pageable);
    boolean existsByMa(String ma);
    List<HoaDonEntity> findByTrangThai(String trangThai);


    @Query(value = "WITH DateSeries AS (" +
            "    SELECT CAST(:startDate AS DATE) AS ngay" +
            "    UNION ALL" +
            "    SELECT DATEADD(DAY, 1, ngay)" +
            "    FROM DateSeries" +
            "    WHERE ngay < :endDate" +
            ")" +
            "SELECT ds.ngay, ISNULL(SUM(c.so_luong * c.gia_spct_hien_tai), 0) AS doanhThu" +
            " FROM DateSeries ds" +
            " LEFT JOIN hoa_don h ON CAST(h.THOI_GIAN_TAO AS DATE) = ds.ngay AND h.trang_thai = 'Hoàn Thành'" +
            " LEFT JOIN chi_tiet_hoa_don c ON c.ID_HOA_DON = h.id" +
            " GROUP BY ds.ngay" +
            " ORDER BY ds.ngay ASC OPTION (MAXRECURSION 0)", nativeQuery = true)
    List<Object[]> findDoanhThuTheoNgay(@Param("startDate") String startDate, @Param("endDate") String endDate);

    @Query(value = "WITH MonthSeries AS (" +
            "    SELECT 1 AS thang" +
            "    UNION ALL" +
            "    SELECT thang + 1 FROM MonthSeries WHERE thang < 12" +
            ")" +
            "SELECT ms.thang, ISNULL(SUM(c.so_luong * c.gia_spct_hien_tai), 0) AS doanhThu " +
            "FROM MonthSeries ms " +
            "LEFT JOIN hoa_don h ON MONTH(h.THOI_GIAN_TAO) = ms.thang AND YEAR(h.THOI_GIAN_TAO) = ?1 AND h.trang_thai = 'Hoàn Thành' " +
            "LEFT JOIN chi_tiet_hoa_don c ON c.ID_HOA_DON = h.id " +
            "GROUP BY ms.thang " +
            "ORDER BY ms.thang ASC", nativeQuery = true)
    List<Object[]> findDoanhThuTheoThang(int year);


    @Query(value = "WITH QuarterSeries AS (" +
            "    SELECT 1 AS quy" +
            "    UNION ALL" +
            "    SELECT 2" +
            "    UNION ALL" +
            "    SELECT 3" +
            "    UNION ALL" +
            "    SELECT 4" +
            ")" +
            "SELECT qs.quy, ISNULL(SUM(c.so_luong * c.gia_spct_hien_tai), 0) AS doanhThu " +
            "FROM QuarterSeries qs " +
            "LEFT JOIN hoa_don h ON " +
            "    CASE " +
            "        WHEN MONTH(h.THOI_GIAN_TAO) IN (1, 2, 3) THEN 1 " +
            "        WHEN MONTH(h.THOI_GIAN_TAO) IN (4, 5, 6) THEN 2 " +
            "        WHEN MONTH(h.THOI_GIAN_TAO) IN (7, 8, 9) THEN 3 " +
            "        WHEN MONTH(h.THOI_GIAN_TAO) IN (10, 11, 12) THEN 4 " +
            "    END = qs.quy " +
            "AND YEAR(h.THOI_GIAN_TAO) = ?1 " +  // Thay thế bằng năm người dùng nhập vào
            "AND h.trang_thai = 'Hoàn Thành' " +
            "LEFT JOIN chi_tiet_hoa_don c ON c.ID_HOA_DON = h.id " +
            "GROUP BY qs.quy " +
            "ORDER BY qs.quy ASC",
            nativeQuery = true)
    List<Object[]> findDoanhThuTheoQuy(int year);


    @Query(value = "WITH YearSeries AS (" +
            "    SELECT ?1 AS nam " +
            "    UNION ALL " +
            "    SELECT nam + 1 " +
            "    FROM YearSeries " +
            "    WHERE nam < ?2 " +
            ") " +
            "SELECT ys.nam, ISNULL(SUM(c.so_luong * c.gia_spct_hien_tai), 0) AS doanhThu " +
            "FROM YearSeries ys " +
            "LEFT JOIN hoa_don h ON YEAR(h.THOI_GIAN_TAO) = ys.nam AND h.trang_thai = 'Hoàn Thành' " +
            "LEFT JOIN chi_tiet_hoa_don c ON c.ID_HOA_DON = h.id " +
            "GROUP BY ys.nam " +
            "ORDER BY ys.nam ASC",
            nativeQuery = true)
    List<Object[]> findDoanhThuTheoKhoangNam(int startYear, int endYear);

}
