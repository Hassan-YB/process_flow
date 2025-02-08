import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = process.env.REACT_APP_BASE_URL;
const API_URL = `${BASE_URL}/api/v1/notifications`;

// Function to get accessToken from localStorage (or use another method)
const getAccessToken = () => localStorage.getItem("accessToken");

// Fetch notifications
export const fetchNotifications = createAsyncThunk(
  "notifications/fetchNotifications",
  async () => {
    const token = getAccessToken();
    const response = await axios.get(`${API_URL}/?ordering=-created_at`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    console.log("API Response Data:", response.data);
    
    return response.data.results || []; // ✅ Only return the `results` array
  }
);


// Mark a single notification as read
export const updateNotification = createAsyncThunk(
  "notifications/updateNotification",
  async ({ notificationIds, isMuted, isRead }) => {
    const token = getAccessToken();
    await axios.patch(
      `${API_URL}/update/`,
      {
        notification_ids: notificationIds,
        is_muted: isMuted,
        is_read: isRead
      },
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    return { notificationIds, isRead };
  }
);

// Mark all notifications as read
export const markAllAsRead = createAsyncThunk(
  "notifications/markAllAsRead",
  async () => {
    const token = getAccessToken();
    await axios.post(
      `${API_URL}/mark_all_as_read/`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    return true;
  }
);

const notificationsSlice = createSlice({
  name: "notifications",
  initialState: {
    items: [],
    unreadCount: 0,
    status: "idle",
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.items = action.payload; // Ensure this properly updates
        state.unreadCount = action.payload.filter((n) => !n.is_read).length;
        state.status = "succeeded";
      })      
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.error = action.error.message;
        state.status = "failed";
      })
      .addCase(markAllAsRead.fulfilled, (state) => {
        state.items = state.items.map((n) => ({ ...n, is_read: true }));
        state.unreadCount = 0;
      });
      
  }
});

export default notificationsSlice.reducer;
