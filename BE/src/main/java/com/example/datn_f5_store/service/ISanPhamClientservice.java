package com.example.datn_f5_store.service;

import com.example.datn_f5_store.dto.ChiTietSanPhamDto;
import com.example.datn_f5_store.entity.AnhChiTietSanPham;
import com.example.datn_f5_store.entity.ChiTietSanPhamEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface ISanPhamClientservice {
    Page<AnhChiTietSanPham> getSanPham(int page, int size);

    /**
     * Lấy danh sách sản phẩm với các bộ lọc tùy chọn.
     *
     * @param gioiTinh    ID giới tính, có thể là null
     * @param thuongHieu  ID thương hiệu, có thể là null
     * @param xuatXu      ID xuất xứ, có thể là null
     * @param giaMin      Giá tối thiểu, mặc định là 0 nếu không được truyền vào
     * @param giaMax      Giá tối đa, mặc định là giá rất cao nếu không được truyền vào
     * @param mauSac      ID màu sắc, có thể là null
     * @param kichThuoc   ID kích thước, có thể là null
     * @param pageable    Thông tin phân trang
     * @return Trang chứa danh sách sản phẩm lọc theo tiêu chí
     */
    Page<AnhChiTietSanPham> getFilteredProducts(
            Integer gioiTinh,
            Integer thuongHieu,
            Integer xuatXu,
            Double giaMin,
            Double giaMax,
            Integer mauSac,
            Integer kichThuoc,
            Pageable pageable
    );
    ChiTietSanPhamEntity getSoLuong(Integer id);
    List<ChiTietSanPhamDto> getListChiTietSanPham();
}
