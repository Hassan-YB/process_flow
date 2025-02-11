import axios from 'axios';
import { showSuccessToast, showErrorToast } from "../utils/toastUtils";

// API Base URL
const BASE_URL = process.env.REACT_APP_BASE_URL;
const API_URL = `${BASE_URL}/api/v1/users`;

//const navigate = useNavigate();


// Action Types
export const USER_SIGNUP = 'USER_SIGNUP';
export const USER_VERIFY_OTP = 'USER_VERIFY_OTP';
export const USER_LOGIN = 'USER_LOGIN';
export const CHANGE_PASSWORD = 'CHANGE_PASSWORD';
export const RESEND_OTP_SUCCESS = 'RESEND_OTP_SUCCESS';
export const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS';


// Signup Action
export const userSignup = (userData, navigate) => async (dispatch) => {
  try {
    const { data } = await axios.post(`${API_URL}/signup/`, userData);

    // Store email and password in localStorage temporarily
    localStorage.setItem("signupEmail", userData.email);
    localStorage.setItem("signupPassword", userData.password);

    dispatch({ type: USER_SIGNUP, payload: data });

    navigate("/auth/verify", { state: { email: userData.email, phone_number: userData.phone_number } });
  } catch (error) {
    const errors = error.response?.data || {};
    let errorMessage = "An error occurred. Please check your input.";

    // Process specific errors
    if (typeof errors === "object") {
      const errorMessages = Object.values(errors)
        .flat()
        .join(" ");
      errorMessage = errorMessages;
    } else if (typeof errors === "string") {
      errorMessage = errors;
    }

    showErrorToast(errorMessage);
  }
};

// Verify OTP Action
export const verifyOtp = (otpData, navigate) => async (dispatch) => {
  try {
    const { data } = await axios.post(`${API_URL}/otp/verify/`, otpData);
    dispatch({ type: USER_VERIFY_OTP, payload: data });

    //window.location.href = "/auth/signin";
    showSuccessToast("Verification successful;")

    // Retrieve email and password from localStorage
    const email = localStorage.getItem("signupEmail");
    const password = localStorage.getItem("signupPassword");

    if (email && password) {
      // Automatically log the user in
      const loginData = { email, password };
      const loginResponse = await axios.post(`${API_URL}/login/`, loginData);
      const accessToken = loginResponse.data.tokens.access;
      const refreshToken = loginResponse.data.tokens.refresh;

      // Dispatch login action
      dispatch({ type: USER_LOGIN, payload: loginResponse.data });

      // Store tokens and navigate
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      // Clear the temporary credentials
      localStorage.removeItem("signupEmail");
      localStorage.removeItem("signupPassword");

      navigate("/pricing");
      window.location.reload();
    }
  } catch (error) {
    const errors = error.response?.data || {};
    let errorMessage = "An error occurred. Please try again.";

    if (errors.non_field_errors) {
      errorMessage = errors.non_field_errors.join(" ");
    } else if (typeof errors === "object") {
      const errorMessages = Object.values(errors)
        .flat()
        .join(" ");
      errorMessage = errorMessages;
    } else if (typeof errors === "string") {
      errorMessage = errors;
    }

    showErrorToast(errorMessage);
  }
};

// Resend OTP Action
export const resendOtp = (otpData) => async (dispatch) => {
  try {
    const { data } = await axios.post(`${API_URL}/otp/resend/`, otpData);
    dispatch({ type: RESEND_OTP_SUCCESS, payload: data });
    showSuccessToast("OTP has been resent successfully!");
  } catch (error) {
    //console.error("Resend OTP Error:", error.response?.data || error.message);
    //showErrorToast("Failed to resend OTP. Please try again.");
    showErrorToast(error.response?.data || error.message);
  }
};

// Login Action
export const userLogin = (loginData, navigate) => async (dispatch) => {
  try {
    const { data } = await axios.post(`${API_URL}/login/`, loginData);

    const accessToken = data.tokens.access;
    const refreshToken = data.tokens.refresh;
    const userFullName = data.user.full_name;

    // Dispatch the login success action
    dispatch({ type: USER_LOGIN, payload: data });

    // Store both access and refresh tokens in localStorage
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    localStorage.setItem("userFullName", userFullName);

    navigate("/pricing");
    showSuccessToast("successfully logged in.")
  } catch (error) {
    const errors = error.response?.data || {};
    let errorMessage = "An error occurred. Please try again.";

    if (errors.non_field_errors) {
      errorMessage = errors.non_field_errors.join(" ");
    } else if (typeof errors === "object") {
      const errorMessages = Object.values(errors)
        .flat()
        .join(" ");
      errorMessage = errorMessages;
    } else if (typeof errors === "string") {
      errorMessage = errors;
    }

    showErrorToast(errorMessage);
  }
};


// Logout Action
export const logout = (refreshToken, navigate) => async (dispatch) => {
  try {
    const token = localStorage.getItem("accessToken");
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    const body = { refresh: refreshToken };

    await axios.post(`${API_URL}/logout/`, body, config);

    // Clear local storage
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");

    dispatch({ type: "LOGOUT_SUCCESS" });

    showSuccessToast("Logged out successfully!");
    //window.location.href = "/auth/signin";
    navigate("/auth/signin");
  } catch (error) {
    //console.error("Logout Error:", error.response?.data || error.message);
    //showErrorToast("Failed to resend OTP. Please try again.");
    showErrorToast(error.response?.data || error.message);
  }
};


// Change Password Action
export const changePassword = (passwordData, navigate) => async (dispatch) => {
  try {
    const token = localStorage.getItem('accessToken');
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    const { data } = await axios.post(`${API_URL}/password/change/`, passwordData, config);
    dispatch({ type: CHANGE_PASSWORD, payload: data });

    showSuccessToast("Password changed successfully!");

    navigate("/profile");
  } catch (error) {
    showErrorToast(error.response?.data?.error || error.message);
  }
};


export const forgotPassword = (phoneData, navigate) => async (dispatch) => {
  try {
    const { data } = await axios.post(`${API_URL}/password/forgot/`, phoneData);
    showSuccessToast(data.message);
    navigate("/auth/password-otp-verify");
  } catch (error) {
    //console.error("Forgot Password Error:", error.response?.data || error.message);
    showErrorToast(
      error.response?.data?.message || "Failed to send OTP. Please try again."
    );
  }
};

export const forgotPasswordVerify = (verifyData) => async (dispatch) => {
  try {
    const { data } = await axios.post(`${API_URL}/password/forgot/`, verifyData);
    showSuccessToast(data.message);
    window.location.href = "/auth/signin";
  } catch (error) {
    //console.error("Forgot Password Verify Error:", error.response?.data || error.message);
    showErrorToast(
      error.response?.data?.message || "Failed to reset password. Please try again."
    );
  }
};