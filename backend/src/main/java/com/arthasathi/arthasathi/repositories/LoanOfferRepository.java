package com.arthasathi.arthasathi.repositories;

import com.arthasathi.arthasathi.entities.LoanOffer;
import com.arthasathi.arthasathi.entities.LoanOfferStatus;
import com.arthasathi.arthasathi.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface LoanOfferRepository extends JpaRepository<LoanOffer, Long> {

    // Find all loan offers by lender
    List<LoanOffer> findByLenderOrderByCreatedAtDesc(User lender);

    // Find all available loan offers (for borrowers dashboard)
    List<LoanOffer> findByStatusOrderByCreatedAtDesc(LoanOfferStatus status);

    // Find loan offers by status and lender
    List<LoanOffer> findByStatusAndLenderOrderByCreatedAtDesc(LoanOfferStatus status, User lender);

    // Find loan offers with amount greater than or equal to specified amount
    @Query("SELECT lo FROM LoanOffer lo WHERE lo.amount >= :minAmount AND lo.status = :status ORDER BY lo.createdAt DESC")
    List<LoanOffer> findByAmountGreaterThanOrEqualToAndStatus(@Param("minAmount") java.math.BigDecimal minAmount, @Param("status") LoanOfferStatus status);

    // Find loan offers with interest rate less than or equal to specified rate
    @Query("SELECT lo FROM LoanOffer lo WHERE lo.interestRate <= :maxInterestRate AND lo.status = :status ORDER BY lo.createdAt DESC")
    List<LoanOffer> findByInterestRateLessThanOrEqualToAndStatus(@Param("maxInterestRate") java.math.BigDecimal maxInterestRate, @Param("status") LoanOfferStatus status);

    // Find loan offers expiring before a certain date
    List<LoanOffer> findByRepaymentDateBeforeAndStatus(LocalDate date, LoanOfferStatus status);

    // Find loan offers by amount range
    @Query("SELECT lo FROM LoanOffer lo WHERE lo.amount BETWEEN :minAmount AND :maxAmount AND lo.status = :status ORDER BY lo.createdAt DESC")
    List<LoanOffer> findByAmountBetweenAndStatus(@Param("minAmount") java.math.BigDecimal minAmount,
                                                 @Param("maxAmount") java.math.BigDecimal maxAmount,
                                                 @Param("status") LoanOfferStatus status);

    // Find loan offers by interest rate range
    @Query("SELECT lo FROM LoanOffer lo WHERE lo.interestRate BETWEEN :minRate AND :maxRate AND lo.status = :status ORDER BY lo.createdAt DESC")
    List<LoanOffer> findByInterestRateBetweenAndStatus(@Param("minRate") java.math.BigDecimal minRate,
                                                       @Param("maxRate") java.math.BigDecimal maxRate,
                                                       @Param("status") LoanOfferStatus status);

    List<LoanOffer> findByLenderAndStatusOrderByCreatedAtDesc(User lender, LoanOfferStatus status);

    List<LoanOffer> findByAcceptedByAndStatusOrderByCreatedAtDesc(User acceptedBy, LoanOfferStatus status);
}