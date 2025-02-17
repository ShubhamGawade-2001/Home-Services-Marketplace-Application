package com.example.service;

import com.example.model.Role;
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
    private UserRepository userRepository; 

    public ServiceProvider addService(ServiceProvider serviceProvider) {
        Optional<User> userOptional = userRepository.findById(serviceProvider.getUser().getId());
        System.out.println(userOptional.get().getRole());
        if (userOptional.isPresent() && userOptional.get().getRole()==Role.SERVICE_PROVIDER) {
            serviceProvider.setUser(userOptional.get());
            return serviceProviderRepository.save(serviceProvider);
        } else {
            throw new RuntimeException("Service Provider not found with ID: " + serviceProvider.getUser().getId());
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

	public void saveServiceProvider(ServiceProvider serviceProvider) {
		serviceProviderRepository.save(serviceProvider);
		
	}

	public List<ServiceProvider> getByUserId(Long providerId) {
		return serviceProviderRepository.findByUserId(providerId);
	}
}
