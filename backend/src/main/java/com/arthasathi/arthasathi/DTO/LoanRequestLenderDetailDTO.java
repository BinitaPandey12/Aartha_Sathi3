package com.arthasathi.arthasathi.DTO;

import java.math.BigDecimal;
import java.time.LocalDate;

public class LoanRequestLenderDetailDTO {
    private String borrowerName;
    private String borrowerEmail;
    private java.math.BigDecimal amount;
    private java.math.BigDecimal maxInterest;
    private java.time.LocalDate repaymentDate;
    private String description;
    private String status;
    private String createdAt;

    public String getBorrowerName() {
        return borrowerName;
    }

    public void setBorrowerName(String borrowerName) {
        this.borrowerName = borrowerName;
    }

    public String getBorrowerEmail() {
        return borrowerEmail;
    }

    public void setBorrowerEmail(String borrowerEmail) {
        this.borrowerEmail = borrowerEmail;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }
// getters and setters

    public LocalDate getRepaymentDate() {
        return repaymentDate;
    }

    public void setRepaymentDate(LocalDate repaymentDate) {
        this.repaymentDate = repaymentDate;
    }

    public BigDecimal getMaxInterest() {
        return maxInterest;
    }

    public void setMaxInterest(BigDecimal maxInterest) {
        this.maxInterest = maxInterest;
    }
}
