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

    // 1️⃣ Create a Booking
    public Booking createBooking(Long customerId, Long serviceProviderId) {
        Optional<User> customer = userRepository.findById(customerId);
        Optional<ServiceProvider> provider = serviceProviderRepository.findById(serviceProviderId);
        
        if (customer.isEmpty() || provider.isEmpty()) {
            throw new RuntimeException("Invalid customer or provider ID");
        }
        if (customer.isPresent() && provider.isPresent()) {
            // Check if a booking already exists
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


    // 2️⃣ Get Booking Details by ID
    public Optional<Booking> getBookingById(Long id) {
        return bookingRepository.findById(id);
    }

    // 3️⃣ Get All Bookings for a Customer
    public List<Booking> getBookingsByCustomer(Long customerId) {
        return bookingRepository.findByCustomerId(customerId);
    }

    // 4️⃣ Get All Bookings for a Service Provider
    public List<Booking> getBookingsByProvider(Long providerId) {
        return bookingRepository.findByServiceProviderId(providerId);
    }

    // 5️⃣ Accept or Reject a Booking
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

    // 6️⃣ Cancel a Booking
    public String cancelBooking(Long bookingId) {
        Optional<Booking> booking = bookingRepository.findById(bookingId);
        if (booking.isPresent()) {
            bookingRepository.deleteById(bookingId);
            return "Booking canceled successfully";
        } else {
            throw new RuntimeException("Booking not found");
        }
    }
}
