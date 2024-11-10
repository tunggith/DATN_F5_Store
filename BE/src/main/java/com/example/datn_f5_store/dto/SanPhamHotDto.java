package com.example.datn_f5_store.dto;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Data
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class SanPhamHotDto {
    private Long id;
    private Long chiTietSanPhamId;
    private String urlAnh;
    private Long totalSold;

    public SanPhamHotDto(Long id, Long chiTietSanPhamId, String urlAnh) {
        this.id = id;
        this.chiTietSanPhamId = chiTietSanPhamId;
        this.urlAnh = urlAnh;
    }
}
