package com.example.datn_f5_store.response;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ChiTietGioHangReponse {
    private Integer id;
    private Integer idGh;
    private String sanPham;
    private Integer soLuong;
}
