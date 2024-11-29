package com.example.datn_f5_store.response;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DataResponse2 {
    private boolean status;
    private ResultModel2<?> result;
}
