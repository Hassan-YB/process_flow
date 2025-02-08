import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Container, Card, Form, Button, Row, Col } from "react-bootstrap";
import Breadcrumb from "../../components/Breadcrumb/breadcrumb";
import '../dashboard/dashboard.css';


const BASE_URL = process.env.REACT_APP_BASE_URL;
const TASK_API_URL = `${BASE_URL}/api/v1/tasks/`;
const token = localStorage.getItem("accessToken");

const TaskEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
    status: "pending",
    due_date: "",
    priority: "low",
    uploads: null, // For file upload
  });

  useEffect(() => {
    axios
      .get(`${TASK_API_URL}${id}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => setTaskData(response.data))
      .catch((error) => console.error("Error fetching task details:", error));
  }, [id]);

  const handleChange = (e) => {
    setTaskData({ ...taskData, [e.target.name]: e.target.value });
  };

  const handlePriorityChange = (priority) => {
    setTaskData({ ...taskData, priority: priority.toLowerCase() });
  };

  const handleFileChange = (e) => {
    setTaskData({ ...taskData, uploads: e.target.files[0] });
  };

  const handleUpdateTask = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", taskData.title);
    formData.append("description", taskData.description);
    formData.append("status", taskData.status);
    formData.append("due_date", taskData.due_date);
    formData.append("priority", taskData.priority);
    if (taskData.uploads) {
      formData.append("uploads", taskData.uploads);
    }

    axios
      .put(`${TASK_API_URL}${id}/`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .then(() => {
        alert("Task updated successfully!");
        navigate(`/task/${id}`); // Redirect to Task Detail Page
      })
      .catch((error) => console.error("Error updating task:", error));
  };

  return (
    <Container>
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="shadow-lg p-4">
            <Card.Body>
              <h2 className="mb-4 text-center">Edit Task</h2>
              <Form onSubmit={handleUpdateTask}>
                <Form.Group className="mb-3">
                  <Form.Label>Title</Form.Label>
                  <Form.Control
                    type="text"
                    name="title"
                    placeholder="Enter task title"
                    value={taskData.title}
                    onChange={handleChange}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    name="description"
                    placeholder="Enter task description"
                    value={taskData.description}
                    onChange={handleChange}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Due Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="due_date"
                    value={taskData.due_date}
                    onChange={handleChange}
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

                <Form.Group className="mb-4">
                  <Form.Label>Status</Form.Label>
                  <Form.Select name="status" value={taskData.status} onChange={handleChange}>
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Upload File</Form.Label>
                  <Form.Control type="file" name="uploads" onChange={handleFileChange} />
                </Form.Group>

                <div className="d-flex justify-content-center">
                <button type="submit" className="c-form-btn btn-block">
                    Update Task
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

export default TaskEdit;