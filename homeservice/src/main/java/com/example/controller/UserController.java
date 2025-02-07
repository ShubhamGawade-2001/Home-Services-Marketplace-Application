package com.example.controller;

import com.example.model.User;
import com.example.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/users")  // This ensures that /users/register is mapped
public class UserController {
    
	
    @Autowired
    private UserService userService;

    @CrossOrigin(origins = "http://localhost:5173")
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody User user) {
        return ResponseEntity.ok(userService.registerUser(user));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> loginData) {
        String email = loginData.get("email");
        String password = loginData.get("password");

        if (email == null || password == null) {
            return ResponseEntity.badRequest().body("Email and password are required");
        }

        Optional<User> user = userService.loginUser(email, password);
        
        if (user.isPresent()) {
            User loggedInUser = user.get();
            return ResponseEntity.ok(Map.of(
                "id", loggedInUser.getId(),
                "name", loggedInUser.getFullName(),
                "email", loggedInUser.getEmail()
            ));
        } else {
            return ResponseEntity.status(401).body("Invalid credentials");
        }
    }

    }


