import React from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useLocation } from "react-router-dom";
import CheckoutForm from "./CheckoutForm";

const stripePromise = loadStripe("pk_test_51P7yPwJoccXEl6KQ5ptlIoOoOMeEZPA4QRD39KpLgMj2n3WaJ9LwltCamZIabxHpJKB77iaS9y6r1QcCYBsyml1b005vxHGVif");

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
