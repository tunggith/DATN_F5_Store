package com.example.datn_f5_store.security;

import com.example.datn_f5_store.service.user.CustomUserDetailsService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        // Cấu hình bảo mật
        http
                .authorizeHttpRequests(authorize -> authorize
                        .requestMatchers("/api/auth/**").permitAll() // Cho phép truy cập vào các endpoint đăng nhập
                        .requestMatchers("/v3/api-docs/**").permitAll() // Cho phép truy cập vào tài liệu Swagger
                        .requestMatchers("/swagger-ui/**").permitAll()// Cho phép truy cập vào Swagger UI
                        .anyRequest().authenticated() // Tất cả các yêu cầu khác đều cần xác thực
                )
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS) // Sử dụng JWT
                )
                .csrf(csrf -> csrf.disable()); // Vô hiệu hóa CSRF nếu không cần thiết

        // Thêm các bộ lọc JWT nếu cần
        // http.addFilterBefore(jwtAuthenticationFilter(), UsernamePasswordAuthenticationFilter.class);

        return http.build(); // Trả về SecurityFilterChain
    }

    @Bean
    public AuthenticationManager authManager(HttpSecurity http) throws Exception {
        AuthenticationManagerBuilder authenticationManagerBuilder =
                http.getSharedObject(AuthenticationManagerBuilder.class);
        // Thêm cấu hình để xác thực người dùng tại đây (vd: dùng CustomUserDetailsService)
        authenticationManagerBuilder.userDetailsService(customUserDetailsService()).passwordEncoder(passwordEncoder());
        return authenticationManagerBuilder.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(); // Mã hóa mật khẩu
    }

    @Bean
    public CustomUserDetailsService customUserDetailsService() {
        return new CustomUserDetailsService(); // Khởi tạo CustomUserDetailsService
    }
}



