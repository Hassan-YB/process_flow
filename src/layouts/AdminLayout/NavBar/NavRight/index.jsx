import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../../../actions/userActions";

import { showSuccessToast, showErrorToast } from "../../../../utils/toastUtils";
import axios from "axios";
// react-bootstrap
import { ListGroup, Dropdown, Card } from 'react-bootstrap';

// third party
import PerfectScrollbar from 'react-perfect-scrollbar';

// project import
import ChatList from './ChatList';

// assets
import avatar1 from '../../../../assets/images/user/avatar-1.jpg';
import avatar2 from '../../../../assets/images/user/avatar-2.jpg';
import avatar3 from '../../../../assets/images/user/avatar-3.jpg';
import avatar4 from '../../../../assets/images/user/avatar-4.jpg';

// ==============================|| NAV RIGHT ||============================== //
const BASE_URL = import.meta.env.VITE_APP_BASE_URL;
const API_URL = `${BASE_URL}/api/v1/users`;

const NavRight = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  // Fetch the profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) {
          console.error("No access token found");
          return;
        }

        const { data } = await axios.get(`${API_URL}/profile/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(data);
      } catch (error) {
        console.error("Error fetching profile:", error.response?.data || error.message);
        navigate("/auth/signin");
      }
    };

    fetchProfile();
  }, [navigate]);

  const dispatch = useDispatch();

  // State to track if the user is logged in
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("accessToken"));

  const handleLogout = () => {
    const refreshToken = localStorage.getItem("refreshToken");
    if (refreshToken) {
      dispatch(logout(refreshToken));
      // Clear the local storage and update state
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      setIsLoggedIn(false);
      navigate("/auth/signin");
      //showSuccessToast("Logged out successfully!");
    } else {
      showErrorToast("Already logged out.");
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    setIsLoggedIn(!!token);
  }, []);

  const [listOpen, setListOpen] = useState(false);

  return (
    <React.Fragment>
      <ListGroup as="ul" bsPrefix=" " className="navbar-nav ml-auto">
        {/*<ListGroup.Item as="li" bsPrefix=" ">
          <Dropdown align="end">
            <Dropdown.Toggle as={Link} variant="link" to="#" id="dropdown-basic">
              <i className="feather icon-bell icon" />
              <span className="badge rounded-pill bg-danger">
                <span />
              </span>
            </Dropdown.Toggle>
            <Dropdown.Menu align="end" className="notification notification-scroll">
              <div className="noti-head">
                <h6 className="d-inline-block m-b-0">Notifications</h6>
                <div className="float-end">
                  <Link to="#" style={{ textDecoration: 'none' }} className="m-r-10">
                    mark as read
                  </Link>
                  <Link style={{ textDecoration: 'none' }} to="#">
                    clear all
                  </Link>
                </div>
              </div>
              <PerfectScrollbar>
                <ListGroup as="ul" bsPrefix=" " variant="flush" className="noti-body">
                  <ListGroup.Item as="li" bsPrefix=" " className="n-title">
                    <p className="m-b-0">NEW</p>
                  </ListGroup.Item>
                  <ListGroup.Item as="li" bsPrefix=" " className="notification">
                    <Card
                      className="d-flex align-items-center shadow-none mb-0 p-0"
                      style={{ flexDirection: 'row', backgroundColor: 'unset' }}
                    >
                      <img className="img-radius" src={avatar1} alt="Generic placeholder" />
                      <Card.Body className="p-0">
                        <p>
                          <strong>John Doe</strong>
                          <span className="n-time text-muted">
                            <i className="icon feather icon-clock me-2" />
                            30 min
                          </span>
                        </p>
                        <p>New ticket Added</p>
                      </Card.Body>
                    </Card>
                  </ListGroup.Item>
                  <ListGroup.Item as="li" bsPrefix=" " className="n-title">
                    <p className="m-b-0">EARLIER</p>
                  </ListGroup.Item>
                  {notiData.map((data, index) => {
                    return (
                      <ListGroup.Item key={index} as="li" bsPrefix=" " className="notification">
                        <Card
                          className="d-flex align-items-center shadow-none mb-0 p-0"
                          style={{ flexDirection: 'row', backgroundColor: 'unset' }}
                        >
                          <img className="img-radius" src={data.image} alt="Generic placeholder" />
                          <Card.Body className="p-0">
                            <p>
                              <strong>{data.name}</strong>
                              <span className="n-time text-muted">
                                <i className="icon feather icon-clock me-2" />
                                {data.activity}
                              </span>
                            </p>
                            <p>{data.details}</p>
                          </Card.Body>
                        </Card>
                      </ListGroup.Item>
                    );
                  })}
                </ListGroup>
              </PerfectScrollbar>
              <div className="noti-footer">
                <Link to="#">show all</Link>
              </div>
            </Dropdown.Menu>
          </Dropdown>
        </ListGroup.Item>*/}
        {/*}
        <ListGroup.Item as="li" bsPrefix=" ">
          <Dropdown>
            <Dropdown.Toggle as={Link} variant="link" to="#" className="displayChatbox" onClick={() => setListOpen(true)}>
              <i className="icon feather icon-mail" />
              <span className="badge bg-success">
                <span />
              </span>
            </Dropdown.Toggle>
          </Dropdown>
        </ListGroup.Item>
        */}
        <ListGroup.Item as="li" bsPrefix=" ">
          <Dropdown align="end" className="drp-user">
            <Dropdown.Toggle as={Link} variant="link" to="#" id="dropdown-basic">
              <img src={user?.photo ? `${BASE_URL}${user.photo}` : avatar1} className="img-radius wid-40" alt="User Profile" />
            </Dropdown.Toggle>
            <Dropdown.Menu align="end" className="profile-notification">
              <div className="pro-head">
                <img src={user?.photo ? `${BASE_URL}${user.photo}` : avatar1} className="img-radius" alt="User Profile" />
                <span>{user?.full_name || "Guest"}</span>
                <Link to="#" className="dud-logout" title="Logout" onClick={handleLogout}>
                  <i className="feather icon-log-out" />
                </Link>
              </div>
              <ListGroup as="ul" bsPrefix=" " variant="flush" className="pro-body">
                <ListGroup.Item as="li" bsPrefix=" ">
                  <Link to="/profile" className="dropdown-item">
                    <i className="feather icon-user" /> Profile
                  </Link>
                </ListGroup.Item>
                <ListGroup.Item as="li" bsPrefix=" ">
                  <Link to="/pricing" className="dropdown-item">
                    <i className="feather icon-settings" /> Pricing
                  </Link>
                </ListGroup.Item>
                <ListGroup.Item as="li" bsPrefix=" ">
                  <Link to="/billing" className="dropdown-item">
                    <i className="feather icon-mail" /> Billing
                  </Link>
                </ListGroup.Item>
                <ListGroup.Item as="li" bsPrefix=" ">
                  <Link to="/change-password" className="dropdown-item">
                    <i className="feather icon-mail" /> Change Password
                  </Link>
                </ListGroup.Item>
                <ListGroup.Item as="li" bsPrefix=" ">
                  <Link to="#" className="dropdown-item" onClick={handleLogout}>
                    <i className="feather icon-log-out" /> Logout
                  </Link>
                </ListGroup.Item>
              </ListGroup>
            </Dropdown.Menu>
          </Dropdown>
        </ListGroup.Item>
      </ListGroup>
      <ChatList listOpen={listOpen} closed={() => setListOpen(false)} />
    </React.Fragment>
  );
};

export default NavRight;
