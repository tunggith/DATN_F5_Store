package com.example.datn_f5_store.repository;

import com.example.datn_f5_store.dto.NhanVienDto;
import com.example.datn_f5_store.entity.NhanVienEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface INhanVienRepository extends JpaRepository<NhanVienEntity, Integer> {
    Page<NhanVienEntity> getByTenContainingOrMaContaining(String ten, String ma, Pageable pageable);
    NhanVienEntity getByUsernameAndPassword(String username,String password);
    NhanVienEntity findByUsername(String username);

    @Query("SELECT new com.example.datn_f5_store.dto.NhanVienDto(e.id, e.ma, e.ten, e.gioiTinh, e.ngayThangNamSinh, e.email, e.sdt, e.diaChi, e.anh, e.roles, e.username, e.password, e.nguoiTao, e.thoiGianTao, e.nguoiSua, e.thoiGianSua, e.trangThai) " +
            "FROM NhanVienEntity e WHERE e.id != 1")
    Page<NhanVienDto> getAll(Pageable pageable);


}
