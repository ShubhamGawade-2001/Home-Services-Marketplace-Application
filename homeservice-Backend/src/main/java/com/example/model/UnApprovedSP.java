package com.example.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "unapproved_sp")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class UnApprovedSP {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
	private String fullName;
	
    @Column(unique = true, nullable = false)
    private String email;

    private String password;
    private String address;
    @Enumerated(EnumType.STRING)
    private Role role;  // CUSTOMER, SERVICE_PROVIDER
    
    @Enumerated(EnumType.STRING)
    private ApprovalStatus approvalStatus;

    public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public String getFullName() {
		return fullName;
	}
	public void setFullName(String fullName) {
		this.fullName = fullName;
	}
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	public String getPassword() {
		return password;
	}
	public void setPassword(String password) {
		this.password = password;
	}
	public String getAddress() {
		return address;
	}
	public void setAddress(String address) {
		this.address = address;
	}
	public Role getRole() {
		return role;
	}
	public void setRole(Role role) {
		this.role = role;
	}
	public ApprovalStatus getApprovalStatus() {
		return approvalStatus;
	}
	public void setApprovalStatus(ApprovalStatus approvalStatus) {
		this.approvalStatus = approvalStatus;
	}
	
	
    
    
}
