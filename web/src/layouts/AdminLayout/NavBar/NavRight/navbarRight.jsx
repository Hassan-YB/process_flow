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

import { useLocation } from 'react-router-dom';

// assets
import avatar1 from '../../../../assets/images/user/avatar-1.jpg';
import avatar2 from '../../../../assets/images/user/avatar-2.jpg';
import avatar3 from '../../../../assets/images/user/avatar-3.jpg';
import avatar4 from '../../../../assets/images/user/avatar-4.jpg';

// ==============================|| NAV RIGHT ||============================== //

const NavbarRight = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [listOpen, setListOpen] = useState(false);

  const isOnLoginPage = location.pathname === '/auth/signin';
  const isOnSignupPage = location.pathname === '/auth/signup';

  return (
    <React.Fragment>
      <ListGroup as="ul" bsPrefix=" " className="navbar-nav ml-auto">
        {/* Render Login only if not on the login page */}
        {!isOnLoginPage && (
          <ListGroup.Item as="li" className="nav-item">
            <a
              href="/auth/signin"
              className="btn"
              style={{
                backgroundColor: '#fff',
                border: '2px solid #7843be',
                color: '#7843be',
                marginRight: '10px',
                padding: '5px 10px 5px 10px',
              }}
            >
              Login
            </a>
          </ListGroup.Item>
        )}
        {/* Render Signup only if not on the signup page */}
        {!isOnSignupPage && (
          <ListGroup.Item as="li" className="nav-item">
            <a
              href="/auth/signup"
              className="btn"
              style={{
                backgroundColor: '#fff',
                border: '2px solid #7843be',
                color: '#7843be',
                padding: '5px 10px 5px 10px',
              }}
            >
              Signup
            </a>
          </ListGroup.Item>
        )}
      </ListGroup>
    </React.Fragment>
  );
};

export default NavbarRight;
