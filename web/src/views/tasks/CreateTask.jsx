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
    uploads: null, // For file uploads
  });

  const handleTaskChange = (e) => {
    setTaskData({ ...taskData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setTaskData({ ...taskData, uploads: e.target.files[0] });
  };

  const handlePriorityChange = (priority) => {
    setTaskData({ ...taskData, priority: priority.toLowerCase() });
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();

    if (!taskData.title.trim()) {
      alert("Task title is required.");
      return;
    }

    const formData = new FormData();
    formData.append("title", taskData.title);
    formData.append("description", taskData.description);
    formData.append("due_date", taskData.due_date);
    formData.append("priority", taskData.priority);
    formData.append("project", projectId);
    if (taskData.uploads) {
      formData.append("uploads", taskData.uploads);
    }

    try {
      await axios.post(`${TASK_API_URL}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      alert("Task created successfully!");
      navigate(`/project/${projectId}`);
    } catch (error) {
      alert("Error creating task: " + error);
    }
  };

  return (
    <Container>
      <Breadcrumb pageName="New Task" />
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="shadow-lg p-4">
            <Card.Body>
              <h2 className="mb-4 text-center"></h2>
              <Form onSubmit={handleCreateTask}>
                <Form.Group className="mb-3">
                  <Form.Label>Task Title</Form.Label>
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
                  <Form.Label>Task Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    name="description"
                    placeholder="Enter task description"
                    value={taskData.description}
                    onChange={handleTaskChange}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Due Date</Form.Label>
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
                        variant={taskData.priority === level.toLowerCase() ? "primary" : "outline-secondary"}
                        className="me-2"
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
                    name="uploads"
                    onChange={handleFileChange}
                  />
                </Form.Group>

                <div className="d-flex justify-content-center">
                  {/*<Button variant="secondary" className="me-2" onClick={() => window.history.back()}>
                    Cancel
                  </Button>*/}
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
