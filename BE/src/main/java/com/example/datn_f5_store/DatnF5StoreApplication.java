package com.example.datn_f5_store;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class DatnF5StoreApplication {

    public static void main(String[] args) {
        SpringApplication.run(DatnF5StoreApplication.class, args);
    }

}
