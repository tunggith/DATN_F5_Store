package com.example.datn_f5_store.service;

import com.example.datn_f5_store.request.NhanVienRequest;
import com.example.datn_f5_store.response.DataResponse;

public interface IUserService {
    DataResponse changePassword(String username,String passwordOld,String passwordNew);
}
