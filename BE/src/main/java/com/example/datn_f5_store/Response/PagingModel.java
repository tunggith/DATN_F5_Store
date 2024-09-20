package com.example.datn_f5_store.Response;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class PagingModel {
    private Integer pageSize;
    private Integer pageNumber;
    private Long totalElement;
    private Integer totalPage;

    public PagingModel(Integer pageSize, Integer pageNumber, Long totalElement, Integer totalPage) {
        this.pageSize = pageSize;
        this.pageNumber = pageNumber;
        this.totalElement = totalElement;
        this.totalPage = totalPage;
    }
    public PagingModel(Long totalElement) {
        this.pageSize = 0;
        this.pageNumber = 1;
        this.totalElement = totalElement;
        this.totalPage = 1;
    }
}