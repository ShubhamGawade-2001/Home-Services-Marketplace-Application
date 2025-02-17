package com.example.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;

import com.example.model.UnApprovedSP;
import com.example.model.User;
import com.example.repository.UnApprovedSPRepository;
import com.example.repository.UserRepository;

@Service
public class UnApprovedSPService {
	
	@Autowired
	UnApprovedSPRepository unApprovedSPRepo;
	
	@Autowired
	UserRepository userRepository;
	
	public UnApprovedSP saveUser(UnApprovedSP user) {
        return unApprovedSPRepo.save(user); 
    }
	
    public ResponseEntity<String> approveServiceProvider(@PathVariable Long id) {
        try {
            UnApprovedSP unapprovedSP = unApprovedSPRepo.findById(id).orElseThrow(() -> new RuntimeException("Service provider not found"));
            User approvedUser = new User();
            approvedUser.setFullName(unapprovedSP.getFullName());
            approvedUser.setEmail(unapprovedSP.getEmail());
            approvedUser.setPassword(unapprovedSP.getPassword());
            approvedUser.setAddress(unapprovedSP.getAddress());
            approvedUser.setRole(unapprovedSP.getRole());

            // Save approved user
            userRepository.save(approvedUser);
            // Delete from unapproved SP table
            unApprovedSPRepo.delete(unapprovedSP);

            return ResponseEntity.ok("Service provider approved successfully");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Failed to approve service provider");
        }
    }
    
    public ResponseEntity<String> rejectServiceProvider(@PathVariable Long id) {
        try {
            UnApprovedSP unapprovedSP = unApprovedSPRepo.findById(id).orElseThrow(() -> new RuntimeException("Service provider not found"));
            // Delete from unapproved SP table
            unApprovedSPRepo.delete(unapprovedSP);

            return ResponseEntity.ok("Service provider rejected successfully");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Failed to reject service provider");
        }
    }
    

    public ResponseEntity<List<UnApprovedSP>> getUnapprovedServiceProviders() {
        try {
            List<UnApprovedSP> unapprovedSPList = unApprovedSPRepo.findAll();
            return ResponseEntity.ok(unapprovedSPList);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(null); // Internal Server Error
        }
    }
}
