package com.arthasathi.arthasathi.DTO;

import java.math.BigDecimal;
import java.time.LocalDate;

public class LoanOfferPendingDTO {
    private BigDecimal amount;
    private BigDecimal interestRate;
    private LocalDate repaymentDate;
    private String description;
    private String createdAt;

    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }

    public BigDecimal getInterestRate() { return interestRate; }
    public void setInterestRate(BigDecimal interestRate) { this.interestRate = interestRate; }

    public LocalDate getRepaymentDate() { return repaymentDate; }
    public void setRepaymentDate(LocalDate repaymentDate) { this.repaymentDate = repaymentDate; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }
}
