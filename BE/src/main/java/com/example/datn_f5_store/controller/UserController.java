package com.example.datn_f5_store.controller;

import com.example.datn_f5_store.request.NhanVienRequest;
import com.example.datn_f5_store.response.DataResponse;
import com.example.datn_f5_store.service.IUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/auth")
public class UserController {
    @Autowired
    private IUserService userService;
    @PostMapping("/login")
    private ResponseEntity<Object> login(@RequestBody NhanVienRequest request){
        return new ResponseEntity<>(userService.login(request), HttpStatus.OK);
    }
    @PostMapping("reset-password")
    private ResponseEntity<Object> resetPassword(@RequestBody NhanVienRequest request){
        return new ResponseEntity<>(userService.changePassword(request),HttpStatus.OK);
    }
}
