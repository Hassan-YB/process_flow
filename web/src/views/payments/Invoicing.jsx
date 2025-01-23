import React, { useState, useEffect } from "react";
import axios from "axios";
import { showSuccessToast, showErrorToast } from "../../utils/toastUtils";
import Invoice from "../../assets/img/invoice.png";
import MainCard from "../../components/Card/MainCard";
import '../../assets/css/style.css';
import Breadcrumb from "../../components/Breadcrumb/breadcrumb";
import InvoiceCard from '../../components/Widgets/Statistic/InvoiceCard';
import SubCard from '../../components/Widgets/Statistic/SubCard';
import PaymentCard from '../../components/Widgets/Statistic/PaymentCard';
import ConfirmationModal from '../../components/Modal/ConfirmationModal'
import Print from '../../assets/img/print.png'
import "./payments.css"
import { FaSearch } from "react-icons/fa";

// react-bootstrap
import { Row, Col, Card, Table, ListGroup } from 'react-bootstrap';


const BASE_URL = process.env.REACT_APP_BASE_URL;
const API_URL = `${BASE_URL}/api/v1/payment`;

const Invoicing = () => {
  const [subscriptionData, setSubscriptionData] = useState(null);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [status, setStatus] = useState("Cancel");

  useEffect(() => {
    // Fetch the subscription data
    const fetchSubscriptionData = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };
        const response = await fetch(`${API_URL}/subscriptions/active/`, config);
        const data = await response.json();

        if (data.subscription.status === "canceled") {
          setStatus("Canceled");
        } else {
          setStatus("Cancel");
        }
        setSubscriptionData(data);

        // Fetch invoices data
        const invoicesResponse = await fetch(`${API_URL}/invoices/`, config);
        const invoicesData = await invoicesResponse.json();
        setInvoices(invoicesData);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching subscription data:", error);
        setLoading(false);
      }
    };

    fetchSubscriptionData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!subscriptionData || invoices.length === 0) {
    return <div>No subscription currently</div>;
  }

  // Extracting data from the API response
  const { subscription, price, upcoming_invoice } = subscriptionData;
  const nextBillDate = upcoming_invoice?.next_payment_attempt || "N/A";

  const handleStatusClick = () => {
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  const handleConfirm = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const config = {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      };
      await fetch(
        `${API_URL}/subscriptions/${subscriptionData.subscription.id}/`,
        config
      );

      setSubscriptionData((prevData) => ({
        ...prevData,
        subscription: {
          ...prevData.subscription,
          status: "canceled",
        },
      }));

      setStatus("Canceled");
      setShowModal(false);
    } catch (error) {
      console.error("Error canceling subscription:", error);
    }
  };



  return (
    <div className="container">
      <Breadcrumb pageName="Billing" />

      <Row>
        {/* Subscription Card */}
        <Col md={6} xl={4}>
          <SubCard
            params={{
              class: 'bg-c-blue',
              title: "Subscription Plan",
              status: subscription.status,
              planName: subscription.price?.title || "N/A",
              planAmount: `${subscription.price?.amount || "N/A"} ${subscription.price?.currency || ""}`,
              validUntil: subscription.current_period_end.slice(0, 10),
            }}
          />
        </Col>

        {/* Payment Method Card */}
        <Col md={6} xl={4}>
          <PaymentCard
            params={{
              title: "Payment Method",
              cardLastDigits: subscription.payment_method_details?.last_four_digits,
              cardType: subscription.payment_method_details?.card_brand,
              class: 'bg-c-blue',
            }}
          />
        </Col>

        {/* Amount Due Card */}
        <Col md={6} xl={4}>
          <InvoiceCard
            params={{
              class: 'bg-c-blue',
              title: "Amount Due",
              nextBill: `${subscription.price?.amount || "N/A"} ${subscription.price?.currency || ""}`,
              nextBillDate: subscription.upcoming_invoice?.next_payment_attempt.slice(0, 10) || "N/A",
              status: status,
            }}
            onStatusClick={handleStatusClick}
          />
        </Col>
      </Row>
      <MainCard className="mt-4">
        {/* Invoice Table */}
        <div>
          <h4 className="mb-3">Invoices</h4>
          <div className="overflow-auto">
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Date</th>
                  <th>Plan</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>PDF</th>
                </tr>
              </thead>
              <tbody>
                {invoices
                  .filter(invoice => invoice.status.toLowerCase() !== "draft")
                  .map((invoice, index) => (
                    <tr key={invoice.id}>
                      <td>{index + 1}</td>
                      <td>{new Date(invoice.period_start).toLocaleDateString()}</td>
                      <td>{subscription.price?.title || "N/A"}</td>
                      <td>{`${invoice.amount_paid || "N/A"} ${invoice.currency || ""}`}</td>
                      <td>{invoice.is_paid ? "Paid" : "Unpaid"}</td>
                      <td>
                        {invoice.hosted_invoice_url ? (
                          <a href={invoice.hosted_invoice_url} target="_blank" rel="noopener noreferrer">
                            <img
                              src={Print}
                              style={{ width: "24px", height: "24px" }}
                            />
                          </a>
                        ) : (
                          "N/A"
                        )}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </Table>
          </div>
        </div>
      </MainCard>

      <ConfirmationModal
        show={showModal}
        onHide={handleModalClose}
        onConfirm={handleConfirm}
        title="Cancel Subscription"
        body="Are you sure you want to cancel this subscription?"
      />
    </div>
  );
};

export default Invoicing;
