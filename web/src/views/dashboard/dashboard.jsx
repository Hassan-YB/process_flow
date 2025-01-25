import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import Activities from "../../assets/images/activities.png";
import Tasks from "../../assets/images/tasks.png";
import Revenue from "../../assets/images/Revenue.png";
import "./dashboard.css"
import Breadcrumb  from "../../components/Breadcrumb/breadcrumb";

const Dashboard = () => {
  return (
    <Container>
      <Breadcrumb pageName="Dashboard" />

      <Row>
        <Col md={8}>
          <img src={Revenue} alt='dashboard'/>
        </Col>
        <Col md={4}>
          <img src={Tasks} alt='dashboard'/>
          <img src={Activities} alt='dashboard'/>
        </Col>
      </Row>

      {/* Revenue and Progress 
      <Row>
        <Col md={8}>
          <Card className="mb-4">
            <Card.Body>
              <h5>Revenue</h5>
              <p>This Week</p>
              <div style={{ height: "200px", background: "#f0f0f0" }}>
                Chart Placeholder
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="mb-4">
            <Card.Body>
              <h5>85%</h5>
              <p>Tasks Done</p>
              <ProgressBar now={85} />
            </Card.Body>
          </Card>
          <Card>
            <Card.Body>
              <h5>58%</h5>
              <p>Team Activities</p>
              <ProgressBar now={58} />
            </Card.Body>
          </Card>
        </Col>
      </Row>*/}

      {/* Visitors and Featured Projects 
      <Row>
        <Col md={6}>
          <Card className="mb-4">
            <Card.Body>
              <h5>Visitors</h5>
              <div style={{ height: "200px", background: "#f0f0f0" }}>
                Bar Chart Placeholder
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="mb-4">
            <Card.Body>
              <h5>Featured Projects</h5>
              <ul>
                <li>AFD Marketing Project - $400</li>
                <li>DNP Finance Project - $920</li>
                <li>ADO Marketing Project - $340</li>
              </ul>
            </Card.Body>
          </Card>
        </Col>
      </Row>*/}

      {/* Discover Projects 
      <Row>
        <Col>
          <Card className="mb-4 text-center">
            <Card.Body>
              <h5>Discover all Projects</h5>
              <button className="btn btn-primary">Show all Projects</button>
            </Card.Body>
          </Card>
        </Col>
      </Row>*/}

      {/* Profile Card 
      <Row>
        <Col>
          <Card className="mb-4">
            <Card.Body>
              <h5>Tony Cook</h5>
              <p>Total Registered Users: 2,309</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>*/}
    </Container>
  );
};

export default Dashboard;
