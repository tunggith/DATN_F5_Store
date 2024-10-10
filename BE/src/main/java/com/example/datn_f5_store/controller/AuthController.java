package com.example.datn_f5_store.controller;

import com.example.datn_f5_store.jwt.JwTokenProvider;
import com.example.datn_f5_store.service.user.CustomUserDetailsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private CustomUserDetailsService userDetailsService;

    @Autowired
    private JwTokenProvider jwTokenProvider; // Sử dụng JwTokenProvider thay vì JwtUtil

    @GetMapping("/login")
    public String login(@RequestParam String username, @RequestParam String password) {
        // Xác thực người dùng
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(username, password));

        // Tạo token
        String token = jwTokenProvider.generateToken(authentication);
        return token; // Trả về token cho người dùng
    }
}
