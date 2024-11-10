
package com.example.datn_f5_store.response;

import com.example.datn_f5_store.entity.MauSacEntity;
import com.example.datn_f5_store.entity.SanPhamEntity;
import com.example.datn_f5_store.entity.SizeEntity;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ChiTietSanPhamReponse {


    private Integer id;

    private SanPhamEntity San_pham;

    private MauSacEntity mauSac;

    private SizeEntity size;

    private String ma;

    private String moTa;

    private Double donGia;

    private Integer soLuong;

    private String trangThai;
}
