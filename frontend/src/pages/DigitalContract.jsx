import React, { useState, useMemo } from "react";

const DigitalContract = ({
  lender,
  borrower,
  loanDetails,
  onAccept,
  onClose,
}) => {
  const [accepted, setAccepted] = useState(false);
  const safetyPoolPercentage = 1; 
  const safetyPoolAmount = (loanDetails.amount * safetyPoolPercentage) / 100;
  const receivableAmount = loanDetails.amount - safetyPoolAmount;
  const repaymentAmount =
    loanDetails.amount + (loanDetails.amount * loanDetails.interestRate) / 100;

  
  const contractId = useMemo(
    () => `CNTR-${Math.floor(Math.random() * 1000000)}`,
    []
  );

  
  const isMobile = window.innerWidth < 768;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "12px",
          padding: "30px",
          width: "90%",
          maxWidth: "800px",
          maxHeight: "90vh",
          overflowY: "auto",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
        }}
      >
        <h2 style={{ marginBottom: "20px" }}>Digital Loan Contract</h2>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "20px",
            paddingBottom: "10px",
            borderBottom: "1px solid #eee",
          }}
        >
          <p>
            <strong>Contract Date:</strong> {new Date().toLocaleDateString()}
          </p>
          <p>
            <strong>Contract ID:</strong> {contractId}
          </p>
        </div>

        <div
          style={{
            display: "flex",
            gap: "20px",
            marginBottom: "25px",
            flexDirection: isMobile ? "column" : "row",
          }}
        >
          <div
            style={{
              flex: 1,
              padding: "15px",
              borderRadius: "8px",
              backgroundColor: "#f8f9fa",
              border: "1px solid #e0e0e0",
            }}
          >
            <h3>Lender</h3>
            <p>
              <strong>Name:</strong> {lender?.name}
            </p>
            <p>
              <strong>Trust Score:</strong> {lender?.trustScore}/10
            </p>
            <p>
              <strong>Email:</strong> {lender?.email}
            </p>
          </div>

          <div
            style={{
              flex: 1,
              padding: "15px",
              borderRadius: "8px",
              backgroundColor: "#f8f9fa",
              border: "1px solid #e0e0e0",
            }}
          >
            <h3>Borrower</h3>
            <p>
              <strong>Name:</strong> {borrower?.name}
            </p>
            <p>
              <strong>Trust Score:</strong> {borrower?.trustScore}/10
            </p>
          </div>
        </div>

        <div style={{ marginBottom: "25px" }}>
          <h3>Loan Terms</h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
              gap: "15px",
              margin: "15px 0",
            }}
          >
            <div>
              <p>
                <strong>Loan Amount:</strong> ₹
                {loanDetails.amount.toLocaleString()}
              </p>
              <p>
                <strong>Interest Rate:</strong> {loanDetails.interestRate}%
              </p>
            </div>
            <div>
              <p>
                <strong>Posted Date:</strong> {loanDetails.postedDate}
              </p>
              <p>
                <strong>Repayment Date:</strong> {loanDetails.repaymentDate}
              </p>
            </div>
          </div>

          <div
            style={{
              backgroundColor: "#f0f7ff",
              padding: "15px",
              borderRadius: "8px",
              marginTop: "15px",
            }}
          >
            <h4>Financial Breakdown</h4>
            <p>
              <strong>Safety Pool (1%):</strong> ₹
              {safetyPoolAmount.toLocaleString()} (non-refundable)
            </p>
            <p>
              <strong>Amount Receivable:</strong> ₹
              {receivableAmount.toLocaleString()}
            </p>
            <p>
              <strong>Total Repayment Amount:</strong> ₹
              {repaymentAmount.toLocaleString()}
            </p>
          </div>
        </div>

        <div
          style={{
            backgroundColor: "#fff8f8",
            padding: "15px",
            borderRadius: "8px",
            borderLeft: "4px solid #ff6b6b",
            margin: "20px 0",
          }}
        >
          <h3>⚠ Important Notice</h3>
          <p>
            By accepting this contract, the borrower agrees to repay the full
            amount by the due date. Failure to repay will result in:
          </p>
          <ul>
            <li>Ineligibility for future loans</li>
            <li>Legal action may be taken</li>
          </ul>
        </div>

        <div
          style={{
            margin: "25px 0",
            padding: "15px",
            backgroundColor: "#f8f9fa",
            borderRadius: "8px",
          }}
        >
          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              cursor: "pointer",
            }}
          >
            <input
              type="checkbox"
              checked={accepted}
              onChange={() => setAccepted(!accepted)}
              style={{
                width: "18px",
                height: "18px",
                cursor: "pointer",
              }}
            />
            I have read and accept all terms and conditions of this contract
          </label>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "15px",
            marginTop: "20px",
          }}
        >
          <button
            style={{
              padding: "10px 20px",
              backgroundColor: "#f1f3f5",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
            }}
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            style={{
              padding: "10px 20px",
              backgroundColor: accepted ? "#4CAF50" : "#cccccc",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: accepted ? "pointer" : "not-allowed",
            }}
            onClick={onAccept}
            disabled={!accepted}
          >
            Accept Contract
          </button>
        </div>
      </div>
    </div>
  );
};

export default DigitalContract;