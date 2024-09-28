package com.example.datn_f5_store.request;

import com.example.datn_f5_store.entity.ChiTietSanPhamEntity;
import jakarta.persistence.Column;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AnhChiTietSanPhamRequest {
    private Integer id;
    @ManyToOne
    @JoinColumn(name = "ID_CHI_TIET_SAN_PHAM")
    private ChiTietSanPhamEntity chiTietSanPham;
    @Column(name = "URL_ANH")
    @NotNull(message = "Url ảnh không được để trống")
    private String urlAnh;

}
