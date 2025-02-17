package com.example.controller;


import com.example.model.Dispute;
import com.example.model.DisputeStatus;
import com.example.service.DisputeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/disputes")
@CrossOrigin(origins = {"http://localhost:3000","http://localhost:3001"})
public class DisputeController {

    @Autowired
    private DisputeService disputeService;

    @PostMapping("/raise")
    public ResponseEntity<Dispute> raiseDispute(@RequestBody Dispute dispute) {
        Dispute savedDispute = disputeService.createDispute(dispute);
        return ResponseEntity.ok(savedDispute);
    }

    @GetMapping
    public ResponseEntity<List<Dispute>> getAllDisputes() {
        return ResponseEntity.ok(disputeService.getAllDisputes());
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<Dispute>> getDisputesByStatus(@PathVariable DisputeStatus status) {
        return ResponseEntity.ok(disputeService.getDisputesByStatus(status));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Dispute> getDisputeById(@PathVariable Long id) {
        Optional<Dispute> dispute = disputeService.getDisputeById(id);
        return dispute.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}/update-status")
    public ResponseEntity<Dispute> updateDisputeStatus(@PathVariable Long id, @RequestParam DisputeStatus status) {
        Dispute updatedDispute = disputeService.updateDisputeStatus(id, status);
        if (updatedDispute != null) {
            return ResponseEntity.ok(updatedDispute);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}

