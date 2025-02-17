package com.example.service;


import com.example.model.Dispute;
import com.example.model.DisputeStatus;
import com.example.repository.DisputeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DisputeService {

    @Autowired
    private DisputeRepository disputeRepository;

    public Dispute createDispute(Dispute dispute) {
        return disputeRepository.save(dispute);
    }

    public List<Dispute> getAllDisputes() {
        return disputeRepository.findAll();
    }

    public List<Dispute> getDisputesByStatus(DisputeStatus status) {
        return disputeRepository.findByStatus(status);
    }

    public Optional<Dispute> getDisputeById(Long id) {
        return disputeRepository.findById(id);
    }

    public Dispute updateDisputeStatus(Long id, DisputeStatus newStatus) {
        Optional<Dispute> optionalDispute = disputeRepository.findById(id);
        if (optionalDispute.isPresent()) {
            Dispute dispute = optionalDispute.get();
            dispute.setStatus(newStatus);
            return disputeRepository.save(dispute);
        }
        return null;
    }
}

