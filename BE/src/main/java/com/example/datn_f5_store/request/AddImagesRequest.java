package com.example.datn_f5_store.request;

import lombok.Data;

import java.util.List;

@Data
public class AddImagesRequest {
    private Integer idSanPham; // ID sản phẩm
    private Integer idMauSac;  // ID màu sắc
    private List<String> urls; // Danh sách URL ảnh
}

