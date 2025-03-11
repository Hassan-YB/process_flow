import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button, Container, Card, Row, Col } from "react-bootstrap";
import axios from "axios";
import { showSuccessToast, showErrorToast } from "../../utils/toastUtils";
import Breadcrumb from "../../components/Breadcrumb/breadcrumb";
import '../dashboard/dashboard.css';

const BASE_URL = process.env.REACT_APP_BASE_URL;
const API_URL = `${BASE_URL}/api/v1/projects/`;
const token = localStorage.getItem("accessToken");

const CreateProject = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    start_date: "",
    end_date: "",
    status: "in_progress",
    priority: "medium",
    attachments: [],
  });

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setFormData({
        ...formData,
        [name]: [...files], // Store multiple files
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handlePriorityChange = (priority) => {
    setFormData({ ...formData, priority: priority.toLowerCase() });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();

    Object.keys(formData).forEach((key) => {
      if (key === "attachments") {
        formData[key].forEach((file) => {
          formDataToSend.append("attachments", file);
        });
      } else {
        formDataToSend.append(key, formData[key]);
      }
    });

    axios
      .post(API_URL, formDataToSend, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .then(() => {
        showSuccessToast("Project created successfully!");
        navigate("/projects"); // Redirect to project list page
      })
      .catch((error) => showErrorToast("Error creating project"));
  };


  return (
    <div className="container-fluid">
      <Breadcrumb pageName="New Project" />
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="shadow-lg p-4">
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Title*</Form.Label>
                  <Form.Control
                    name="title"
                    type="text"
                    placeholder="Enter project title"
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    name="description"
                    placeholder="Enter project description"
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Row>
                  <Col>
                    <Form.Group className="mb-3">
                      <Form.Label>Start Date*</Form.Label>
                      <Form.Control
                        name="start_date"
                        type="date"
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group className="mb-3">
                      <Form.Label>End Date*</Form.Label>
                      <Form.Control
                        name="end_date"
                        type="date"
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>Priority</Form.Label>
                  <div className="d-flex">
                    {["Low", "Medium", "High"].map((level) => (
                      <Button
                        key={level}
                        className={`me-2 ${formData.priority === level.toLowerCase() ? "priority-c-2" : "priority-c-1"}`}
                        onClick={() => handlePriorityChange(level)}
                      >
                        {level}
                      </Button>
                    ))}
                  </div>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Attachments</Form.Label>
                  <Form.Control
                    name="attachments"
                    type="file"
                    multiple // Enable multiple file selection
                    onChange={handleChange}
                  />
                </Form.Group>

                <div className="d-flex justify-content-center">
                  <button type="submit" className="c-form-btn btn-block">
                    Create Project
                  </button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default CreateProject;
