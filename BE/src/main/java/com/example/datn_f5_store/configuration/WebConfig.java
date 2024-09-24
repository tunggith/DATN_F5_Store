package com.example.datn_f5_store.configuration;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**") // Áp dụng cho tất cả các đường dẫn
                .allowedOrigins("http://localhost:4200") // Cho phép nguồn từ địa chỉ này
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS"); // Các phương thức được phép
    }
}
