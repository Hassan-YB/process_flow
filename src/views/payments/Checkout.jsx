import React from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useLocation } from "react-router-dom";
import CheckoutForm from "./CheckoutForm";


const STRIPE_KEY = import.meta.env.VITE_APP_STRIPE_PUBLISHABLE_KEY;

const stripePromise = loadStripe(STRIPE_KEY);

const Checkout = () => {
  const location = useLocation();
  const { clientSecret, subscriptionId } = location.state;

  if (!clientSecret) {
    return <div>Error: Missing payment information.</div>;
  }

  const options = {
    clientSecret: clientSecret,
    appearance: {
      theme: "stripe",
    },
  };

  return (
    <div className="container mt-5">
      <h3 className="text-center mb-4">Complete Your Payment</h3>
      <Elements stripe={stripePromise} options={options}>
        <CheckoutForm subscriptionId={subscriptionId} />
      </Elements>
    </div>
  );
};

export default Checkout;
