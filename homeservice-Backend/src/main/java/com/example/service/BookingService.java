package com.example.service;

import com.example.model.Booking;
import com.example.model.BookingStatus;
import com.example.model.ServiceProvider;
import com.example.model.User;
import com.example.repository.BookingRepository;
import com.example.repository.ServiceProviderRepository;
import com.example.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ServiceProviderRepository serviceProviderRepository;

    public Booking createBooking(Long customerId, Long serviceProviderId) {
        Optional<User> customer = userRepository.findById(customerId);
        Optional<ServiceProvider> provider = serviceProviderRepository.findById(serviceProviderId);
        
        if (customer.isEmpty() || provider.isEmpty()) {
            throw new RuntimeException("Invalid customer or provider ID");
        }
        if (customer.isPresent() && provider.isPresent()) {
            List<Booking> existingBookings = bookingRepository.findByCustomerId(customerId);
            for (Booking b : existingBookings) {
                if (b.getServiceProvider().getId().equals(serviceProviderId) && b.getStatus() == BookingStatus.PENDING) {
                    throw new RuntimeException("You already have a pending booking with this provider!");
                }
            }

            Booking booking = new Booking();
            booking.setCustomer(customer.get());
            booking.setServiceProvider(provider.get());
            booking.setBookingDate(LocalDateTime.now());
            booking.setStatus(BookingStatus.PENDING);

            return bookingRepository.save(booking);
        } else {
            throw new RuntimeException("Invalid customer or provider ID");
        }
    }


    public Booking saveBooking(Booking booking) {
    	bookingRepository.save(booking);
    	return booking;
    }
    
    public Optional<Booking> getBookingById(Long id) {
        return bookingRepository.findById(id);
    }

    public List<Booking> getBookingsByCustomer(Long customerId) {
        return bookingRepository.findByCustomerId(customerId);
    }

    public List<Booking> getBookingsByProvider(Long providerId) {
        return bookingRepository.findByServiceProviderId(providerId);
    }

    public Booking updateBookingStatus(Long bookingId, BookingStatus status) {
        Optional<Booking> bookingOptional = bookingRepository.findById(bookingId);
        if (bookingOptional.isPresent()) {
            Booking booking = bookingOptional.get();
            booking.setStatus(status);
            return bookingRepository.save(booking);
        } else {
            throw new RuntimeException("Booking not found");
        }
    }

    public String cancelBooking(Long bookingId) {
        Optional<Booking> booking = bookingRepository.findById(bookingId);
        if (booking.isPresent()) {
            bookingRepository.deleteById(bookingId);
            return "Booking canceled successfully";
        } else {
            throw new RuntimeException("Booking not found");
        }
    }


    public List<Booking> getCompletedAndCancelledBookings(Long userId) {
        return bookingRepository.findByCustomerIdAndStatusIn(userId, Arrays.asList("COMPLETED", "CANCELLED"));
    }
    
    public double calculateTotalEarnings(Long providerId) {
        return bookingRepository.findByServiceProviderId(providerId)
                .stream()
                .filter(b -> b.getStatus() == BookingStatus.COMPLETED)
                .mapToDouble(b-> b.getServiceProvider().getPrice())
                .sum();
    }

    public long countCompletedBookings(Long providerId) {
        return bookingRepository.countByServiceProviderIdAndStatus(providerId, BookingStatus.COMPLETED);
    }

    public long countActiveBookings(Long providerId) {
        return bookingRepository.countByServiceProviderIdAndStatus(providerId, BookingStatus.ACCEPTED);
    }


}
