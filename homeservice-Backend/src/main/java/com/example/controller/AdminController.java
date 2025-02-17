package com.example.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.model.LoginRequest;
import com.example.service.AdminService;

@RestController
@RequestMapping("/admin")
@CrossOrigin(origins="http://localhost:3001")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @PostMapping("/register")
    public String register(@RequestParam String email, @RequestParam String password) {
        return adminService.register(email, password);
    }


    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody LoginRequest loginRequest) {
        String result = adminService.login(loginRequest.getEmail(), loginRequest.getPassword());

        if ("Login successful".equals(result)) {
            return ResponseEntity.ok("Login successful");
        } else {
            return ResponseEntity.status(401).body("Invalid email or password");
        }
    }

    }
