package com.example.datn_f5_store.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ResultModel<T> {
    private com.example.datn_f5_store.response.PagingModel pagination;
    private T content;

}

