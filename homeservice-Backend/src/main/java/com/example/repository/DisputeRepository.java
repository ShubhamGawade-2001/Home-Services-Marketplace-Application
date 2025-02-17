package com.example.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.model.Dispute;
import com.example.model.DisputeStatus;

public interface DisputeRepository extends JpaRepository<Dispute, Long> {
	List<Dispute> findByStatus(DisputeStatus status);
    List<Dispute> findByCustomer(String customer);
    List<Dispute> findByProvider(String provider);
}
