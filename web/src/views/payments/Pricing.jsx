import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { showSuccessToast, showErrorToast } from "../../utils/toastUtils";
import CheckmarkIcon from "../../assets/img/checkmark.png";
import MainCard from "../../components/Card/MainCard";
import Breadcrumb from "../../layouts/AdminLayout/Breadcrumb";
import ConfirmationModal from "../../components/Modal/ConfirmationModal";

const BASE_URL = import.meta.env.VITE_APP_BASE_URL;
const API_URL = `${BASE_URL}/api/v1/payment`;

const Pricing = () => {
  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedPrice, setSelectedPrice] = useState(null);
  const navigate = useNavigate();

  // Function to fetch prices
  const fetchPrices = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      const { data } = await axios.get(`${API_URL}/prices/`, config);
      setPrices(data);
    } catch (error) {
      console.error("Error fetching pricing:", error.response?.data || error.message);
      showErrorToast("Failed to load pricing details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrices();
  }, []);

  const handleUpdateSubscription = async () => {
    if (!selectedPrice) return;

    try {
      const token = localStorage.getItem("accessToken");
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      const body = { price_slug: selectedPrice.slug };
      await axios.put(`${API_URL}/subscriptions/`, body, config);

      showSuccessToast("Subscription updated successfully!");
      setShowModal(false);
      fetchPrices();
    } catch (error) {
      console.error("Update Subscription Error:", error.response?.data || error.message);
      showErrorToast("Failed to update subscription. Please try again.");
    }
  };

  const handleSubscribeClick = (price) => {
    const activePrice = prices.find((p) => p.is_active);

    if (activePrice && activePrice.slug !== price.slug) {
      // Show confirmation modal if updating the subscription
      setSelectedPrice(price);
      setShowModal(true);
    } else {
      handleSubscribe(price.slug);
    }
  };

  const handleSubscribe = async (priceSlug) => {
    const activePrice = prices.find((price) => price.is_active);

    if (activePrice && activePrice.slug === priceSlug) {
      showErrorToast("This plan is already subscribed. Please choose another one.");
      return;
    }

    try {
      const token = localStorage.getItem("accessToken");
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      const body = { price_slug: priceSlug };

      const { data } = await axios.post(`${API_URL}/subscriptions/`, body, config);
      const selectedPlan = prices.find((price) => price.slug === priceSlug);
      navigate("/checkout", {
        state: {
          clientSecret: data.client_secret,
          subscriptionId: data.subscription_id,
          planTitle: selectedPlan.title,
          planAmount: selectedPlan.amount,
          planCurrency: selectedPlan.currency,
          billingPeriod: selectedPlan.billing_period,
        },
      });
    } catch (error) {
      console.error("Subscription Error:", error.response?.data || error.message);
      showErrorToast("Failed to create subscription. Please try again.");
    }
  };


  if (loading) {
    return <div>Loading pricing...</div>;
  }

  const isAnyPriceActive = prices.some((price) => price.is_active);

  return (
    <div className="container">
      <Breadcrumb title={"Pricing"} main={"Dashboard"} item={"Pricing"} />
      <MainCard>
        <div className="row justify-content-center">
          <h4 className="mb-5 text-center">Pricing Plans</h4>
          {prices.map((price) => (
            <div className="col-md-3 mb-4" key={price.id}>
              <div
                className="card text-center p-3"
                style={{
                  border: "1px solid #eaeaea",
                  borderRadius: "15px",
                  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                  position: "relative",
                  background: "#fff",
                }}
              >
                <h5 className="text-primary mb-2" style={{ fontWeight: "bold" }}>
                  {price.title}
                </h5>
                <h3 className="text-purple mb-2">
                  {price.amount} {price.currency.toUpperCase()}
                </h3>
                <p className="text-muted mb-3">
                  {price.billing_period === "yearly" ? "Billed yearly" : "Billed monthly"}
                </p>
                {price.is_active && (
                  <img
                    src={CheckmarkIcon}
                    alt="Active Plan"
                    style={{
                      width: "20px",
                      height: "20px",
                      position: "absolute",
                      top: "15px",
                      right: "15px",
                    }}
                  />
                )}
                <button
                  className="btn btn-primary mt-3"
                  onClick={() => handleSubscribeClick(price)}
                  style={{
                    background: "linear-gradient(to right, #9860DA, #C374E2",
                    border: "none",
                    borderRadius: "20px",
                    padding: "10px 20px",
                    color: "#fff",
                  }}
                >
                  {price.is_active
                    ? "Active"
                    : isAnyPriceActive
                      ? "Update"
                      : "Subscribe"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </MainCard>
      {/* Confirmation Modal */}
      <ConfirmationModal
        show={showModal}
        onHide={() => setShowModal(false)}
        onConfirm={handleUpdateSubscription}
        title="Confirm Subscription"
        body={`You are about to subscribe to the ${selectedPrice?.title}.`}
      />
    </div>
  );
};

export default Pricing;
