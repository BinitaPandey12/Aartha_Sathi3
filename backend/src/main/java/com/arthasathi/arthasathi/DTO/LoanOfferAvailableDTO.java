package com.arthasathi.arthasathi.DTO;

import java.math.BigDecimal;
import java.time.LocalDate;

public class LoanOfferAvailableDTO {
    private BigDecimal amount;
    private BigDecimal interestRate;
    private LocalDate repaymentDate;
    private String description;
    private String lenderName;
    private String lenderEmail;
    private String createdAt;

    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }

    public BigDecimal getInterestRate() { return interestRate; }
    public void setInterestRate(BigDecimal interestRate) { this.interestRate = interestRate; }

    public LocalDate getRepaymentDate() { return repaymentDate; }
    public void setRepaymentDate(LocalDate repaymentDate) { this.repaymentDate = repaymentDate; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getLenderName() { return lenderName; }
    public void setLenderName(String lenderName) { this.lenderName = lenderName; }

    public String getLenderEmail() { return lenderEmail; }
    public void setLenderEmail(String lenderEmail) { this.lenderEmail = lenderEmail; }

    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }
}
