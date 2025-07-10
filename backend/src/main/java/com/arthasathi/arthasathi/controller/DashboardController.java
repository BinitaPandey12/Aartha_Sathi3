package com.arthasathi.arthasathi.controller;

import com.arthasathi.arthasathi.DTO.LoanOfferDTO;
import com.arthasathi.arthasathi.DTO.LoanRequestDTO;
import com.arthasathi.arthasathi.DTO.LoanRequestWithoutStatusDTO;
import com.arthasathi.arthasathi.entities.Role;
import com.arthasathi.arthasathi.entities.User;
import com.arthasathi.arthasathi.repositories.UserRepository;
import com.arthasathi.arthasathi.services.LoanOfferService;
import com.arthasathi.arthasathi.services.LoanRequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "*")
public class DashboardController {

    @Autowired
    private LoanRequestService loanRequestService;

    @Autowired
    private LoanOfferService loanOfferService;

    @Autowired
    private UserRepository userRepository;

    // Get dashboard data based on user role
    @GetMapping
    public ResponseEntity<Map<String, Object>> getDashboardData() {
        String userEmail = getCurrentUserEmail();
        Optional<User> userOpt = userRepository.findByEmail(userEmail);

        if (userOpt.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "User not found"));
        }

        User user = userOpt.get();
        Map<String, Object> dashboardData = new HashMap<>();

        if (user.getRole() == Role.BORROWER) {
            // Borrower dashboard - show available loan offers and their own requests
            List<LoanOfferDTO> availableOffers = loanOfferService.getAllAvailableLoanOffers();
            List<LoanRequestWithoutStatusDTO> myRequests = loanRequestService.getLoanRequestsByBorrower(userEmail);

            dashboardData.put("userRole", "BORROWER");
            dashboardData.put("userName", user.getName());
            dashboardData.put("availableLoanOffers", availableOffers);
            dashboardData.put("myLoanRequests", myRequests);

        } else if (user.getRole() == Role.LENDER) {
            // Lender dashboard - show pending loan requests and their own offers
            List<LoanRequestDTO> pendingRequests = loanRequestService.getAllPendingLoanRequests();
            List<LoanOfferDTO> myOffers = loanOfferService.getLoanOffersByLender(userEmail);

            dashboardData.put("userRole", "LENDER");
            dashboardData.put("userName", user.getName());
            dashboardData.put("pendingLoanRequests", pendingRequests);
            dashboardData.put("myLoanOffers", myOffers);
        }

        return ResponseEntity.ok(dashboardData);
    }

    // Get borrower dashboard data
    @GetMapping("/borrower")
    public ResponseEntity<Map<String, Object>> getBorrowerDashboard() {
        String userEmail = getCurrentUserEmail();
        Optional<User> userOpt = userRepository.findByEmail(userEmail);

        if (userOpt.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "User not found"));
        }

        User user = userOpt.get();
        if (user.getRole() != Role.BORROWER) {
            return ResponseEntity.badRequest().body(Map.of("error", "Access denied. Borrower role required."));
        }

        List<LoanOfferDTO> availableOffers = loanOfferService.getAllAvailableLoanOffers();
        List<LoanRequestWithoutStatusDTO> myRequests = loanRequestService.getLoanRequestsByBorrower(userEmail);

        Map<String, Object> dashboardData = new HashMap<>();
        dashboardData.put("userRole", "BORROWER");
        dashboardData.put("userName", user.getName());
        dashboardData.put("userEmail", user.getEmail());
        dashboardData.put("availableLoanOffers", availableOffers);
        dashboardData.put("myLoanRequests", myRequests);
        dashboardData.put("totalAvailableOffers", availableOffers.size());
        dashboardData.put("totalMyRequests", myRequests.size());

        return ResponseEntity.ok(dashboardData);
    }

    // Get lender dashboard data
    @GetMapping("/lender")
    public ResponseEntity<Map<String, Object>> getLenderDashboard() {
        String userEmail = getCurrentUserEmail();
        Optional<User> userOpt = userRepository.findByEmail(userEmail);

        if (userOpt.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "User not found"));
        }

        User user = userOpt.get();
        if (user.getRole() != Role.LENDER) {
            return ResponseEntity.badRequest().body(Map.of("error", "Access denied. Lender role required."));
        }

        List<LoanRequestDTO> pendingRequests = loanRequestService.getAllPendingLoanRequests();
        List<LoanOfferDTO> myOffers = loanOfferService.getLoanOffersByLender(userEmail);

        Map<String, Object> dashboardData = new HashMap<>();
        dashboardData.put("userRole", "LENDER");
        dashboardData.put("userName", user.getName());
        dashboardData.put("userEmail", user.getEmail());
        dashboardData.put("pendingLoanRequests", pendingRequests);
        dashboardData.put("myLoanOffers", myOffers);
        dashboardData.put("totalPendingRequests", pendingRequests.size());
        dashboardData.put("totalMyOffers", myOffers.size());

        return ResponseEntity.ok(dashboardData);
    }

    // Helper method to get current user email
    private String getCurrentUserEmail() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication.getName();
    }
}