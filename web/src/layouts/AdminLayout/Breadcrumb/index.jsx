import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

// react-bootstrap
import { ListGroup } from 'react-bootstrap';

// project import
import navigation from '../../../menu-items';
import { BASE_TITLE } from '../../../config/constant';
import './bread.css';

// ==============================|| BREADCRUMB ||============================== //

const Breadcrumb = ({ title, main, item }) => {
  if (!title && !main && !item) {
    // Do not render anything if no props are passed
    return null;
  }

  return (
    <div className="page-header">
      <div className="page-block">
        <div className="row align-items-center">
          <div className="col-md-12">
            <div className="page-header-title">
            </div>
            <ListGroup as="ul" bsPrefix=" " className="breadcrumb">
              {/* Home Breadcrumb */}
              <ListGroup.Item as="li" bsPrefix=" " className="breadcrumb-item">
                <Link to="/dashboard">
                  <i className="feather icon-home" />
                </Link>
              </ListGroup.Item>
              {/* Main Section Breadcrumb */}
              {main && (
                <ListGroup.Item as="li" bsPrefix=" " className="breadcrumb-item">
                  <Link to="/dashboard">{main}</Link>
                </ListGroup.Item>
              )}
              {/* Sub Item Breadcrumb */}
              {item && (
                <ListGroup.Item as="li" bsPrefix=" " className="breadcrumb-item">
                  <Link to="#">{item}</Link>
                </ListGroup.Item>
              )}
            </ListGroup>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Breadcrumb;