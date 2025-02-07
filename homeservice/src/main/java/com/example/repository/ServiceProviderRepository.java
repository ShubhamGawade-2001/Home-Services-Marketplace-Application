package com.example.repository;

import com.example.model.ServiceProvider;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ServiceProviderRepository extends JpaRepository<ServiceProvider, Long> {
    List<ServiceProvider> findByUserId(Long userId); // Get services of a provider
    List<ServiceProvider> findByCategory(String category); // Get services by category
}
