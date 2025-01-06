import React from "react";
import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { showSuccessToast, showErrorToast } from "../utils/toastUtils";


const BASE_URL = process.env.REACT_APP_BASE_URL;
const API_URL = `${BASE_URL}/api/v1/payment`;

const CheckoutForm = ({ subscriptionId }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      showErrorToast("Stripe or elements not loaded. Please refresh and try again.");
      return;
    }

    try {
      // Confirm payment
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/subscriptions`,
        },
        redirect: "if_required", // Handle redirection if required
      });

      // Check for errors in payment confirmation
      if (error) {
        console.error("Payment Error:", error.message);
        showErrorToast("Payment failed. Please try again.");
        return;
      }

      // Ensure paymentIntent is successful
      if (paymentIntent && paymentIntent.status === "succeeded") {
        await handleSubscriptionSuccess(subscriptionId);
        navigate("/subscriptions")
      } else {
        console.error("Payment not completed. Status:", paymentIntent?.status);
        showErrorToast("Payment not successful. Please try again.");
      }
    } catch (error) {
      console.error("Payment Processing Error:", error.message);
      showErrorToast("An error occurred during payment. Please try again.");
    }
  };

  const handleSubscriptionSuccess = async (subscriptionID) => {
    try {
      const token = localStorage.getItem("accessToken");
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      const { data } = await axios.post(
        `${API_URL}/subscriptions/${subscriptionID}/success/`,
        {},
        config
      );

      showSuccessToast("Subscription activated successfully!");
      console.log("Subscription Success Response:", data);
    } catch (error) {
      console.error("Subscription Success Error:", error.response?.data || error.message);
      showErrorToast("Failed to activate subscription. Please try again.");
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center mt-4">
      <div
          className="card text-center p-4"
          style={{
            width: "400px",
            borderRadius: "15px",
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
          }}
        >
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      <button className="btn btn-primary mt-4" disabled={!stripe} 
      style={{
                  background: "linear-gradient(to right, #6f42c1, #a445b2)",
                  border: "none",
                  borderRadius: "20px",
                  padding: "10px 20px",
                  color: "#fff",
                }}>
        Confirm Payment
      </button>
    </form>
    </div>
    </div>
  );
};

export default CheckoutForm;
