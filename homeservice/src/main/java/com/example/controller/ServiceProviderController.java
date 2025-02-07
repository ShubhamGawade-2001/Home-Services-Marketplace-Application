package com.example.controller;

import com.example.model.ServiceProvider;
import com.example.repository.ServiceProviderRepository;
import com.example.service.ServiceProviderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api")
public class ServiceProviderController {

    @Autowired
    private ServiceProviderService serviceProviderService;
    
    private final ServiceProviderRepository serviceProviderRepository;

    public ServiceProviderController(ServiceProviderRepository serviceProviderRepository) {
        this.serviceProviderRepository = serviceProviderRepository;
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

    // 3️⃣ Get services by category
    @GetMapping("/category")
    public List<ServiceProvider> getServicesByCategory(@RequestParam String category) {
        return serviceProviderService.getServicesByCategory(category);
    }

    // 4️⃣ Get service by ID
    @GetMapping("/{id}")
    public Optional<ServiceProvider> getServiceById(@PathVariable Long id) {
        return serviceProviderService.getServiceById(id);
    }

    // 5️⃣ Delete a service
    @DeleteMapping("/delete/{id}")
    public String deleteService(@PathVariable Long id) {
        serviceProviderService.deleteService(id);
        return "Service deleted successfully!";
    }
}
