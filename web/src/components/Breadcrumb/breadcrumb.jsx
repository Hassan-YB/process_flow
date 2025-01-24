import React from "react";
import { Container, Row, Col, Card, ProgressBar } from "react-bootstrap";
import { FaSearch } from "react-icons/fa";

const Breadcrumb = ({pageName}) => {
  return (
    <>
    <Row className="mb-4">
        <Col>
          <h1>{pageName}</h1>
          <p>Hello Cuong, welcome back</p>
        </Col>
      </Row>
    </>
  );
};

export default Breadcrumb;
