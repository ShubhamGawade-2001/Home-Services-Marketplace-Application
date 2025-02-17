package com.example.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.model.Booking;
import com.example.model.BookingStatus;

public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByCustomerId(Long customerId);
    List<Booking> findByServiceProviderId(Long providerId);
	List<Booking> findByCustomerIdAndStatusIn(Long userId, List<String> asList);
	
	long countByServiceProviderIdAndStatus(Long providerId, BookingStatus status);

}
