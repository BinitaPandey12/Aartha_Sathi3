package com.arthasathi.arthasathi.repositories;

import com.arthasathi.arthasathi.entities.LoanRequest;
import com.arthasathi.arthasathi.entities.LoanRequestStatus;
import com.arthasathi.arthasathi.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface LoanRequestRepository extends JpaRepository<LoanRequest, Long> {

    // Find all loan requests by borrower
    List<LoanRequest> findByBorrowerOrderByCreatedAtDesc(User borrower);

    // Find all pending loan requests (for lenders dashboard)
    List<LoanRequest> findByStatusOrderByCreatedAtDesc(LoanRequestStatus status);

    // Find loan requests by status and borrower
    List<LoanRequest> findByStatusAndBorrowerOrderByCreatedAtDesc(LoanRequestStatus status, User borrower);

    // Find loan requests with amount less than or equal to specified amount
    @Query("SELECT lr FROM LoanRequest lr WHERE lr.amount <= :maxAmount AND lr.status = :status ORDER BY lr.createdAt DESC")
    List<LoanRequest> findByAmountLessThanOrEqualToAndStatus(@Param("maxAmount") java.math.BigDecimal maxAmount, @Param("status") LoanRequestStatus status);

    // Find loan requests with max interest rate greater than or equal to specified rate
    @Query("SELECT lr FROM LoanRequest lr WHERE lr.maxInterestRate >= :minInterestRate AND lr.status = :status ORDER BY lr.createdAt DESC")
    List<LoanRequest> findByMaxInterestRateGreaterThanOrEqualToAndStatus(@Param("minInterestRate") java.math.BigDecimal minInterestRate, @Param("status") LoanRequestStatus status);

    // Find loan requests expiring before a certain date
    List<LoanRequest> findByRepaymentDateBeforeAndStatus(LocalDate date, LoanRequestStatus status);
    List<LoanRequest> findByBorrowerAndStatusOrderByCreatedAtDesc(User borrower, LoanRequestStatus status);
    // In LoanRequestRepository.java

    List<LoanRequest> findByLenderAndStatusOrderByCreatedAtDesc(User lender, LoanRequestStatus status);


    // Find loan requests by amount range
    @Query("SELECT lr FROM LoanRequest lr WHERE lr.amount BETWEEN :minAmount AND :maxAmount AND lr.status = :status ORDER BY lr.createdAt DESC")
    List<LoanRequest> findByAmountBetweenAndStatus(@Param("minAmount") java.math.BigDecimal minAmount,
                                                   @Param("maxAmount") java.math.BigDecimal maxAmount,
                                                   @Param("status") LoanRequestStatus status);
}