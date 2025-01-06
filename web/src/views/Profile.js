import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { showSuccessToast, showErrorToast } from "../utils/toastUtils";

const BASE_URL = process.env.REACT_APP_BASE_URL;
const API_URL = `${BASE_URL}/api/v1/users/profile/`;

const Profile = () => {
  const [profile, setProfile] = useState({
    full_name: "",
    phone_number: "",
    photo: null,
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch profile data
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("accessToken");
        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };
        const { data } = await axios.get(API_URL, config);
        setProfile({
          full_name: data.full_name,
          phone_number: data.phone_number,
          photo: data.photo ? `${BASE_URL}${data.photo}` : null,
        });
      } catch (error) {
        console.error("Error fetching profile:", error.response?.data || error.message);
        showErrorToast("Failed to fetch profile. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return <div>Loading profile...</div>;
  }

  return (
    <div className="container vh-100">
    <div className="d-flex justify-content-between align-items-center mb-4 mt-4">
          <h3>Profile</h3>
          <button
            className="btn btn-primary"
            onClick={() => navigate("/update-profile")}
          >
            Edit Profile
          </button>
        </div>
    <div className="container d-flex justify-content-center align-items-center">
      <div>
        
        <div
          className="card text-center p-4"
          style={{
            width: "400px",
            borderRadius: "15px",
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
          }}
        >
          <div>
            {profile.photo ? (
              <img
                src={profile.photo}
                alt="Profile"
                style={{
                  width: "100px",
                  height: "100px",
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
              />
            ) : (
              <div
                style={{
                  width: "100px",
                  height: "100px",
                  borderRadius: "50%",
                  background: "#ccc",
                  margin: "0 auto",
                }}
              />
            )}
          </div>
          <div className="mt-3">
            <p>
              <strong>{profile.full_name}</strong>
            </p>
            <p>{profile.phone_number}</p>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
  
};

export default Profile;
