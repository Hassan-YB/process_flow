import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Container, Card, Form, Button, Row, Col } from "react-bootstrap";
import axios from "axios";
import { showSuccessToast, showErrorToast } from "../../utils/toastUtils";
import Breadcrumb from "../../components/Breadcrumb/breadcrumb";

const BASE_URL = process.env.REACT_APP_BASE_URL;
const TASK_API_URL = `${BASE_URL}/api/v1/tasks/`;
const token = localStorage.getItem("accessToken");

const CreateTask = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
  });

  const handleTaskChange = (e) => {
    setTaskData({ ...taskData, [e.target.name]: e.target.value });
  };

  const handleCreateTask = (e) => {
    e.preventDefault();

    if (!taskData.title.trim()) {
      showErrorToast("Task title is required.");
      return;
    }

    axios
      .post(
        TASK_API_URL,
        { ...taskData, project: projectId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(() => {
        showSuccessToast("Task created successfully!");
        navigate(`/project/${projectId}`); // Redirect back to project detail
      })
      .catch((error) => showErrorToast("Error creating task: " + error));
  };

  return (
    <Container>
      <Breadcrumb pageName="New Task" />
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="shadow-lg p-4">
            <Card.Body>
              <h2 className="mb-4 text-center">Create New Task</h2>
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

                <div className="d-flex justify-content-end">
                  <Button variant="secondary" className="me-2" onClick={() => window.history.back()}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary">
                    Create Task
                  </Button>
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
