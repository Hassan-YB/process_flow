import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchNotifications, updateNotification, markAllAsRead } from "../../config/notificationsSlice";
import { onMessageListener } from "../../firebase";
import { showSuccessToast, showErrorToast } from "../../utils/toastUtils";
import Breadcrumb from "../../components/Breadcrumb/breadcrumb";


const NotificationList = () => {
    const dispatch = useDispatch();
    const { items, unreadCount, status } = useSelector((state) => state.notifications);
  
    useEffect(() => {
      dispatch(fetchNotifications());
  
      onMessageListener()
        .then((payload) => {
          console.log("New Notification:", payload);
          dispatch(fetchNotifications()); // Refresh notifications
        })
        .catch((err) => console.log("Failed to receive message", err));
    }, [dispatch]);
  
  
    const handleMarkAsRead = (id) => {
      dispatch(updateNotification({ notificationIds: [id], isMuted: false, isRead: true }));
    };
  
    const handleMarkAllAsRead = () => {
      dispatch(markAllAsRead());
    };
  
    console.log("Rendering Notifications:", items);
  
    return (
      <div className="container-fluid">
        <Breadcrumb pageName="Notifications" />
        <h3>Notifications ({unreadCount})</h3>
        <button onClick={handleMarkAllAsRead}>Mark All as Read</button>
  
        {/* Handle Loading and Empty State */}
        {status === "loading" && <p>Loading notifications...</p>}
      {status === "failed" && <p>Error loading notifications.</p>}
  
      {items && items.length > 0 ? (
        <ul>
          {items.map((notification) => (
            <li key={notification.id} style={{ background: notification.is_read ? "white" : "#f4f4f4" }}>
              <p><strong>{notification.title}</strong></p>
              <p>{notification.message}</p>
              <p>{notification.is_read ? "Read" : "Unread"}</p>
              <button onClick={() => handleMarkAsRead(notification.id)}>Mark as Read</button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No notifications available.</p>
      )}
      </div>
    );
  };
  
  export default NotificationList;