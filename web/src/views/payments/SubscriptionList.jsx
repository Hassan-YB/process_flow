import React, { useState, useEffect } from "react";
import axios from "axios";
import { showSuccessToast, showErrorToast } from "../../utils/toastUtils";
import Invoice from "../../assets/img/invoice.png";
import MainCard from "../../components/Card/MainCard";
import '../../assets/css/style.css';
import Breadcrumb from "../../layouts/AdminLayout/Breadcrumb";


const BASE_URL = process.env.REACT_APP_BASE_URL;
const API_URL = `${BASE_URL}/api/v1/payment`;

const SubscriptionList = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };

        const { data } = await axios.get(`${API_URL}/subscriptions/`, config);
        setSubscriptions(data);
      } catch (error) {
        //console.error("Error fetching subscriptions:", error.response?.data || error.message);
        //showErrorToast("Failed to load subscriptions.");
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptions();
  }, []);

  const handleCancelSubscription = async (subscriptionId) => {
    try {
      const token = localStorage.getItem("accessToken");
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
  
      await axios.delete(`${API_URL}/subscriptions/${subscriptionId}/`, config);
      showSuccessToast("Subscription canceled successfully!");
  
      // Fetch the updated list of subscriptions
      const { data } = await axios.get(`${API_URL}/subscriptions/`, config);
      setSubscriptions(data);
    } catch (error) {
      //console.error("Error canceling subscription:", error.response?.data || error.message);
      //showErrorToast("Failed to cancel subscription. Please try again.");
    }
  };  

  if (loading) {
    return <div>Loading subscriptions...</div>;
  }

  if (subscriptions.length === 0) {
    return <div>No active subscriptions found.</div>;
  }

  return (
    <div className="container mt-5" style={{ height: "100vh" }}>
      <Breadcrumb title={"Subscriptions"} main={"Dashboard"} item={"Subscriptions"}/>
      <MainCard>
      <div className="d-flex justify-content-between align-items-center mb-4 pb-4">
          
          <a href="/invoices">
          <img
                src={Invoice}
                alt="Invoice"
                style={{
                  width: "40px",
                  height: "40px",
                }}
                />
                </a>
        </div>
      <div className="row justify-content-center mt-4">
        {subscriptions.map((subscription) => (
          <div className="col-md-4 mb-4" key={subscription.id}>
            <div
              className="card text-center p-3"
              style={{
                borderRadius: "15px",
                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                background: "linear-gradient(135deg, #a445b2, #fa4299)",
                color: "white",
              }}
            >
              <div className="d-flex justify-content-between align-items-center mb-3">

              <span style={{ fontWeight: "bold", fontSize: "18px" }}>
                {subscription.title}
              </span>
                <span
                  style={{
                    background: subscription.status === "active" ? "#4caf50" : "#f44336",
                    color: "white",
                    borderRadius: "10px",
                    padding: "5px 10px",
                    fontSize: "12px",
                    fontWeight: "bold",
                  }}
                >
                  {subscription.status.toUpperCase()}
                </span>
              </div>
              <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center mb-3">
              <p style={{ fontSize: "14px" }}>
                Start Date: 
                <span style={{ fontWeight: "bold" }}>{new Date(subscription.current_period_start).toLocaleDateString()}</span>
              </p>
              <p style={{ fontSize: "14px" }}>
                End Date: 
                <span style={{ fontWeight: "bold" }}>{new Date(subscription.current_period_end).toLocaleDateString()}</span>
              </p>
              </div>
              <button
                className="btn btn-danger mt-3"
                style={{
                  background: "#f44336",
                  border: "none",
                  borderRadius: "20px",
                  padding: "10px 20px",
                  color: "#fff",
                }}
                onClick={() => handleCancelSubscription(subscription.id)}
              >
                Cancel Subscription
              </button>
            </div>
          </div>
        ))}
      </div>
      </MainCard>
    </div>
  );
};

export default SubscriptionList;
