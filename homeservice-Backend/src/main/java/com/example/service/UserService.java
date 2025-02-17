package com.example.service;

import java.util.List;
import java.util.Optional;
import java.util.regex.Pattern;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.model.User;
import com.example.repository.UserRepository;

@Service
public class UserService {
    
    @Autowired
    private UserRepository userRepository;
    
    private static final Pattern EMAIL_PATTERN = Pattern.compile("^[A-Za-z0-9+_.-]+@(.+)$");
    private static final Pattern PASSWORD_PATTERN = Pattern.compile("^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d)(?=.*[@#$%^&+=]).{8,}$");

    public User registerUser(User user) {
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new RuntimeException("Email already registered!");
        }

        if (!EMAIL_PATTERN.matcher(user.getEmail()).matches()) {
            throw new RuntimeException("Invalid email format!");
        }

        if (!PASSWORD_PATTERN.matcher(user.getPassword()).matches()) {
            throw new RuntimeException("Password must contain at least 8 characters, including uppercase, lowercase, number, and special character!");
        }

        user.setPassword(user.getPassword());  
        return userRepository.save(user);  
    }

    // Login user
    public Optional<User> loginUser(String email, String password) {
        return userRepository.findByEmail(email)
                .filter(user -> user.getPassword().equals(password)); 
    }

    public User saveUser(User user) {
        return userRepository.save(user); 
    }


    // Get user by ID
    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id); // Find user by ID
    }

    // Update user profile
    public User updateUserProfile(Long id, User updatedUser) {
        Optional<User> existingUserOpt = userRepository.findById(id);
        
        if (existingUserOpt.isPresent()) {
            User existingUser = existingUserOpt.get();
            existingUser.setFullName(updatedUser.getFullName());
            existingUser.setEmail(updatedUser.getEmail());
            existingUser.setAddress(updatedUser.getAddress());
            existingUser.setPassword(updatedUser.getPassword());  
            return userRepository.save(existingUser);  
        } else {
            throw new RuntimeException("User not found with ID: " + id);  
        }
    }
    
    public void deleteUser(Long id) {
        Optional<User> user = userRepository.findById(id);
        if (user.isPresent()) {
            userRepository.delete(user.get());
        } else {
            throw new RuntimeException("User not found");
        }
    }
    public List<User> getAllUsers() {
        return userRepository.findAll(); 
    }
}
