package com.example.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.example.model.Admin;
import com.example.repository.AdminRepository;

import java.util.Optional;

@Service
public class AdminService {

    @Autowired
    private AdminRepository adminRepository;

    public String register(String email, String password) {
        // Check if admin already exists
        if (adminRepository.findByEmail(email).isPresent()) {
            return "User already exists";
        }

        Admin admin = new Admin();
        admin.setEmail(email);
        admin.setPassword(password);  
        adminRepository.save(admin);
        return "User registered successfully";
    }

    public Admin getAdminByEmail(String email) {
        //  provided by Spring Data JPA
        Optional<Admin> userOptional = adminRepository.findByEmail(email);
        return userOptional.orElse(null);  
    }

    public String login(String email, String password) {
        Admin admin = getAdminByEmail(email);  

        if (admin == null) {
            return "Admin not found";  
        }

        
        if (admin.getPassword().equals(password)) {
            return "Login successful";
        } else {
            return "Invalid credentials";
        }
    }
}
