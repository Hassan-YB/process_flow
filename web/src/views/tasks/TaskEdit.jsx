import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Container, Card, Form, Button, Row, Col } from "react-bootstrap";
import Breadcrumb from "../../components/Breadcrumb/breadcrumb";
import '../dashboard/dashboard.css';
import { showSuccessToast, showErrorToast } from "../../utils/toastUtils";


const BASE_URL = process.env.REACT_APP_BASE_URL;
const TASK_API_URL = `${BASE_URL}/api/v1/tasks/`;
const token = localStorage.getItem("accessToken");

const TaskEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
    due_date: "",
    status: "pending",
    priority: "medium",
    attachments: [],
    del_attachments: [],
  });
  
  const [existingAttachments, setExistingAttachments] = useState([]);

  useEffect(() => {
    axios
      .get(`${TASK_API_URL}${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        const task = response.data;
        setTaskData({
          title: task.title || "",
          description: task.description || "",
          due_date: task.due_date || "",
          status: task.status || "pending",
          priority: task.priority || "medium",
          attachments: [],
          del_attachments: [],
        });
        setExistingAttachments(task.uploads || []);
      })
      .catch((error) => console.error("Error fetching task details:", error));
  }, [id]);

  const handleChange = (e) => {
    const { name, type, files, value } = e.target;

    if (type === "file") {
      setTaskData({
        ...taskData,
        attachments: [...taskData.attachments, ...Array.from(files)],
      });
    } else {
      setTaskData({
        ...taskData,
        [name]: value,
      });
    }
  };

  const handleMarkForDeletion = (attachmentId) => {
    setTaskData((prevData) => ({
      ...prevData,
      del_attachments: [...prevData.del_attachments, attachmentId],
    }));

    setExistingAttachments((prevAttachments) =>
      prevAttachments.filter((attachment) => attachment.id !== attachmentId)
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();

    Object.keys(taskData).forEach((key) => {
      if (key === "attachments") {
        taskData[key].forEach((file) => formDataToSend.append("attachments", file));
      } else if (key === "del_attachments") {
        taskData[key].forEach((id) => formDataToSend.append("del_attachments", id));
      } else {
        formDataToSend.append(key, taskData[key]);
      }
    });

    axios
      .put(`${TASK_API_URL}${id}/`, formDataToSend, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
      })
      .then(() => {
        showSuccessToast("Task updated successfully!");
        navigate(`/task/${id}`); 
      })
      .catch((error) => showErrorToast("Error updating task"));
  };

  return (
    <div className="container-fluid">
      <Breadcrumb pageName="Edit Task" />
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="shadow-lg p-4">
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Title</Form.Label>
                  <Form.Control name="title" type="text" value={taskData.title} onChange={handleChange} required />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Description</Form.Label>
                  <Form.Control as="textarea" rows={4} name="description" value={taskData.description} onChange={handleChange} required />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Due Date</Form.Label>
                  <Form.Control name="due_date" type="date" value={taskData.due_date} onChange={handleChange} required />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Status</Form.Label>
                  <Form.Select name="status" value={taskData.status} onChange={handleChange} required>
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Priority</Form.Label>
                  <Form.Select name="priority" value={taskData.priority} onChange={handleChange} required>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>New Attachments</Form.Label>
                  <Form.Control name="attachments" type="file" multiple onChange={handleChange} />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Existing Attachments</Form.Label>
                  <div className="d-flex flex-wrap">
                    {existingAttachments.map((attachment) => (
                      <div key={attachment.id} className="position-relative m-2">
                        <img src={attachment.file} alt="attachment" className="rounded" width="100" height="100" />
                        <button
                          type="button"
                          className="btn btn-dark bg-opacity-50 text-white btn-sm position-absolute top-0 end-0"
                          style={{ borderRadius: "50%", padding: "2px 8px" }}
                          onClick={() => handleMarkForDeletion(attachment.id)}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </Form.Group>

                <div className="d-flex justify-content-center">
                  <button type="submit" className="c-form-btn btn-block">Update Task</button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default TaskEdit;
