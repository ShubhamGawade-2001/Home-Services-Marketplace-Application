package com.example;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(scanBasePackages = "com.example") // Ensures scanning of all components
public class HomeServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(HomeServiceApplication.class, args);
    }
}
