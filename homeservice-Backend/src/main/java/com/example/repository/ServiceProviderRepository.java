package com.example.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.example.model.ServiceProvider;

public interface ServiceProviderRepository extends JpaRepository<ServiceProvider, Long> {
    List<ServiceProvider> findByUserId(Long userId); 
    List<ServiceProvider> findByCategory(String category); 
    @Query("SELECT DISTINCT s.category FROM ServiceProvider s")
    List<String> findDistinctCategories();
}
