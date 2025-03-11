import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Form, Button, Container, Card, Row, Col } from "react-bootstrap";
import axios from "axios";
import { showSuccessToast, showErrorToast } from "../../utils/toastUtils";
import Breadcrumb from "../../components/Breadcrumb/breadcrumb";
import '../dashboard/dashboard.css';

const BASE_URL = process.env.REACT_APP_BASE_URL;
const API_URL = `${BASE_URL}/api/v1/projects/`;

const UpdateProject = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    start_date: "",
    end_date: "",
    status: "in_progress",
    priority: "medium",
    attachments: [],
    del_attachments: [], // Store attachments to delete
  });

  const [existingAttachments, setExistingAttachments] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    axios
      .get(`${API_URL}${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        const project = response.data;
        setFormData({
          title: project.title || "",
          start_date: project.start_date || "",
          end_date: project.end_date || "",
          status: project.status || "in_progress",
          priority: project.priority || "medium",
          attachments: [],
          del_attachments: [],
        });
        setExistingAttachments(project.uploads || []);
      })
      .catch((error) => console.error("Error fetching project details:", error));
  }, [id]);

  const handleChange = (e) => {
    const { name, type, files, value } = e.target;

    if (type === "file") {
      setFormData({
        ...formData,
        attachments: [...formData.attachments, ...Array.from(files)],
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

  const handleStatusChange = (status) => {
    const formattedStatus = status.toLowerCase().replace(" ", "_");
    setFormData({ ...formData, status: formattedStatus });
  };  

  const handleMarkForDeletion = (attachmentId) => {
    setFormData((prevData) => ({
      ...prevData,
      del_attachments: [...prevData.del_attachments, attachmentId],
    }));

    // Remove from UI immediately
    setExistingAttachments((prevAttachments) =>
      prevAttachments.filter((attachment) => attachment.id !== attachmentId)
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    const token = localStorage.getItem("accessToken");

    Object.keys(formData).forEach((key) => {
      if (key === "attachments") {
        formData[key].forEach((file) => formDataToSend.append("attachments", file));
      } else if (key === "del_attachments") {
        formData[key].forEach((id) => formDataToSend.append("del_attachments", id));
      } else {
        formDataToSend.append(key, formData[key]);
      }
    });

    axios
      .put(`${API_URL}${id}/`, formDataToSend, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
      })
      .then(() => {
        showSuccessToast("Project updated successfully!");
        navigate("/projects");
      })
      .catch((error) => showErrorToast("Error updating project"));
  };

  return (
    <div className="container-fluid">
      <Breadcrumb pageName="Edit Project" />
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="shadow-lg p-4">
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Title</Form.Label>
                  <Form.Control
                    name="title"
                    type="text"
                    value={formData.title}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Row>
                  <Col>
                    <Form.Group className="mb-3">
                      <Form.Label>Start Date</Form.Label>
                      <Form.Control
                        name="start_date"
                        type="date"
                        value={formData.start_date}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group className="mb-3">
                      <Form.Label>End Date</Form.Label>
                      <Form.Control
                        name="end_date"
                        type="date"
                        value={formData.end_date}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>Status</Form.Label>
                  <div className="d-flex">
                    {["In Progress", "Completed"].map((status) => (
                      <Button
                        key={status}
                        className={`me-2 ${formData.status === status.toLowerCase().replace(" ", "_") ? "priority-c-2" : "priority-c-1"}`}
                        onClick={() => handleStatusChange(status)}
                      >
                        {status}
                      </Button>
                    ))}
                  </div>
                </Form.Group>

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
                  <Form.Label>New Attachments</Form.Label>
                  <Form.Control name="attachments" type="file" multiple onChange={handleChange} />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Existing Attachments</Form.Label>
                  <div className="d-flex flex-wrap">
                    {existingAttachments.map((attachment) => (
                      <div key={attachment.id} className="position-relative m-2">
                        <img
                          src={attachment.file}
                          alt="attachment"
                          className="rounded"
                          width="100"
                          height="100"
                        />
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
                  <button type="submit" className="c-form-btn btn-block">Update Project</button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      </div>
  );
};

export default UpdateProject;