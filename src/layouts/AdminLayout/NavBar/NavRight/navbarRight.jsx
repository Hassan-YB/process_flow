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

const NavbarRight = () => {
  const navigate = useNavigate();

  const [listOpen, setListOpen] = useState(false);

  return (
    <React.Fragment>
      <ListGroup as="ul" bsPrefix=" " className="navbar-nav ml-auto">
      <ListGroup.Item as="li" className="nav-item">
          <a href="/auth/signin" className="nav-link" style={{color:'#000'}}>
            Login
          </a>
        </ListGroup.Item>
        <ListGroup.Item as="li" className="nav-item">
          <a href="/auth/signup" className="nav-link" style={{color:'#000'}}>
            Signup
          </a>
        </ListGroup.Item>
      </ListGroup>
    </React.Fragment>
  );
};

export default NavbarRight;
