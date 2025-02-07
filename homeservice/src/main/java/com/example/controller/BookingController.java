package com.example.controller;

import com.example.model.Booking;
import com.example.model.BookingStatus;
import com.example.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/bookings")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    // 1️⃣ Create a new booking
    @PostMapping("/create")
    public Booking createBooking(@RequestParam Long customerId, @RequestParam Long providerId) {
        return bookingService.createBooking(customerId, providerId);
    }

    // 2️⃣ Get booking by ID
    @GetMapping("/{id}")
    public Optional<Booking> getBookingById(@PathVariable Long id) {
        return bookingService.getBookingById(id);
    }

    // 3️⃣ Get bookings for a customer
    @GetMapping("/customer/{customerId}")
    public List<Booking> getBookingsByCustomer(@PathVariable Long customerId) {
        return bookingService.getBookingsByCustomer(customerId);
    }

    // 4️⃣ Get bookings for a provider
    @GetMapping("/provider/{providerId}")
    public List<Booking> getBookingsByProvider(@PathVariable Long providerId) {
        return bookingService.getBookingsByProvider(providerId);
    }

    // 5️⃣ Accept or reject a booking
    @PutMapping("/update/{bookingId}")
    public Booking updateBookingStatus(@PathVariable Long bookingId, @RequestParam BookingStatus status) {
        return bookingService.updateBookingStatus(bookingId, status);
    }

    // 6️⃣ Cancel a booking
    @DeleteMapping("/cancel/{bookingId}")
    public String cancelBooking(@PathVariable Long bookingId) {
        return bookingService.cancelBooking(bookingId);
    }
}
