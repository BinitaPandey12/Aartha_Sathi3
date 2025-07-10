import React, { useState, useEffect } from "react";
import logo from "../assets/logo.png";
import "./BorrowerDashboard.css";
import { useNavigate } from "react-router-dom";
import DigitalContract from "./DigitalContract";

export default function BorrowerDashboard() {
  const navigate = useNavigate();
  // Replace initialLenderOffers with empty array
  const [lenderOffers, setLenderOffers] = useState([]);
  const [pendingLoans, setPendingLoans] = useState([]);
  const [activeLoans, setActiveLoans] = useState([]);
  const [showOffer, setShowOffer] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [popup, setPopup] = useState({ show: false, message: "" });
  const [postedLoans, setPostedLoans] = useState([]);
  // Add loading state
  const [isLoadingOffers, setIsLoadingOffers] = useState(false);
  const [newLoanForm, setNewLoanForm] = useState({
    amount: "",
    maxInterestRate: "",
    repaymentDate: "",
    description: "",
  });
  // Add digital contract state variables
  const [showContract, setShowContract] = useState(false);
  const [contractOffer, setContractOffer] = useState(null);
  const [acceptedContracts, setAcceptedContracts] = useState({});
  // Simulate red flag state (for demo, use localStorage or a prop)
  // Remove redFlag state, useEffect, and all red flag/clear red flag button logic

  // Fetch available loan offers from API
  useEffect(() => {
    const fetchLoanOffers = async () => {
      setIsLoadingOffers(true);
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          "http://localhost:8080/api/loan-offers/available-summary",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch offers");

        const offers = await response.json();
        setLenderOffers(offers);
      } catch (error) {
        setPopup({ show: true, message: error.message });
      } finally {
        setIsLoadingOffers(false);
      }
    };

    fetchLoanOffers();
  }, []);

  // Add this useEffect near your other useEffect hooks
  useEffect(() => {
    const fetchPendingPaymentLoans = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          "http://localhost:8080/api/loan-offers/awaiting-payment/borrower",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok)
          throw new Error("Failed to fetch pending payment loans");

        const pendingLoansData = await response.json();
        setPendingLoans(
          pendingLoansData.map((loan) => ({
            id: loan.id,
            lender: loan.lenderName || "Anonymous Lender",
            amount: loan.amount,
            interest: loan.interestRate,
            repayment: loan.repaymentDate,
            description: loan.description,
            status: "Waiting for Lender Payment",
            acceptedDate: new Date(loan.createdAt).toLocaleDateString("en-GB"),
            location: loan.lenderLocation || "Location not specified",
          }))
        );
      } catch (error) {
        setPopup({ show: true, message: error.message });
      }
    };

    fetchPendingPaymentLoans();
  }, []);

  // Fetch active loans for borrower on mount
  useEffect(() => {
    const fetchActiveLoans = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          "http://localhost:8080/api/loan-offers/active-loans/borrower",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) throw new Error("Failed to fetch active loans");
        const loans = await response.json();
        setActiveLoans(loans);
      } catch (error) {
        setPopup({ show: true, message: error.message });
      }
    };
    fetchActiveLoans();
  }, []);

  // Fetch detailed offer when clicked
  const fetchOfferDetails = async (offerId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:8080/api/loan-offers/${offerId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch offer details");

      const offerDetails = await response.json();
      setSelectedOffer({
        ...offerDetails,
        lender: offerDetails.lenderName,
        interest: offerDetails.interestRate,
        repayment: offerDetails.repaymentDate,
        trustScore: offerDetails.trustScore || 5,
      });
      setShowOffer(true);
    } catch (error) {
      setPopup({ show: true, message: error.message });
    }
  };

  const userData = JSON.parse(localStorage.getItem("user"));
  const userName = userData?.name || "User";

  const handleLogout = () => {
    // Clear user data from localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // Redirect to landing page
    navigate("/");
  };
  const createLoanRequest = async () => {
    try {
      // Validation
      if (
        !newLoanForm.amount ||
        !newLoanForm.maxInterestRate ||
        !newLoanForm.repaymentDate
      ) {
        setPopup({ show: true, message: "Please fill all required fields" });
        return;
      }

      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Please login again - session expired");
      }

      const loanRequestData = {
        amount: parseFloat(newLoanForm.amount),
        maxInterestRate: parseFloat(newLoanForm.maxInterestRate),
        repaymentDate: newLoanForm.repaymentDate,
        description: newLoanForm.description,
      };

      const response = await fetch("http://localhost:8080/api/loan-requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(loanRequestData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create loan request");
      }

      const result = await response.json();
      setPostedLoans([
        ...postedLoans,
        {
          id: result.id,
          amount: newLoanForm.amount,
          maxInterestRate: newLoanForm.maxInterestRate,
          repaymentDate: newLoanForm.repaymentDate,
          description: newLoanForm.description,
          status: "Waiting for Lender",
          postedDate: new Date().toLocaleDateString("en-GB"),
        },
      ]);

      // Clear form
      setNewLoanForm({
        amount: "",
        maxInterestRate: "",
        repaymentDate: "",
        description: "",
      });
    } catch (error) {
      console.error("Error creating loan request:", error);
      setPopup({
        show: true,
        message: error.message.includes("session expired")
          ? "Session expired. Please login again."
          : error.message || "Failed to create loan request",
      });
    }

    setTimeout(() => setPopup({ show: false, message: "" }), 3000);
  };

  // View Offer Modal logic

  const closeOffer = () => {
    setShowOffer(false);
    setSelectedOffer(null);
  };
  // Accept Offer logic
  const acceptOffer = async () => {
    // Check if digital contract has been accepted
    if (!acceptedContracts[selectedOffer.id]) {
      setPopup({
        show: true,
        message:
          "✗ Please view and accept the digital contract before accepting the offer.",
      });
      setTimeout(() => setPopup({ show: false }), 3000);
      return;
    }

    try {
      const token = localStorage.getItem("token");

      // Show processing popup
      setPopup({
        show: true,
        message: "Accepting the loan offer...",
      });

      const response = await fetch(
        `http://localhost:8080/api/loan-offers/${selectedOffer.id}/accept`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) throw new Error("Offer acceptance failed!");

      // Update all states
      setPostedLoans(
        postedLoans.filter(
          (loan) => loan.id !== selectedOffer.loanRequestId // Remove from posted loans
        )
      );

      setLenderOffers(
        lenderOffers.filter((offer) => offer.id !== selectedOffer.id)
      );

      setPendingLoans([
        ...pendingLoans,
        {
          ...selectedOffer,
          status: "Waiting for Lender Payment",
          acceptedDate: new Date().toLocaleDateString("en-GB"),
        },
      ]);

      setShowOffer(false);
      setPopup({
        show: true,
        message: "✓ Offer accepted! Waiting for lender's payment.",
      });
    } catch (err) {
      setPopup({
        show: true,
        message: "✗ " + (err.message || "Failed to accept offer"),
      });
    } finally {
      setTimeout(() => setPopup({ show: false }), 3000);
    }
  };
  // Simulate lender payment for demo

  // Update your form input to use maxInterestRate
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewLoanForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <>
      {/* Navbar */}
      <nav className="borrower-navbar">
        <div className="navbar-title">Borrower Dashboard</div>
        <button className="navbar-logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </nav>
      <div className="borrower-dashboard-root">
        {/* Header */}
        <div className="dashboard-header-card">
          <div className="header-left">
            <img src={logo} alt="AarthaSathi Logo" className="borrower-logo" />
            <div>
              <div className="borrower-title">
                Welcome back, <span className="username">{userName}</span>
              </div>
              <div className="borrower-desc">
                Here's your borrowing dashboard where you can request loans and
                manage your active loans.
              </div>
            </div>
          </div>
          <div className="header-right">
            <div className="score-card trust-card">
              <div className="score-label">Your Trust Score</div>
              <div className="score-value">5/10</div>
              <div className="score-desc">Trusted Borrower</div>
            </div>
          </div>
        </div>

        {/* Loan Offers from Lenders */}
        <section className="borrower-section">
          <div className="section-title">Loan Offers from Lenders</div>
          <div className="section-desc">
            These are loan offers matching your requirements.
          </div>
          <div className="borrower-table-wrapper">
            <table className="borrower-table">
              <thead>
                <tr>
                  <th>Lender</th>
                  <th>Amount</th>
                  <th>Interest</th>
                  <th>Repayment</th>
                  <th>Trust Score</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {isLoadingOffers ? (
                  <tr>
                    <td
                      colSpan={6}
                      style={{
                        height: "100px",
                        textAlign: "center",
                        verticalAlign: "middle",
                        fontStyle: "italic",
                        color: "#666",
                      }}
                    >
                      Loading loan offers...
                    </td>
                  </tr>
                ) : lenderOffers.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      style={{
                        height: "100px",
                        textAlign: "center",
                        verticalAlign: "middle",
                        fontStyle: "italic",
                        color: "#666",
                      }}
                    >
                      No loan offers available at the moment
                    </td>
                  </tr>
                ) : (
                  lenderOffers.map((offer) => (
                    <tr key={offer.id}>
                      <td>
                        <div className="lender-info">
                          <img
                            src={
                              offer.lenderAvatar ||
                              `https://ui-avatars.com/api/?name=${
                                offer.lenderName?.charAt(0) || "L"
                              }&background=random`
                            }
                            alt="Lender"
                            style={{
                              width: "28px",
                              height: "28px",
                              borderRadius: "50%",
                              objectFit: "cover",
                            }}
                          />
                          <div>
                            <div style={{ fontWeight: 600 }}>
                              {offer.lenderName || "Anonymous Lender"}
                            </div>
                            <div style={{ fontSize: "0.9rem", color: "#555" }}>
                              {offer.lenderLocation || "Location not specified"}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>₹{offer.amount.toLocaleString()}</td>
                      <td>{offer.interestRate}%</td>
                      <td>
                        {new Date(offer.repaymentDate).toLocaleDateString()}
                      </td>
                      <td>{offer.trustScore || 5}/10</td>
                      <td>
                        <button
                          className="view-offer-btn"
                          onClick={() => fetchOfferDetails(offer.id)}
                        >
                          View Offer
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Posted Loan Requests */}
        <section className="borrower-section posted-section">
          <div className="section-title">Posted Loan Requests</div>
          <div className="section-desc">
            Loans you've requested, waiting for lender acceptance.
          </div>
          <div className="posted-loans-grid">
            {postedLoans.length === 0 ? (
              <div className="posted-empty">No posted loan requests</div>
            ) : (
              postedLoans.map((loan) => (
                <div className="posted-loan-card" key={loan.id}>
                  <div className="loan-header">
                    <div className="loan-amount">₹{loan.amount}</div>
                    <span className="loan-status posted">Posted</span>
                  </div>
                  <div className="loan-details">
                    <div>
                      Max Interest: <b>{loan.maxInterestRate}%</b>
                    </div>
                    <div>
                      Repayment: <b>{loan.repaymentDate}</b>
                    </div>
                    {loan.description && (
                      <div className="loan-desc">{loan.description}</div>
                    )}
                  </div>
                  <div className="loan-info">
                    <div>Posted: {loan.postedDate}</div>
                    <div>Status: {loan.status}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Pending Loans */}
        {/* Pending Loans */}
        <section className="borrower-section pending-section smart-pending-section">
          <div className="section-title">Awaiting Payment</div>
          <div className="section-desc">
            Loans you've accepted, waiting for lender payment.
          </div>
          <div className="pending-loans-grid smart-pending-grid">
            {pendingLoans.length === 0 ? (
              <div className="pending-empty">
                No pending loans at the moment.
              </div>
            ) : (
              pendingLoans.map((loan) => (
                <div
                  className="pending-loan-card smart-pending-card"
                  key={loan.id}
                >
                  <div className="loan-header">
                    <div className="loan-lender">{loan.lender}</div>
                    <div className="loan-location">{loan.location}</div>
                    <span className="loan-status pending">Pending</span>
                  </div>
                  <div className="loan-details">
                    <div>
                      Amount <b>₹{loan.amount.toLocaleString()}</b>
                    </div>
                    <div>
                      Interest <b>{loan.interest}%</b>
                    </div>
                    <div>
                      Repays{" "}
                      <b>{new Date(loan.repayment).toLocaleDateString()}</b>
                    </div>
                  </div>
                  <div className="loan-info">
                    <div>Accepted: {loan.acceptedDate}</div>
                    <div>Status: {loan.status}</div>
                  </div>
                  {loan.description && (
                    <div className="loan-desc">{loan.description}</div>
                  )}
                  <button
                    className="make-offer-btn"
                    onClick={() => {
                      setPendingLoans(
                        pendingLoans.filter((l) => l.id !== loan.id)
                      );
                      setActiveLoans([
                        ...activeLoans,
                        {
                          ...loan,
                          status: "Active",
                          createdAt: new Date().toLocaleDateString("en-GB"),
                          interestRate: loan.interest || loan.interestRate,
                          repaymentDate: loan.repayment || loan.repaymentDate,
                          lenderName: loan.lender,
                          lenderEmail: loan.location,
                        },
                      ]);
                    }}
                    style={{ marginTop: 12 }}
                  >
                    Simulate Payment
                  </button>
                </div>
              ))
            )}
          </div>
        </section>
        {/* My Active Loans - Left Side */}
        <section className="borrower-section active-loans-section smart-active-section">
          <div className="section-title">
            <span className="active-dot"></span>My Active Loans
          </div>
          <div
            style={{
              color: "#b45309",
              background: "#fffbe6",
              borderRadius: 8,
              padding: "8px 16px",
              marginBottom: 16,
              fontWeight: 500,
              fontSize: "1rem",
            }}
          >
            Note: It may take some time for releasing the amount held in the
            escrow system.
          </div>
          <div className="active-loans-grid smart-active-grid">
            {activeLoans.length === 0 ? (
              <div className="pending-empty">
                No active loans at the moment.
              </div>
            ) : (
              activeLoans.map((loan, idx) => (
                <div
                  className="active-loan-card smart-active-card"
                  key={loan.offerId || idx}
                >
                  <div className="loan-header">
                    <div>
                      <b>Lender Name:</b> {loan.lenderName}
                    </div>
                    <div
                      style={{
                        color: "#888",
                        fontSize: "0.97rem",
                        marginTop: 2,
                      }}
                    >
                      <b>Lender Email:</b> {loan.lenderEmail}
                    </div>
                    <span className="loan-status active">Active</span>
                  </div>
                  <div className="loan-details">
                    <div>
                      Amount{" "}
                      <b>₨{loan.amount?.toLocaleString?.() || loan.amount}</b>
                    </div>
                    <div>
                      Interest <b>{loan.interestRate}%</b>
                    </div>
                    <div>
                      Repays <b>{loan.repaymentDate}</b>
                    </div>
                    {loan.description && (
                      <div>
                        Description: <b>{loan.description}</b>
                      </div>
                    )}
                    <div style={{ marginTop: 8 }}>
                      <span
                        style={{
                          background: "#e0fbe0",
                          borderRadius: "6px",
                          padding: "4px 12px",
                          fontWeight: 600,
                          fontSize: "0.98rem",
                          color: "#22c55e",
                          display: "inline-flex",
                          alignItems: "center",
                        }}
                      >
                        Trust Score:{" "}
                        <select
                          style={{
                            marginLeft: 6,
                            fontWeight: 700,
                            color: "#22c55e",
                            border: "none",
                            background: "transparent",
                            outline: "none",
                          }}
                          defaultValue={5}
                        >
                          {[...Array(10)].map((_, i) => (
                            <option key={i + 1} value={i + 1}>
                              {i + 1}
                            </option>
                          ))}
                        </select>
                        /10
                      </span>
                    </div>
                  </div>
                  <div className="loan-info">
                    <div>Created: {loan.createdAt}</div>
                  </div>
                  <button
                    className="make-offer-btn"
                    style={{ marginTop: 8, background: "#22c55e" }}
                    onClick={() => {
                      setActiveLoans(activeLoans.filter((_, i) => i !== idx));
                    }}
                  >
                    Pay Back
                  </button>
                </div>
              ))
            )}
          </div>
        </section>
        {/* Create New Loan Offer - Right Side */}
        <section className="borrower-section create-loan-section smart-offer-section">
          <div className="section-title">Create New Loan Request</div>
          <div className="create-loan-form">
            <input
              type="number"
              name="amount"
              placeholder="Loan Amount (₹)"
              value={newLoanForm.amount}
              onChange={handleInputChange}
            />
            <input
              type="number"
              name="maxInterestRate"
              placeholder="Max Interest Rate (%)"
              value={newLoanForm.maxInterestRate}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="repaymentDate"
              placeholder="Repayment Date (YYYY-MM-DD)"
              value={newLoanForm.repaymentDate}
              onChange={handleInputChange}
            />
            <textarea
              name="description"
              placeholder="Brief Description"
              value={newLoanForm.description}
              onChange={handleInputChange}
            />
            <button
              className="post-loan-btn"
              onClick={createLoanRequest}
              disabled={
                !newLoanForm.amount ||
                !newLoanForm.maxInterestRate ||
                !newLoanForm.repaymentDate
              }
            >
              Post Loan Request
            </button>
          </div>
        </section>

        {/* Offer Modal */}
        {showOffer && selectedOffer && (
          <div className="modal-overlay">
            <div className="modal-card">
              <div className="modal-title">Loan Offer Details</div>
              <div className="modal-content">
                <div>
                  <b>Lender:</b>{" "}
                  {selectedOffer.lenderName || selectedOffer.lender}
                </div>
                {selectedOffer.lenderEmail && (
                  <div>
                    <b>Email:</b> {selectedOffer.lenderEmail}
                  </div>
                )}
                <div>
                  <b>Amount:</b> ₹{selectedOffer.amount.toLocaleString()}
                </div>
                <div>
                  <b>Interest:</b>{" "}
                  {selectedOffer.interestRate || selectedOffer.interest}%
                </div>
                <div>
                  <b>Repayment:</b>{" "}
                  {new Date(
                    selectedOffer.repaymentDate || selectedOffer.repayment
                  ).toLocaleDateString()}
                </div>
                {selectedOffer.description && (
                  <div>
                    <b>Description:</b> {selectedOffer.description}
                  </div>
                )}
                <div>
                  <b>Status:</b> {selectedOffer.status || "AVAILABLE"}
                </div>
                {selectedOffer.createdAt && (
                  <div>
                    <b>Created:</b>{" "}
                    {new Date(selectedOffer.createdAt).toLocaleString()}
                  </div>
                )}
              </div>
              <div className="modal-actions">
                <button
                  className="view-contract-btn"
                  onClick={() => {
                    setShowContract(true);
                    setContractOffer(selectedOffer);
                  }}
                >
                  View Digital Contract
                </button>
                <button className="make-offer-btn" onClick={acceptOffer}>
                  Accept Offer
                </button>
                <button className="view-contract-btn" onClick={closeOffer}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
        {/* Popup */}
        {popup.show && (
          <div className="popup-overlay">
            <div className="popup-card">{popup.message}</div>
          </div>
        )}

        {/* Digital Contract Modal */}
        {showContract && contractOffer && (
          <DigitalContract
            lender={{
              name:
                contractOffer.lenderName || contractOffer.lender || "Lender",
              trustScore: 8.7,
              email: contractOffer.lenderEmail || "lender@example.com",
            }}
            borrower={{
              name: userName,
              trustScore: 5,
            }}
            loanDetails={{
              amount: contractOffer.amount,
              interestRate:
                contractOffer.interestRate || contractOffer.interest,
              postedDate: contractOffer.createdAt
                ? new Date(contractOffer.createdAt).toLocaleDateString()
                : new Date().toLocaleDateString(),
              repaymentDate:
                contractOffer.repaymentDate || contractOffer.repayment,
              description: contractOffer.description,
            }}
            onAccept={() => {
              setShowContract(false);
              setAcceptedContracts((prev) => ({
                ...prev,
                [contractOffer.id]: true,
              }));
            }}
            onClose={() => setShowContract(false)}
          />
        )}
      </div>
    </>
  );
}
