package com.example.service;

import com.example.model.ServiceProvider;
import com.example.model.User;
import com.example.repository.ServiceProviderRepository;
import com.example.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ServiceProviderService {

    @Autowired
    private ServiceProviderRepository serviceProviderRepository;

    @Autowired
    private UserRepository userRepository; // Add UserRepository to fetch user

    public ServiceProvider addService(ServiceProvider serviceProvider) {
        // Fetch the full User object before saving
        Optional<User> userOptional = userRepository.findById(serviceProvider.getUser().getId());
        
        if (userOptional.isPresent()) {
            serviceProvider.setUser(userOptional.get()); // Set the full user object
            return serviceProviderRepository.save(serviceProvider);
        } else {
            throw new RuntimeException("User not found with ID: " + serviceProvider.getUser().getId());
        }
    }

    public List<ServiceProvider> getAllServices() {
        return serviceProviderRepository.findAll();
    }

    public List<ServiceProvider> getServicesByCategory(String category) {
        return serviceProviderRepository.findByCategory(category);
    }

    public Optional<ServiceProvider> getServiceById(Long id) {
        return serviceProviderRepository.findById(id);
    }

    public void deleteService(Long id) {
        serviceProviderRepository.deleteById(id);
    }
}
