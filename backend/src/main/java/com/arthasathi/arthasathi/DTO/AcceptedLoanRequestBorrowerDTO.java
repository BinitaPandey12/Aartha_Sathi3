package com.arthasathi.arthasathi.DTO;

import java.math.BigDecimal;
import java.time.LocalDate;

public class AcceptedLoanRequestBorrowerDTO {
    private Long id;
    private java.math.BigDecimal amount;
    private java.math.BigDecimal maxInterest;
    private java.math.BigDecimal adjustedInterest;
    private java.time.LocalDate repaymentDate;
    private String description;
    private String status;
    private String createdAt;
    private String lenderName;
    private String lenderEmail;

    public String getLenderEmail() {
        return lenderEmail;
    }

    public void setLenderEmail(String lenderEmail) {
        this.lenderEmail = lenderEmail;
    }

    public String getLenderName() {
        return lenderName;
    }

    public void setLenderName(String lenderName) {
        this.lenderName = lenderName;
    }

    public String getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDate getRepaymentDate() {
        return repaymentDate;
    }

    public void setRepaymentDate(LocalDate repaymentDate) {
        this.repaymentDate = repaymentDate;
    }

    public BigDecimal getAdjustedInterest() {
        return adjustedInterest;
    }

    public void setAdjustedInterest(BigDecimal adjustedInterest) {
        this.adjustedInterest = adjustedInterest;
    }

    public BigDecimal getMaxInterest() {
        return maxInterest;
    }

    public void setMaxInterest(BigDecimal maxInterest) {
        this.maxInterest = maxInterest;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }
// getters and setters
}
