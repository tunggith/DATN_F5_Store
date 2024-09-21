package com.example.datn_f5_store.request;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class SanPhamRequest {
    private Integer id;
    private XuatXuRequest xuatXu;
    private ThuongHieuRequest thuongHieu;
    private ChatLieuRequest chatLieu;
    private String ma;
    private String ten;
    private String trangThai;
}
