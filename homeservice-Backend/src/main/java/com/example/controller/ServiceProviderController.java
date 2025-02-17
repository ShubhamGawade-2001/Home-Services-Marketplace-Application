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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.model.Availability;
import com.example.model.Role;
import com.example.model.ServiceProvider;
import com.example.model.User;
import com.example.repository.ServiceProviderRepository;
import com.example.repository.UserRepository;
import com.example.service.ServiceProviderService;

@CrossOrigin(origins = {"http://localhost:3000","http://localhost:3001"})
@RestController
@RequestMapping("/service")
public class ServiceProviderController {

    @Autowired
    private ServiceProviderService serviceProviderService;
    
    @Autowired
    private ServiceProviderRepository serviceProviderRepository;
    
    @Autowired
    private UserRepository userRepo;

   
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> loginData) {
        String email = loginData.get("email");
        String password = loginData.get("password");

        if (email == null || password == null) {
            return ResponseEntity.badRequest().body("Email and password are required");
        }

        User user = userRepo.findByEmail(email).get();

        
        if (user!=null && user.getRole()==Role.SERVICE_PROVIDER) {

            return ResponseEntity.ok(Map.of(
                "id", user.getId(),
                "name", user.getFullName(),
                "email", user.getEmail()
            ));
        } else {
            return ResponseEntity.status(401).body("Invalid credentials");
        }
    }

    // 1️⃣ Add a new service
    @PostMapping("/add")
    public ServiceProvider addService(@RequestBody ServiceProvider serviceProvider) {
        return serviceProviderService.addService(serviceProvider);
    }

    // 2️⃣ Get all services
    @GetMapping("/services")
    public List<ServiceProvider> getAllServices() {
        return serviceProviderRepository.findAll(); // Fetch all services from DB
    }
    
    @GetMapping("/provider/{providerId}")
    public List<ServiceProvider> getByUserId(@PathVariable Long providerId){
    	return serviceProviderService.getByUserId(providerId);
    }

    // 3️⃣ Get services by category
    @GetMapping("/category")
    public List<ServiceProvider> getServicesByCategory(@RequestParam String category) {
        return serviceProviderService.getServicesByCategory(category);
    }
    
    @GetMapping("/categories")
    public List<String> getCategories() {
        return serviceProviderRepository.findDistinctCategories();
    }

    // 4️⃣ Get service by ID
    @GetMapping("/id/{id}")
    public Optional<ServiceProvider> getServiceById(@PathVariable Long id) {
        return serviceProviderService.getServiceById(id);
    }

    // 5️⃣ Delete a service
    @DeleteMapping("/delete/{id}")
    public String deleteService(@PathVariable Long id) {
        serviceProviderService.deleteService(id);
        return "Service deleted successfully!";
    }
    
    @PutMapping("/profile/update/{id}")
    public ResponseEntity<?> updateServiceProviderProfile(@PathVariable Long id, @RequestBody ServiceProvider updatedServiceProvider) {
        Optional<ServiceProvider> existingServiceProvider = serviceProviderService.getServiceById(id);

        if (existingServiceProvider.isPresent()) {
            ServiceProvider serviceProvider = existingServiceProvider.get();
            serviceProvider.setServiceName(updatedServiceProvider.getServiceName());
            serviceProvider.getUser().setEmail(updatedServiceProvider.getUser().getEmail());
            serviceProvider.getUser().setAddress(updatedServiceProvider.getUser().getAddress());

            if (updatedServiceProvider.getUser().getPassword() != null && !updatedServiceProvider.getUser().getPassword().isEmpty()) {
                serviceProvider.getUser().setPassword(updatedServiceProvider.getUser().getPassword());
            }

            serviceProviderService.saveServiceProvider(serviceProvider);
            return ResponseEntity.ok("Profile updated successfully");
        } else {
            return ResponseEntity.status(404).body("Service Provider not found");
        }
    }
    
    @PutMapping("/toggle/{id}")
    public ResponseEntity<?> toggleServiceAvailability(@PathVariable Long id, @RequestBody Map<String, String> request) {
        Optional<ServiceProvider> serviceOptional = serviceProviderService.getServiceById(id);

        if (serviceOptional.isPresent()) {
            ServiceProvider service = serviceOptional.get();
            String newAvailability = request.get("availability"); 
            Availability abc = Availability.valueOf(newAvailability);
            
            service.setAvailability(abc);
            serviceProviderService.addService(service);

            return ResponseEntity.ok("Service availability updated");
        } else {
            return ResponseEntity.status(404).body("Service not found");
        }
    }
    
    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateServiceProviderProfile(@PathVariable Long id, @RequestBody Map<String, Object> request) {
        Optional<ServiceProvider> existingServiceProvider = serviceProviderService.getServiceById(id);

        if (existingServiceProvider.isPresent()) {
            ServiceProvider serviceProvider = existingServiceProvider.get();

            String serviceName = (String) request.get("serviceName");
            Double price = (Double) request.get("price");

            serviceProvider.setServiceName(serviceName);
            serviceProvider.setPrice(price);
            serviceProviderService.saveServiceProvider(serviceProvider);

            return ResponseEntity.ok("Profile updated successfully");
        } else {
            return ResponseEntity.status(404).body("Service Provider not found");
        }
    }



    }