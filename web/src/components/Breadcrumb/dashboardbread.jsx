import React from "react";
import { Row, Col } from "react-bootstrap";

const DashboardBreadcrumb = ({pageName}) => {
  const userFullName = localStorage.getItem("userFullName") || "Guest";

  return (
    <>
    <Row className="mb-4">
        <Col className="text-center">
          <h1>{pageName}</h1>
          <p>Hello {userFullName}, welcome back</p>
        </Col>
      </Row>
    </>
  );
};

export default DashboardBreadcrumb;
