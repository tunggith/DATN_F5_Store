package com.example.datn_f5_store.request;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class SanPhamRequest {
    private Integer id;
    private Integer xuatXu;
    private Integer thuongHieu;
    private Integer chatLieu;
    private String ma;
    private String ten;
    private Integer trangThai;
}
