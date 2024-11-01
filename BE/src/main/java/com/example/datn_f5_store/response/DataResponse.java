package com.example.datn_f5_store.response;
import com.example.datn_f5_store.response.ResultModel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DataResponse {
    private boolean status;
    private ResultModel<?> result;

}
