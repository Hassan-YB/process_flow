import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = process.env.REACT_APP_BASE_URL;
const API_URL = `${BASE_URL}/api/v1/notifications`;

const getAccessToken = () => localStorage.getItem("accessToken");

// Fetch notifications with pagination
export const fetchNotifications = createAsyncThunk(
  "notifications/fetchNotifications",
  async ({ page = 1 }) => {
    const token = getAccessToken();
    const response = await axios.get(`${API_URL}/?ordering=-created_at&page=${page}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    return {
      results: response.data.results || [],
      unreadCount: response.data.results.filter((n) => !n.is_read).length,
      nextPage: response.data.next ? page + 1 : null,
      prevPage: response.data.previous ? page - 1 : null,
      totalPages: response.data.total_pages || 1
    };
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

const storedUnreadCount = localStorage.getItem("unreadCount");

const notificationsSlice = createSlice({
  name: "notifications",
  initialState: {
    items: [],
    unreadCount: storedUnreadCount ? parseInt(storedUnreadCount) : 0,
    status: "idle",
    error: null,
    totalPages: 1,
    nextPage: null,
    prevPage: null,
  },
  reducers: {
    incrementUnread: (state) => {
      state.unreadCount += 1;
      localStorage.setItem("unreadCount", state.unreadCount); // Persist data
    },
    setUnreadCount: (state, action) => {
      state.unreadCount = action.payload;
      localStorage.setItem("unreadCount", state.unreadCount); // Persist data
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.items = action.payload.results;
        state.unreadCount = action.payload.results.filter((n) => !n.is_read).length;
        state.totalPages = action.payload.totalPages;
        state.nextPage = action.payload.nextPage;
        state.prevPage = action.payload.prevPage;
        localStorage.setItem("unreadCount", state.unreadCount);
        state.status = "succeeded";
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.error = action.error.message;
        state.status = "failed";
      })
      .addCase(markAllAsRead.fulfilled, (state) => {
        state.items = state.items.map((n) => ({ ...n, is_read: true }));
        state.unreadCount = 0;
        localStorage.setItem("unreadCount", 0);
      });
  }
});

export const { incrementUnread, setUnreadCount } = notificationsSlice.actions;
export default notificationsSlice.reducer;
