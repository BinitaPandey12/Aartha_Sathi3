package com.arthasathi.arthasathi.DTO;

import java.math.BigDecimal;
import java.time.LocalDate;

public class LoanRequestLenderDashboardDTO {
    private String borrowerName;
    private java.math.BigDecimal amount;
    private java.math.BigDecimal maxInterest;
    private java.time.LocalDate repaymentDate;
    private int trustScore = 5; // always 5

    public BigDecimal getAmount() {
        return amount;
    }

    public int getTrustScore() {
        return trustScore;
    }

    public void setTrustScore(int trustScore) {
        this.trustScore = trustScore;
    }

    public LocalDate getRepaymentDate() {
        return repaymentDate;
    }

    public void setRepaymentDate(LocalDate repaymentDate) {
        this.repaymentDate = repaymentDate;
    }

    public BigDecimal getMaxInterest() {
        return maxInterest;
    }

    public void setMaxInterest(BigDecimal maxInterestRate) {
        this.maxInterest = maxInterestRate;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public String getBorrowerName() {
        return borrowerName;
    }

    public void setBorrowerName(String borrowerName) {
        this.borrowerName = borrowerName;
    }

    // getters and setters
}
