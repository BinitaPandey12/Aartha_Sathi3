
package com.arthasathi.arthasathi.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "loan_requests")
public class LoanRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "borrower_id", nullable = false)
    private User borrower;

    @NotNull
    @Column(nullable = false)
    private BigDecimal amount;

    @NotNull
    @Column(name = "max_interest_rate", nullable = false)
    private BigDecimal maxInterestRate;

    @NotNull
    @Column(name = "repayment_date", nullable = false)
    private LocalDate repaymentDate;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private LoanRequestStatus status = LoanRequestStatus.PENDING;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
// In LoanRequest.java

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lender_id")
    private User lender; // The lender who accepted the request

    @Column(name = "adjusted_interest_rate")
    private BigDecimal adjustedInterestRate;

    // Getter and Setter for lender
    public User getLender() { return lender; }
    public void setLender(User lender) { this.lender = lender; }

    // Getter and Setter for adjustedInterestRate
    public BigDecimal getAdjustedInterestRate() { return adjustedInterestRate; }
    public void setAdjustedInterestRate(BigDecimal adjustedInterestRate) { this.adjustedInterestRate = adjustedInterestRate; }

    // Constructors
    public LoanRequest() {}

    public LoanRequest(User borrower, BigDecimal amount, BigDecimal maxInterestRate, LocalDate repaymentDate, String description) {
        this.borrower = borrower;
        this.amount = amount;
        this.maxInterestRate = maxInterestRate;
        this.repaymentDate = repaymentDate;
        this.description = description;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getBorrower() {
        return borrower;
    }

    public void setBorrower(User borrower) {
        this.borrower = borrower;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public BigDecimal getMaxInterestRate() {
        return maxInterestRate;
    }

    public void setMaxInterestRate(BigDecimal maxInterestRate) {
        this.maxInterestRate = maxInterestRate;
    }

    public LocalDate getRepaymentDate() {
        return repaymentDate;
    }

    public void setRepaymentDate(LocalDate repaymentDate) {
        this.repaymentDate = repaymentDate;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LoanRequestStatus getStatus() {
        return status;
    }

    public void setStatus(LoanRequestStatus status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}