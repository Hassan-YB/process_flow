import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Container, Card, Form, Button, Row, Col } from "react-bootstrap";
import Breadcrumb from "../../components/Breadcrumb/breadcrumb";

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

  const handleUpdateTask = () => {
    axios
      .put(`${TASK_API_URL}${id}/`, taskData, {
        headers: {
          Authorization: `Bearer ${token}`,
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
      <Breadcrumb pageName="Edit Task" />
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="shadow-lg p-4">
            <Card.Body>
              <h2 className="mb-4 text-center">Edit Task</h2>
              <Form>
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

                <Form.Group className="mb-4">
                  <Form.Label>Status</Form.Label>
                  <Form.Select name="status" value={taskData.status} onChange={handleChange}>
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                  </Form.Select>
                </Form.Group>

                <div className="d-flex justify-content-between">
                  <Button variant="secondary" onClick={() => navigate(-1)}>
                    Cancel
                  </Button>
                  <Button variant="primary" onClick={handleUpdateTask}>
                    Update Task
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

export default TaskEdit;
