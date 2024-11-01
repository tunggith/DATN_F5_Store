package com.example.datn_f5_store.controller;

import com.example.datn_f5_store.jwt.JwtUtil;
import com.example.datn_f5_store.request.NhanVienRequest;
import com.example.datn_f5_store.response.DataResponse;
import com.example.datn_f5_store.response.LoginResponse;
import com.example.datn_f5_store.service.IUserService;
import com.example.datn_f5_store.service.impl.CustomUsserDetailsService;
import io.swagger.v3.oas.annotations.Parameter;
import jakarta.mail.AuthenticationFailedException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

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
    public ResponseEntity<Object> login(@RequestParam String username, @RequestParam String password) throws AuthenticationFailedException {
        try{
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(username, password));
        String role = userDetailsService.loadUserByUsername(username).getAuthorities()
                .stream().findFirst().orElse(null).getAuthority();
        String token = jwtUtil.generateToken(username, role);
        LoginResponse loginResponse = new LoginResponse();
        loginResponse.setToken(token);
        loginResponse.setRole(role);
        return ResponseEntity.ok(loginResponse);
        } catch (AuthenticationException ex) {
            // Ném ngoại lệ khi xác thực thất bại
            throw new AuthenticationFailedException("Đăng nhập thất bại!");
        }
    }
    @PostMapping("/refresh-token")
    private ResponseEntity<Object> login(@RequestBody Map<String,String> request){
        String refreshToken = request.get("refreshToken");
            // Kiểm tra tính hợp lệ của refreshToken
        if (refreshToken != null && jwtUtil.validateRefreshToken(refreshToken)) {
            // Lấy thông tin người dùng từ refreshToken
            String username = jwtUtil.getUsernameFromToken(refreshToken);

            // Tạo accessToken mới
            String role = userDetailsService.loadUserByUsername(username).getAuthorities()
                    .stream().findFirst().orElse(null).getAuthority();
            String newAccessToken = jwtUtil.generateToken(username, role);

            // Tạo phản hồi và trả về
            Map<String, String> response = Map.of(
                    "token", newAccessToken,
                    "role", role
            );

            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Refresh token không hợp lệ hoặc đã hết hạn");
        }
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
