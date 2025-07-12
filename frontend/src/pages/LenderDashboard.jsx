import React, { useState, useEffect } from "react";
import logo from "../assets/logo.png";
import "./LenderDashboard.css";
import { useNavigate } from "react-router-dom";
import DigitalContract from "./DigitalContract";

export default function LenderDashboard() {
  const navigate = useNavigate();
  const [borrowerRequests, setBorrowerRequests] = useState([]);
  const [pendingPayments, setPendingPayments] = useState([]);
  const [activeLoans, setActiveLoans] = useState([]);
  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [editedInterest, setEditedInterest] = useState("");
  const [popup, setPopup] = useState({ show: false, message: "" });
  const [newLoanForm, setNewLoanForm] = useState({
    amount: "",
    minInterest: "",
    repaymentDate: "",
    description: "",
  });
  const [postedLoanOffers, setPostedLoanOffers] = useState([]);
  const userData = JSON.parse(localStorage.getItem("user"));
  const userName = userData?.name || "User";
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/");
  };

  useEffect(() => {
    const fetchBorrowerRequests = async () => {
      try {
        const token = localStorage.getItem("token");
        const userData = JSON.parse(localStorage.getItem("user") || "{}");

        console.log("=== DEBUG INFO ===");
        console.log("Token exists:", !!token);
        console.log("Token length:", token ? token.length : 0);
        console.log(
          "Token starts with:",
          token ? token.substring(0, 20) + "..." : "No token"
        );
        console.log("User data:", userData);
        console.log("User role:", userData.role);
        console.log("User email:", userData.email);
        console.log("==================");

        if (!token) {
          throw new Error("No authentication token found");
        }

        if (userData.role !== "LENDER") {
          console.log("User role is:", userData.role);
          setPopup({
            show: true,
            message: "Please login as a LENDER to access this dashboard.",
          });
          return;
        }

        const response = await fetch(
          "http://localhost:8080/api/loan-requests/pending",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("Response status:", response.status);

        if (!response.ok) {
          const errorText = await response.text();
          console.error("API Error Status:", response.status);
          console.error("API Error Text:", errorText);
          console.error(
            "Response Headers:",
            Object.fromEntries(response.headers.entries())
          );
          throw new Error(
            `Failed to fetch borrower requests:${response.status} - ${errorText}`
          );
        }

        const requests = await response.json();
        console.log("Borrower requests received:", requests);
        setBorrowerRequests(requests);

        try {
          const testResponse = await fetch(
            "http://localhost:8080/api/loan-requests/loan-requests/lender-dashboard",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          console.log("Original endpoint status:", testResponse.status);
          if (testResponse.ok) {
            const testData = await testResponse.json();
            console.log("Original endpoint data:", testData);

            setBorrowerRequests(testData);
          } else {
            const errorText = await testResponse.text();
            console.log("Original endpoint error:", errorText);
          }
        } catch (testError) {
          console.log("Original endpoint error:", testError);
        }
      } catch (error) {
        console.error("Fetch error:", error);
        setPopup({ show: true, message: error.message });
      }
    };

    fetchBorrowerRequests();
  }, []);

  useEffect(() => {
    const fetchPostedLoanOffers = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          "http://localhost:8080/api/loan-offers/pending",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) throw new Error("Failed to fetch posted loan offers");
        const offers = await response.json();
        setPostedLoanOffers(offers);
      } catch (error) {
        setPopup({ show: true, message: error.message });
      }
    };
    fetchPostedLoanOffers();
  }, []);

  useEffect(() => {
    const fetchPendingPayments = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          "http://localhost:8080/api/loan-offers/awaiting-payment",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) throw new Error("Failed to fetch pending payments");
        const payments = await response.json();
        setPendingPayments(payments);
      } catch (error) {
        setPopup({ show: true, message: error.message });
      }
    };
    fetchPendingPayments();
  }, []);

  useEffect(() => {
    const fetchActiveLoans = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          "http://localhost:8080/api/loan-offers/active-loans/lender",
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

  const handlePostLoanOffer = async () => {
    try {
      if (
        !newLoanForm.amount ||
        !newLoanForm.minInterest ||
        !newLoanForm.repaymentDate
      ) {
        setPopup({ show: true, message: "Please fill all required fields" });
        return;
      }

      if (!/^\d{4}-\d{2}-\d{2}$/.test(newLoanForm.repaymentDate)) {
        setPopup({ show: true, message: "Use YYYY-MM-DD date format" });
        return;
      }

      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Please login again - session expired");
      }

      const loanOfferData = {
        amount: parseFloat(newLoanForm.amount),
        interestRate: parseFloat(newLoanForm.minInterest),
        repaymentDate: newLoanForm.repaymentDate,
        description: newLoanForm.description,
      };

      console.log("Sending:", loanOfferData);

      const response = await fetch("http://localhost:8080/api/loan-offers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(loanOfferData),
      });

      if (response.status === 403) {
        throw new Error("Please login again - session expired");
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create offer");
      }

      const result = await response.json();
      setPopup({
        show: true,
        message: ` Offer created! ID: ${result.id} | Status: ${result.status}`,
      });

      setPostedLoanOffers((prev) => [
        ...prev,
        {
          id: result.id,
          amount: loanOfferData.amount,
          interestRate: loanOfferData.interestRate,
          repaymentDate: loanOfferData.repaymentDate,
          description: loanOfferData.description,
          status: result.status || "Posted",
          postedDate: new Date().toLocaleDateString("en-GB"),
        },
      ]);

      setNewLoanForm({
        amount: "",
        minInterest: "",
        repaymentDate: "",
        description: "",
      });
    } catch (error) {
      console.error("Error:", error);
      setPopup({
        show: true,
        message: error.message.includes("403")
          ? "Session expired. Please login again."
          : error.message || "Failed to create loan offer",
      });
    }

    setTimeout(() => setPopup({ show: false, message: "" }), 3000);
  };

  const handleAcceptOffer = async (offer) => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:8080/api/loan-requests/lender-dashboard/${offer.id}",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Failed to fetch loan request details:", errorText);
        throw new Error("Failed to fetch loan request details");
      }

      const detailedOffer = await response.json();
      console.log("Detailed loan request:", detailedOffer);

      setSelectedOffer({
        ...offer,
        borrowerName: detailedOffer.borrowerName,
        borrowerEmail: detailedOffer.borrowerEmail,
        amount: detailedOffer.amount,
        maxInterest: detailedOffer.maxInterest,
        repaymentDate: detailedOffer.repaymentDate,
        description: detailedOffer.description,
        status: detailedOffer.status,
        createdAt: detailedOffer.createdAt,
      });
      setEditedInterest(detailedOffer.maxInterest);
      setShowAcceptModal(true);
    } catch (error) {
      console.error("Error fetching loan request details:", error);
      setPopup({ show: true, message: error.message });
    }
  };
  const handleConfirmAccept = async () => {
    try {
      const token = localStorage.getItem("token");

      console.log("=== ACCEPT DEBUG ===");
      console.log("Selected offer ID:", selectedOffer.id);
      console.log("Selected offer full object:", selectedOffer);
      console.log("Edited interest rate:", editedInterest);
      console.log("Token exists:", !!token);
      console.log("===================");

      const requestId =
        selectedOffer.id ||
        selectedOffer.requestId ||
        selectedOffer.loanId ||
        selectedOffer.loanRequestId;
      if (!requestId) {
        console.error(
          "Available fields in selectedOffer:",
          Object.keys(selectedOffer)
        );
        throw new Error("No valid loan request ID found");
      }

      console.log("Using request ID:", requestId);

      const response = await fetch(
        "http://localhost:8080/api/loan-requests/lender-dashboard/${requestId}/accept",
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Accept response status:", response.status);
      console.log(
        "Accept response headers:",
        Object.fromEntries(response.headers.entries())
      );

      if (!response.ok) {
        throw new Error("Loan request acceptance failed!");
      }

      setBorrowerRequests(
        borrowerRequests.filter((req) => req.id !== requestId)
      );

      setPendingPayments([
        ...pendingPayments,
        {
          ...selectedOffer,
          interest: Number(editedInterest),
          status: "Pending",
        },
      ]);

      setShowAcceptModal(false);
      setSelectedOffer(null);

      setPopup({
        show: true,
        message: "✓ Loan request accepted! Please make payment to proceed.",
      });
    } catch (error) {
      console.error("Error accepting loan request:", error);
      setPopup({
        show: true,
        message: "✗ " + (error.message || "Failed to accept loan request"),
      });
    } finally {
      setTimeout(() => setPopup({ show: false, message: "" }), 3000);
    }
  };

  const handleProceedPayment = async (loanId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Please login again - session expired");
      }

      const response = await fetch(
        " http://localhost:8080/api/loan-offers/${loanId}/mark-paid",
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to process payment");
      }

      setPopup({
        show: true,
        message:
          "₹10 is deducted as transfer fee. Payment is now currently held in escrow",
      });

      setTimeout(() => {
        setPendingPayments(
          pendingPayments.filter((loan) => loan.id !== loanId)
        );
        setPopup({ show: false, message: "" });
      }, 3000);
    } catch (error) {
      console.error("Payment error:", error);
      setPopup({
        show: true,
        message: error.message || "Error processing payment",
      });
      setTimeout(() => setPopup({ show: false, message: "" }), 3000);
    }
  };
  const [showContract, setShowContract] = useState(false);
  const [contractLoan, setContractLoan] = useState(null);
  const [acceptedContracts, setAcceptedContracts] = useState({});
  const [borrowerRedFlag, setBorrowerRedFlag] = useState(false);

  return (
    <>
      <nav className="lender-navbar">
        <div className="navbar-title">Lender Dashboard</div>

        <button className="navbar-logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </nav>
      <div className="lender-dashboard-root" style={{ minHeight: "100vh" }}>
        <div className="dashboard-header-card">
          <div className="header-left">
            <img src={logo} alt="AarthaSathi Logo" className="lender-logo" />
            <div>
              <div className="lender-title">Welcome back, {userName}!</div>
              <div className="lender-desc">
                Here's your lending dashboard where you can find loan requests
                and manage your active loans.
              </div>
            </div>
          </div>
          <div className="header-right">
            <div className="score-card trust-card">
              <div className="score-label">Your Trust Score</div>
              <div className="score-value">8.7/10</div>
              <div className="score-desc">Very Trusted Lender</div>
            </div>
            <div className="score-card safety-card">
              <div className="score-label">Safety Pool</div>
              <div className="score-value">₹25,450</div>
              <div className="score-desc">5% of your loans</div>
            </div>
          </div>
        </div>
        {/* Loan Requests from Borrowers */}
        <div className="dashboard-card">
          <div className="section-title">Loan Requests from Borrowers</div>
          <div className="section-desc">
            These are loan requests matching your preferences.
          </div>
          <div className="lender-table-wrapper">
            <div className="lender-table">
              <table>
                <thead>
                  <tr>
                    <th>Borrower</th>
                    <th>Amount</th>
                    <th>Max Interest</th>
                    <th>Repayment</th>
                    <th>Trust Score</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {borrowerRequests.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        style={{
                          textAlign: "center",
                          padding: "20px",
                          color: "#888",
                        }}
                      >
                        No loan requests from borrowers.
                      </td>
                    </tr>
                  ) : (
                    borrowerRequests.map((req, idx) => (
                      <tr key={idx}>
                        <td>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 8,
                            }}
                          >
                            <svg
                              width="28"
                              height="28"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                              style={{ display: "inline-block" }}
                            >
                              <circle cx="12" cy="12" r="12" fill="#e3eaf6" />
                              <circle cx="12" cy="10" r="4" fill="#b6c4d6" />
                              <ellipse
                                cx="12"
                                cy="18"
                                rx="6"
                                ry="4"
                                fill="#b6c4d6"
                              />
                            </svg>
                            <div>
                              <div style={{ fontWeight: 600, color: "#222" }}>
                                {req.borrowerName}
                              </div>
                              <div
                                style={{ fontSize: "0.95rem", color: "#555" }}
                              >
                                Borrower
                              </div>
                            </div>
                          </div>
                        </td>
                        <td>₹{req.amount?.toLocaleString?.() || req.amount}</td>
                        <td>{req.maxInterestRate}%</td>
                        <td>{req.repaymentDate}</td>
                        <td>{req.trustScore}/10</td>
                        <td>
                          <button
                            className="make-offer-btn"
                            onClick={() => handleAcceptOffer(req)}
                          >
                            Accept Offer
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        {/* Posted Loan Offers */}
        <section className="lender-section posted-section">
          <div className="section-title">Posted Loan Offers</div>
          <div className="section-desc">
            Loan offers you've posted, waiting for borrower acceptance.
          </div>
          <div className="posted-loans-grid">
            {postedLoanOffers.length === 0 ? (
              <div className="posted-empty">No posted loan offers</div>
            ) : (
              postedLoanOffers.map((offer) => (
                <div className="posted-loan-card" key={offer.id}>
                  <div className="loan-header">
                    <div className="loan-amount">₹{offer.amount}</div>
                    <span className="loan-status posted">Posted</span>
                  </div>
                  <div className="loan-details">
                    <div>
                      Interest:{" "}
                      <b>{offer.interestRate || offer.minInterest}%</b>
                    </div>
                    <div>
                      Repayment: <b>{offer.repaymentDate}</b>
                    </div>
                    {offer.description && (
                      <div className="loan-desc">{offer.description}</div>
                    )}
                  </div>
                  <div className="loan-info">
                    <div>
                      Posted:{" "}
                      {offer.postedDate ||
                        (offer.createdAt
                          ? new Date(offer.createdAt).toLocaleDateString(
                              "en-GB"
                            )
                          : "-")}
                    </div>
                    <div>Status: {offer.status || "Posted"}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
        {/* Pending Payments */}
        <div className="dashboard-card">
          <div className="section-title">Pending Payments</div>
          <div className="section-desc">
            Payments you need to make to borrowers.
          </div>
          <div className="pending-loans-grid smart-pending-grid">
            {pendingPayments.length === 0 ? (
              <div className="pending-empty">No pending payments.</div>
            ) : (
              pendingPayments.map((loan, idx) => {
                const contractAccepted =
                  acceptedContracts[loan.createdAt + loan.borrowerEmail + idx];
                return (
                  <div
                    className="pending-loan-card smart-pending-card"
                    key={loan.createdAt + loan.borrowerEmail + idx}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 600, fontSize: "1.1rem" }}>
                          Borrower Name: {loan.borrowerName}
                        </div>
                        <div
                          style={{
                            color: "#666",
                            fontSize: "1rem",
                            marginTop: 2,
                          }}
                        >
                          Borrower Email: {loan.borrowerEmail}
                        </div>
                      </div>
                      <span
                        style={{
                          background: "#ffeaea",
                          color: "#e53935",
                          padding: "6px 18px",
                          borderRadius: 8,
                          fontWeight: 700,
                          fontSize: "1rem",
                        }}
                      >
                        Pending
                      </span>
                    </div>
                    <div style={{ marginTop: 12 }}>
                      <div>
                        Amount{" "}
                        <b>₹{loan.amount?.toLocaleString?.() || loan.amount}</b>
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
                    </div>
                    <div
                      style={{
                        marginTop: 10,
                        color: "#888",
                        fontSize: "0.97rem",
                      }}
                    >
                      Created: {loan.createdAt}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        marginTop: 16,
                        gap: 10,
                      }}
                    >
                      <button
                        style={{
                          padding: "8px 22px",
                          background: contractAccepted ? "#2563eb" : "#bfc9db",
                          color: "#fff",
                          border: "none",
                          borderRadius: 8,
                          fontWeight: 600,
                          fontSize: "1rem",
                          cursor: contractAccepted ? "pointer" : "not-allowed",
                          boxShadow: "0 1px 4px 0 rgba(44, 62, 80, 0.07)",
                        }}
                        onClick={() =>
                          contractAccepted && handleProceedPayment(loan.id)
                        }
                        disabled={!contractAccepted}
                      >
                        Proceed Payment
                      </button>
                      <button
                        style={{
                          padding: "8px 22px",
                          background: "#a78bfa",
                          color: "#fff",
                          border: "none",
                          borderRadius: 8,
                          fontWeight: 600,
                          fontSize: "1rem",
                          cursor: "pointer",
                          boxShadow: "0 1px 4px 0 rgba(44, 62, 80, 0.07)",
                        }}
                        onClick={() => {
                          setShowContract(true);
                          setContractLoan(loan);
                        }}
                      >
                        View Digital Contract
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
        {showContract && contractLoan && (
          <DigitalContract
            lender={{ name: userName, trustScore: 8.7, location: "-" }}
            borrower={{ name: contractLoan.borrowerName || "-", trustScore: 5 }}
            loanDetails={{
              amount: contractLoan.amount,
              interestRate: contractLoan.interestRate,
              postedDate: contractLoan.createdAt,
              repaymentDate: contractLoan.repaymentDate,
              description: contractLoan.description,
            }}
            onAccept={() => {
              setShowContract(false);
              setAcceptedContracts((prev) => ({
                ...prev,
                [contractLoan.createdAt +
                contractLoan.borrowerEmail +
                pendingPayments.findIndex((l) => l === contractLoan)]: true,
              }));
            }}
            onClose={() => setShowContract(false)}
          />
        )}
        {/* Active Loans */}
        <div className="dashboard-card">
          <div className="section-title">My Active Loans</div>
          <div className="section-desc">
            Loans that are currently active or in progress.
          </div>
          {activeLoans.length === 0 ? (
            <div className="pending-empty">No active loans at the moment.</div>
          ) : (
            activeLoans.map((loan, idx) => (
              <div className="active-loan-row" key={loan.offerId || idx}>
                <div className="active-loan-main">
                  <div style={{ fontWeight: 600 }}>{loan.borrowerName}</div>
                  <div style={{ color: "#888", fontSize: "0.97rem" }}>
                    {loan.borrowerEmail}
                  </div>
                  <div style={{ marginTop: 4, fontSize: "0.98rem" }}>
                    Amount{" "}
                    <b>₨{loan.amount?.toLocaleString?.() || loan.amount}</b>{" "}
                    Interest <b>{loan.interestRate}%</b> Repays{" "}
                    <b>{loan.repaymentDate}</b>
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
                      Trust Score:
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
                  <button
                    className="make-offer-btn"
                    style={{ marginTop: 8, background: "#ef4444" }}
                    onClick={() => setBorrowerRedFlag(true)}
                  >
                    Default Payment
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
        {/* Create New Loan Offer */}
        <div className="dashboard-card sidebar-card">
          <div className="section-title">Create New Loan Offer</div>
          <div className="section-desc">
            Create a loan offer that borrowers can accept directly.
          </div>
          <div className="create-loan-form">
            <input
              type="number"
              placeholder="Loan Amount (₹)"
              value={newLoanForm.amount}
              onChange={(e) =>
                setNewLoanForm({ ...newLoanForm, amount: e.target.value })
              }
            />
            <input
              type="number"
              placeholder="Interest Rate (%)"
              value={newLoanForm.minInterest}
              onChange={(e) =>
                setNewLoanForm({ ...newLoanForm, minInterest: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Repayment Date (YYYY-MM-DD)"
              value={newLoanForm.repaymentDate}
              onChange={(e) =>
                setNewLoanForm({
                  ...newLoanForm,
                  repaymentDate: e.target.value,
                })
              }
            />
            <textarea
              placeholder="Description"
              value={newLoanForm.description}
              onChange={(e) =>
                setNewLoanForm({ ...newLoanForm, description: e.target.value })
              }
            />
            <button
              className="post-loan-btn"
              onClick={handlePostLoanOffer}
              disabled={
                !newLoanForm.amount ||
                !newLoanForm.minInterest ||
                !newLoanForm.repaymentDate
              }
            >
              Post Loan Offer
            </button>
          </div>
        </div>

        {showAcceptModal && selectedOffer && (
          <div className="modal-overlay">
            <div className="modal-card">
              <div className="modal-title">Accept Loan Request</div>
              <div className="modal-content">
                <div>
                  <b>Borrower Name:</b> {selectedOffer.borrowerName}
                </div>
                <div>
                  <b>Borrower Email:</b> {selectedOffer.borrowerEmail}
                </div>
                <div>
                  <b>Amount:</b> ₨
                  {selectedOffer.amount?.toLocaleString?.() ||
                    selectedOffer.amount}
                </div>
                <div style={{ margin: "10px 0" }}>
                  <b>Max Interest Rate (%):</b>{" "}
                  <input
                    type="number"
                    value={editedInterest}
                    onChange={(e) => setEditedInterest(e.target.value)}
                    style={{
                      width: 60,
                      marginLeft: 8,
                      borderRadius: 6,
                      border: "1px solid #ccc",
                      padding: "2px 6px",
                    }}
                  />
                </div>
                <div>
                  <b>Repayment Date:</b> {selectedOffer.repaymentDate}
                </div>
                <div>
                  <b>Description:</b>{" "}
                  {selectedOffer.description || "No description"}
                </div>
                <div>
                  <b>Status:</b> {selectedOffer.status}
                </div>
                <div>
                  <b>Created:</b> {selectedOffer.createdAt}
                </div>
              </div>
              <div className="modal-actions">
                <button
                  className="make-offer-btn"
                  onClick={handleConfirmAccept}
                >
                  Confirm Accept
                </button>
                <button
                  className="view-contract-btn"
                  onClick={() => setShowAcceptModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {popup.show && (
          <div className="popup-overlay">
            <div className="popup-card">{popup.message}</div>
          </div>
        )}

        {borrowerRedFlag && (
          <div className="popup-overlay">
            <div
              className="popup-card"
              style={{ color: "#ef4444", fontWeight: 700 }}
            >
              User is now red flagged.
              <button
                className="make-offer-btn"
                style={{ marginTop: 18, background: "#ef4444" }}
                onClick={() => setBorrowerRedFlag(false)}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
