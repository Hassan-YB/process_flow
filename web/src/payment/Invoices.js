import React, { useState, useEffect } from "react";
import axios from "axios";
import { showSuccessToast, showErrorToast } from "../utils/toastUtils";

const BASE_URL = process.env.REACT_APP_BASE_URL;
const API_URL = `${BASE_URL}/api/v1/payment`;

const InvoicesList = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };
        const { data } = await axios.get(`${API_URL}/invoices/`, config);
        setInvoices(data);
      } catch (error) {
        console.error("Error fetching invoices:", error.response?.data || error.message);
        showErrorToast("Failed to load invoices.");
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, []);

  if (loading) {
    return <div>Loading invoices...</div>;
  }

  return (
    <div className="container mt-5" style={{ height: "100vh" }}>
      <h2 className="text-center mb-4">Invoices</h2>
      <div className="row justify-content-center mt-4">
        {invoices.map((invoice) => (
          <div className="col-md-4 mb-4" key={invoice.id}>
            <div
              className="card p-3"
              style={{
                borderRadius: "15px",
                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                background: "linear-gradient(135deg, #a445b2, #fa4299)",
                color: "white",
              }}
            >
              <div className="d-flex justify-content-between align-items-center mb-3">
              <span style={{ fontWeight: "bold" }}>
                Invoice #{invoice.id}
              </span>
              <span
                  style={{
                    background: invoice.is_paid ? "#4caf50" : "#f44336",
                    color: "white",
                    borderRadius: "10px",
                    padding: "5px 10px",
                    fontSize: "12px",
                    fontWeight: "bold",
                  }}
                >
                  {invoice.is_paid ? "PAID" : "UNPAID"}
                </span>
              </div>
              <p>
                <strong>Amount Due:</strong> {invoice.amount_due / 100}{" "}
                {invoice.currency.toUpperCase()}{" "}
                {invoice.amount_due > 0
                  ? `(${(invoice.amount_due / 100).toFixed(2)} USD)`
                  : ""}
              </p>
              <p>
                <strong>Amount Paid:</strong> {invoice.amount_paid / 100}{" "}
                {invoice.currency.toUpperCase()}
              </p>
              <p>
                <strong>Start Date:</strong>{" "}
                {new Date(invoice.period_start).toLocaleDateString()}
              </p>
              <p>
                <strong>End Date:</strong>{" "}
                {new Date(invoice.period_end).toLocaleDateString()}
              </p>
              <p>
                <strong>Next Payment:</strong>{" "}
                {invoice.next_payment_attempt
                  ? new Date(invoice.next_payment_attempt).toLocaleDateString()
                  : "N/A"}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};


export default InvoicesList;
