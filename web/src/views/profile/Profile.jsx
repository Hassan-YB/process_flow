import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { showSuccessToast, showErrorToast } from "../../utils/toastUtils";
import Breadcrumb from "../../components/Breadcrumb/breadcrumb";

const BASE_URL = process.env.REACT_APP_BASE_URL;
const API_URL = `${BASE_URL}/api/v1/users/profile/`;

const UpdateProfile = () => {
  const [profile, setProfile] = useState({
    full_name: "",
    phone_number: "",
    photo: null,
    photoPreview: null,
  });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    // Fetch profile on component mount
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
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfile({
        ...profile,
        photo: file,
        photoPreview: URL.createObjectURL(file),
      });
    }
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setUpdating(true);
      const token = localStorage.getItem("accessToken");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      };

      const formData = new FormData();
      formData.append("full_name", profile.full_name);
      formData.append("phone_number", profile.phone_number);
      if (profile.photo instanceof File) {
        formData.append("photo", profile.photo);
      }

      await axios.put(API_URL, formData, config);
      showSuccessToast("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error.response?.data || error.message);
      showErrorToast("Failed to update profile. Please try again.");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return <div>Loading profile...</div>;
  }

  return (
    <div className="container">
      <Breadcrumb pageName="Profile" />
    <div className="d-flex justify-content-center align-items-center">
      <div
        className="card p-4"
        style={{
          width: "400px",
          borderRadius: "15px",
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        <h3 className="text-center">Profile</h3>
        <form onSubmit={handleSubmit} className="mt-4">
          <div className="form-group position-relative mb-3">
            <label htmlFor="full_name">Full Name</label>
            <input
              type="text"
              id="full_name"
              name="full_name"
              className="form-control"
              placeholder="John Doe"
              style={{ paddingRight: "40px" }}
              value={profile.full_name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group position-relative mb-3">
            <label htmlFor="phone_number">Phone Number</label>
            <input
              type="text"
              id="phone_number"
              name="phone_number"
              className="form-control"
              placeholder="+1234567890"
              style={{ paddingRight: "40px" }}
              value={profile.phone_number}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group position-relative mb-3">
            <label htmlFor="photo">Profile Photo</label>
            <input
              type="file"
              id="photo"
              name="photo"
              className="form-control"
              onChange={handleFileChange}
              style={{ paddingRight: "40px" }}
            />
            {(profile.photoPreview || profile.photo) && (
              <div className="mt-2 text-center">
                <img
                  src={profile.photoPreview || profile.photo}
                  alt="Profile"
                  style={{
                    width: "100px",
                    height: "100px",
                    borderRadius: "50%",
                    objectFit: "cover",
                  }}
                />
              </div>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-primary text-white"
            style={{
              background: "linear-gradient(to right, #9860DA, #C374E2",
              border: "none",
              width: "100%",
            }}
            disabled={updating}
          >
            {updating ? "Updating..." : "Update"}
          </button>
        </form>
      </div>
    </div>
    </div>
  );
};

export default UpdateProfile;
