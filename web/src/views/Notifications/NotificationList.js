import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchNotifications, updateNotification, markAllAsRead } from "../../config/notificationsSlice";
import { onMessageListener } from "../../firebase";
import { showSuccessToast, showErrorToast } from "../../utils/toastUtils";
import Breadcrumb from "../../components/Breadcrumb/breadcrumb";
import { Tab, Nav, Button, Card, ListGroup, Form, InputGroup } from "react-bootstrap";
import moment from "moment";
import { FiSearch } from "react-icons/fi";


const NotificationList = () => {
  const dispatch = useDispatch();
  const { items, unreadCount, status, totalPages, nextPage, prevPage } = useSelector((state) => state.notifications);
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    dispatch(fetchNotifications({ page: currentPage }));

    // Handle real-time notifications
    onMessageListener()
      .then((payload) => {
        //console.log("New Notification:", payload);
        dispatch(fetchNotifications({ page: currentPage }));
      })
      .catch((err) => console.log("Failed to receive message", err));
  }, [dispatch, currentPage]);

  const handleMarkAsRead = (id) => {
    dispatch(updateNotification({ notificationIds: [id], isMuted: false, isRead: true }));
    dispatch(fetchNotifications({ page: currentPage }));
  };

  const handleMarkAllAsRead = () => {
    dispatch(markAllAsRead()).then(() => {
      dispatch(fetchNotifications({ page: currentPage }));
    });
  };

  const formatDate = (date) => {
    return moment(date).isSame(moment(), "day")
      ? moment(date).format("hh:mm A") // If today, show time
      : moment(date).format("MMM D, YYYY"); // Else, show date
  };

  const filteredNotifications = items
    .filter((n) => (activeTab === "unread" ? !n.is_read : true))
    .filter((n) => n.title.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="container-fluid mt-4">
      <Breadcrumb pageName="Notifications" />

      <div className="d-flex justify-content-between align-items-center flex-column flex-sm-row">
        <h3>Notifications ({unreadCount})</h3>
        <div className="d-flex flex-column flex-sm-row">
          <InputGroup className="custom-search">
            <InputGroup.Text>
              <FiSearch />
            </InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ height: "40px" }}
            />
          </InputGroup>
          <button type="submit"
            className="btn btn-primary mt-2 mt-sm-0 ms-0 ms-sm-2" onClick={handleMarkAllAsRead} style={{
              background: "#fff",
              color: "#6f42c1",
              height: "40px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "0 20px",
              whiteSpace: "nowrap"
            }}>
            Mark All as Read
          </button>
        </div>
      </div>

      <Tab.Container activeKey={activeTab} onSelect={(tab) => setActiveTab(tab)}>
        <Nav variant="tabs" className="mt-3">
          <Nav.Item>
            <Nav.Link eventKey="all">All Notifications</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="unread">Unread Notifications</Nav.Link>
          </Nav.Item>
        </Nav>

        <Tab.Content className="mt-3">
          <Tab.Pane eventKey="all">
            {filteredNotifications.length > 0 ? (
              <ListGroup>
                {filteredNotifications.map((notification) => (
                  <ListGroup.Item key={notification.id} className={`d-flex justify-content-between flex-column flex-sm-row ${notification.is_read ? "" : "bg-light"}`}>
                    <div>
                      <strong>{notification.title}</strong>
                      <p className="mb-1">{notification.message}</p>
                      <small className="text-muted">{formatDate(notification.created_at)}</small>
                    </div>
                    {!notification.is_read && (
                      <button type="submit"
                        className="btn btn-primary" style={{
                          background: "#fff",
                          color: "#6f42c1",
                          height: "40px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          padding: "0 20px",
                          whiteSpace: "nowrap"
                        }} onClick={() => handleMarkAsRead(notification.id)}>
                        Mark as Read
                      </button>
                    )}
                  </ListGroup.Item>
                ))}
              </ListGroup>
            ) : (
              <p>No notifications available.</p>
            )}
          </Tab.Pane>

          <Tab.Pane eventKey="unread">
            {filteredNotifications.length > 0 ? (
              <ListGroup>
                {filteredNotifications.map((notification) => (
                  <ListGroup.Item key={notification.id} className="bg-light d-flex justify-content-between flex-column flex-sm-row">
                    <div>
                      <strong>{notification.title}</strong>
                      <p className="mb-1">{notification.message}</p>
                      <small className="text-muted">{formatDate(notification.created_at)}</small>
                    </div>
                    <button type="submit"
                      className="btn btn-primary" style={{
                        background: "#fff",
                        color: "#6f42c1",
                        height: "40px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "0 20px",
                        whiteSpace: "nowrap"
                      }} onClick={() => handleMarkAsRead(notification.id)}>
                      Mark as Read
                    </button>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            ) : (
              <p>No unread notifications.</p>
            )}
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>
      {/*} Pagination */}
      <div className="d-flex justify-content-between align-items-center mt-4">
        <Button
          variant="secondary"
          disabled={!prevPage}
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
        >
          Previous
        </Button>
        <span>Page {currentPage} of {totalPages}</span>
        <Button
          variant="secondary"
          disabled={!nextPage}
          onClick={() => setCurrentPage((prev) => prev + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default NotificationList;