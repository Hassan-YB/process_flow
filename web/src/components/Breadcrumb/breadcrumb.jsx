import React from "react";
import { Row, Col } from "react-bootstrap";

const Breadcrumb = ({pageName}) => {
  return (
    <>
    <Row className="mb-4">
        <Col className="text-center">
          <h1>{pageName}</h1>
          <p>Hello Cuong, welcome back</p>
        </Col>
      </Row>
    </>
  );
};

export default Breadcrumb;
