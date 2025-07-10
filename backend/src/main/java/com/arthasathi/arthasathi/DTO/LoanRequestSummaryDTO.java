package com.arthasathi.arthasathi.DTO;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Future;
import java.math.BigDecimal;
import java.time.LocalDate;

public class LoanRequestSummaryDTO {
    private Long id;

    @NotNull(message = "Amount is required")
    @DecimalMin(value = "1.0", message = "Amount must be at least 1.0")
    private BigDecimal amount;

    @NotNull(message = "Maximum interest rate is required")
    @DecimalMin(value = "0.0", message = "Interest rate must be non-negative")
    private BigDecimal maxInterestRate;

    @NotNull(message = "Repayment date is required")
    @Future(message = "Repayment date must be in the future")
    private LocalDate repaymentDate;

    private String borrowerName;
    private Integer trustScore = 5; // Default trust score for new users

    // Constructors
    public LoanRequestSummaryDTO() {}

    public LoanRequestSummaryDTO(BigDecimal amount, BigDecimal maxInterestRate, LocalDate repaymentDate, String borrowerName) {
        this.amount = amount;
        this.maxInterestRate = maxInterestRate;
        this.repaymentDate = repaymentDate;
        this.borrowerName = borrowerName;
        this.trustScore = 5; // Default trust score
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public String getBorrowerName() {
        return borrowerName;
    }

    public void setBorrowerName(String borrowerName) {
        this.borrowerName = borrowerName;
    }

    public Integer getTrustScore() {
        return trustScore;
    }

    public void setTrustScore(Integer trustScore) {
        this.trustScore = trustScore;
    }
}
