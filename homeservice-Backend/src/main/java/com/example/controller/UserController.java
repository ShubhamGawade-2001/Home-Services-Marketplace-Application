package com.example.controller;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.model.ApprovalStatus;
import com.example.model.Role;
import com.example.model.UnApprovedSP;
import com.example.model.User;
import com.example.service.UnApprovedSPService;
import com.example.service.UserService;

@CrossOrigin(origins = {"http://localhost:3000","http://localhost:3001"})
@RestController
@RequestMapping("/users")  
public class UserController {
    
	
    @Autowired
    private UserService userService;
    
    @Autowired
    private UnApprovedSPService unApprovedSPService;

    
//    @PostMapping("/register")
//    public ResponseEntity<?> registerUser(@RequestBody User user) {
//        return ResponseEntity.ok(userService.registerUser(user));
//    }
    
    @PostMapping("/register")
    public ResponseEntity<String> registerUser(@RequestBody User user) {
        try {
            if (user.getRole() == null) {
                return ResponseEntity.badRequest().body("Role is required");
            }

            
            if ("CUSTOMER".equals(user.getRole().toString())) {
                // Save as CUSTOMER
                userService.saveUser(user);
                return ResponseEntity.status(201).body("Registration successful");
            } 
            
            else if ("SERVICE_PROVIDER".equals(user.getRole().toString())) {
                // Save as SERVICE_PROVIDER (unapproved)
                UnApprovedSP unapprovedSP = new UnApprovedSP();
                unapprovedSP.setFullName(user.getFullName());
                unapprovedSP.setEmail(user.getEmail());
                unapprovedSP.setPassword(user.getPassword());
                unapprovedSP.setAddress(user.getAddress());
                unapprovedSP.setRole(user.getRole());
                unapprovedSP.setApprovalStatus(ApprovalStatus.UNAPPROVED); // Default to PENDING approval
                unApprovedSPService.saveUser(unapprovedSP);
                return ResponseEntity.status(201).body("Registration successful. Await approval.");
            } else {
                return ResponseEntity.badRequest().body("Invalid role");
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Internal server error");
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> loginData) {
        String email = loginData.get("email");
        String password = loginData.get("password");

        if (email == null || password == null) {
            return ResponseEntity.badRequest().body("Email and password are required");
        }

        Optional<User> user = userService.loginUser(email, password);
        
        if (user.isPresent() && user.get().getRole()==Role.CUSTOMER) {
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
    
    @GetMapping("/profile/{id}")
    public ResponseEntity<?> getUserProfile(@PathVariable Long id) {
        Optional<User> user = userService.getUserById(id);
        
        if (user.isPresent()) {
            return ResponseEntity.ok(user.get());
        } else {
            return ResponseEntity.status(404).body("User not found");
        }
    }
    
    @PutMapping("/profile/{id}")
    public ResponseEntity<?> updateUserProfile(@PathVariable Long id, @RequestBody User updatedUser) {
        Optional<User> existingUser = userService.getUserById(id);

        if (existingUser.isPresent()) {
            User user = existingUser.get();
            user.setFullName(updatedUser.getFullName());
            user.setEmail(updatedUser.getEmail());
            user.setAddress(updatedUser.getAddress());

            if (updatedUser.getPassword() != null && !updatedUser.getPassword().isEmpty()) {
                user.setPassword(updatedUser.getPassword()); 
            }

            userService.saveUser(user); 
            return ResponseEntity.ok("Profile updated successfully");
        } else {
            return ResponseEntity.status(404).body("User not found");
        }
    }
    
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable Long id) {
        Optional<User> user = userService.getUserById(id);

        if (user.isPresent()) {
            userService.deleteUser(id);
            return ResponseEntity.ok("User deleted successfully");
        } else {
            return ResponseEntity.status(404).body("User not found");
        }

    }
    
    
    @GetMapping("/")
    public ResponseEntity<?> getAllUsers() {
        List<User> users = userService.getAllUsers();
        if (users.isEmpty()) {
            return ResponseEntity.status(404).body("No users found");
        }
        return ResponseEntity.ok(users);
    }
    
    @PostMapping("/approve/{id}")
    public ResponseEntity<String> approveServiceProvider(@PathVariable Long id) {
    	return unApprovedSPService.approveServiceProvider(id);
    }
    
    @DeleteMapping("/reject/{id}")
    public ResponseEntity<String> rejectServiceProvider(@PathVariable Long id) {
    	return unApprovedSPService.rejectServiceProvider(id);
    }
    
    @GetMapping("/unapproved")
    public ResponseEntity<List<UnApprovedSP>> getUnapprovedServiceProviders() {
    	return unApprovedSPService.getUnapprovedServiceProviders();
    }


}


