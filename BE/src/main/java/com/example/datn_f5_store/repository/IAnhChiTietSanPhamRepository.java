package com.example.datn_f5_store.repository;

import com.example.datn_f5_store.entity.AnhChiTietSanPham;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface IAnhChiTietSanPhamRepository extends JpaRepository<AnhChiTietSanPham,Integer> {
    @Query("SELECT a FROM AnhChiTietSanPham a WHERE a.urlAnh LIKE %:search% ")
    Page<AnhChiTietSanPham> findBySearch(@Param("search") String search, Pageable pageable);
    Boolean existsByUrlAnh(String urlAnh);// Kiểm tra trùng tên đường dẫn
    Page<AnhChiTietSanPham> findByChiTietSanPham_Id(Integer id,Pageable pageable);

}
