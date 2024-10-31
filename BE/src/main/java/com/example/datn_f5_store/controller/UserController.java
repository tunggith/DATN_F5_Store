package com.example.datn_f5_store.controller;

import com.example.datn_f5_store.jwt.JwtUtil;
import com.example.datn_f5_store.request.NhanVienRequest;
import com.example.datn_f5_store.response.DataResponse;
import com.example.datn_f5_store.response.LoginResponse;
import com.example.datn_f5_store.service.IUserService;
import com.example.datn_f5_store.service.impl.CustomUsserDetailsService;
import io.swagger.v3.oas.annotations.Parameter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/auth")
public class UserController {
    @Autowired
    private IUserService userService;
    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private CustomUsserDetailsService userDetailsService;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/login")
    public ResponseEntity<Object> login(@RequestParam String username, @RequestParam String password) {
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(username, password));
        String role = userDetailsService.loadUserByUsername(username).getAuthorities()
                .stream().findFirst().orElse(null).getAuthority();
        String token = jwtUtil.generateToken(username, role);
        LoginResponse loginResponse = new LoginResponse();
        loginResponse.setToken(token);
        loginResponse.setRole(role);
        return ResponseEntity.ok(loginResponse);
    }

    @PostMapping("reset-password")
    private ResponseEntity<Object> resetPassword(
            @Parameter(name = "username") @RequestParam String username,
            @Parameter(name = "passwordOld") @RequestParam String passwordOld,
            @Parameter(name = "passwordNew") @RequestParam String passwordNew
    ) {
        return new ResponseEntity<>(userService.changePassword(username, passwordOld, passwordNew), HttpStatus.OK);
    }
}
