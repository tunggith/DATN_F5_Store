package com.example.datn_f5_store.response;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class KhachHangReponse {


    private Integer id;

    private String ma;

    private String ten;

    private String sdt;

    private String diaChi;

    private Integer trangThai;
}
