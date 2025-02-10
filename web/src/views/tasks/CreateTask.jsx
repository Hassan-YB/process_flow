import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Container, Card, Form, Button, Row, Col } from "react-bootstrap";
import axios from "axios";
import { showSuccessToast, showErrorToast } from "../../utils/toastUtils";
import Breadcrumb from "../../components/Breadcrumb/breadcrumb";
import '../dashboard/dashboard.css';

const BASE_URL = process.env.REACT_APP_BASE_URL;
const TASK_API_URL = `${BASE_URL}/api/v1/tasks/`;
const token = localStorage.getItem("accessToken");

const CreateTask = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
    due_date: "",
    priority: "low", // Default priority
    attachments: [], // For file uploads
  });

  const handleTaskChange = (e) => {
    setTaskData({ ...taskData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setTaskData({ ...taskData, uploads: [...e.target.files] });
  };

  const handlePriorityChange = (priority) => {
    setTaskData({ ...taskData, priority: priority.toLowerCase() });
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();

    if (!taskData.title.trim()) {
      showErrorToast("Task title is required.");
      return;
    }

    const formData = new FormData();
    formData.append("title", taskData.title);
    formData.append("description", taskData.description);
    formData.append("due_date", taskData.due_date);
    formData.append("priority", taskData.priority);
    formData.append("project", projectId);

    // Ensure files are appended correctly as an array
    taskData.uploads.forEach((file) => {
      formData.append("attachments", file); // Change key from "uploads" to "attachments" as per API expectation
    });

    try {
      await axios.post(`${TASK_API_URL}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      showSuccessToast("Task created successfully!");
      navigate(`/project/${projectId}`);
    } catch (error) {
      console.error("Error creating task:", error.response);
      showErrorToast("Error creating task");
    }
  };

  return (
    <Container>
      <Breadcrumb pageName="New Task" />
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="shadow-lg p-4">
            <Card.Body>
              <Form onSubmit={handleCreateTask}>
                <Form.Group className="mb-3">
                  <Form.Label>Title*</Form.Label>
                  <Form.Control
                    type="text"
                    name="title"
                    placeholder="Enter task title"
                    value={taskData.title}
                    onChange={handleTaskChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Description*</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    name="description"
                    placeholder="Enter task description"
                    value={taskData.description}
                    onChange={handleTaskChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Due Date*</Form.Label>
                  <Form.Control
                    type="date"
                    name="due_date"
                    value={taskData.due_date}
                    onChange={handleTaskChange}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Priority</Form.Label>
                  <div className="d-flex">
                    {["Low", "Medium", "High"].map((level) => (
                      <Button
                        key={level}
                        className={`me-2 ${taskData.priority === level.toLowerCase() ? "priority-c-2 " : "priority-c-1"}`}
                        onClick={() => handlePriorityChange(level)}
                      >
                        {level}
                      </Button>
                    ))}
                  </div>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Upload File</Form.Label>
                  <Form.Control
                    type="file"
                    name="attachments"
                    multiple // Allow multiple file selection
                    onChange={handleFileChange}
                  />
                </Form.Group>

                <div className="d-flex justify-content-center">
                  <button type="submit" className="c-form-btn btn-block">
                    Create Task
                  </button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default CreateTask;
