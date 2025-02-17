package com.example.controller;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.model.Booking;
import com.example.model.BookingStatus;
import com.example.model.BookingUpdateRequest;
import com.example.service.BookingService;

@RestController
@RequestMapping("/bookings")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    @PostMapping("/create")
    public Booking createBooking(@RequestParam Long customerId, @RequestParam Long providerId) {
        return bookingService.createBooking(customerId, providerId);
    }

    @GetMapping("/id/{id}")
    public Optional<Booking> getBookingById(@PathVariable Long id) {
        return bookingService.getBookingById(id);
    }

    @GetMapping("/customer/{customerId}")
    public List<Booking> getBookingsByCustomer(@PathVariable Long customerId) {
        return bookingService.getBookingsByCustomer(customerId);
    }

    @GetMapping("/provider/{providerId}")
    public List<Booking> getBookingsByProvider(@PathVariable Long providerId) {
        return bookingService.getBookingsByProvider(providerId);
    }

    @PutMapping("/update/{bookingId}")
    public Booking updateBookingStatus(@PathVariable Long bookingId, @RequestParam BookingStatus status) {
        return bookingService.updateBookingStatus(bookingId, status);
    }
    
    @PutMapping("/updateDateTime/{bookingId}")
    public ResponseEntity<?> rescheduleBooking(
            @PathVariable Long bookingId,
            @RequestBody BookingUpdateRequest request) {

        Optional<Booking> optionalBooking = bookingService.getBookingById(bookingId);

        if (optionalBooking.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Booking not found");
        }

        Booking booking = optionalBooking.get();
        
        // Convert String date & time to LocalDateTime
        try {
            LocalDateTime newBookingDateTime = LocalDateTime.parse(request.getDate() + "T" + request.getTime());
            booking.setBookingDate(newBookingDateTime);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid date/time format");
        }

        Booking updatedBooking = bookingService.saveBooking(booking);

        return ResponseEntity.ok(updatedBooking);
    }

    @GetMapping("/history/{userId}")
    public ResponseEntity<List<Booking>> getBookingHistory(@PathVariable Long userId) {
        List<Booking> bookings = bookingService.getCompletedAndCancelledBookings(userId);
        return ResponseEntity.ok(bookings);
    }


    @DeleteMapping("/cancel/{bookingId}")
    public String cancelBooking(@PathVariable Long bookingId) {
        return bookingService.cancelBooking(bookingId);
    }
    
    @GetMapping("/provider/{providerId}/earnings")
    public ResponseEntity<?> getTotalEarnings(@PathVariable Long providerId) {
        double totalEarnings = bookingService.calculateTotalEarnings(providerId);
        return ResponseEntity.ok(Map.of("totalEarnings", totalEarnings));
    }

    @GetMapping("/provider/{providerId}/completed")
    public ResponseEntity<?> getCompletedBookingsCount(@PathVariable Long providerId) {
        long count = bookingService.countCompletedBookings(providerId);
        return ResponseEntity.ok(Map.of("count", count));
    }

    @GetMapping("/provider/{providerId}/active")
    public ResponseEntity<?> getActiveBookingsCount(@PathVariable Long providerId) {
        long count = bookingService.countActiveBookings(providerId);
        return ResponseEntity.ok(Map.of("count", count));
    }

}
