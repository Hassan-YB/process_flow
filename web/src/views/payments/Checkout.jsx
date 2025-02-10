import React from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useLocation } from "react-router-dom";
import CheckoutForm from "./CheckoutForm";
import Breadcrumb from "../../components/Breadcrumb/breadcrumb";


const STRIPE_KEY = process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY;

const stripePromise = loadStripe(STRIPE_KEY);

const Checkout = () => {
  const location = useLocation();
  const { clientSecret, subscriptionId, planTitle, planAmount, planCurrency, billingPeriod } = location.state || {};

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
    <div>
    <div className="container-fluid">
    <Breadcrumb pageName="Checkout" />
      <div className="row mt-5">
        {/* Plan Details Section */}
        <div className="col-12 col-md-4">
          <div
            className="card p-3 text-center"
            style={{
              border: "1px solid #eaeaea",
              borderRadius: "10px",
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
            }}
          >
            <h5 className="text-primary" style={{ fontWeight: "bold" }}>
              {planTitle}
            </h5>
            <h2 className="text-purple mb-2">
              {planAmount} {planCurrency.toUpperCase()}
            </h2>
            <p className="text-muted">
              {billingPeriod === "yearly" ? "Billed yearly" : "Billed monthly"}
            </p>
          </div>
        </div>

        {/* Checkout Form Section */}
        <div className="col-12 col-sm-12 col-md-8">
          <Elements stripe={stripePromise} options={options}>
            <CheckoutForm subscriptionId={subscriptionId} />
          </Elements>
        </div>
      </div>
    </div>
    </div>
  );
};

export default Checkout;
