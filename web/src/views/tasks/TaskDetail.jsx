import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Row, Col, Spinner } from "react-bootstrap";
import axios from "axios";
import Breadcrumb from "../../components/Breadcrumb/breadcrumb";
import MainCard from "../../components/Card/MainCard";
import opentask from "../../assets/img/open_task.png"
import { FaRegCalendarAlt, FaClipboardList, FaExclamationCircle, FaCheckCircle, FaRegCalendarCheck } from "react-icons/fa";
import TaskPriorityBadge from "../../components/Badge/badge"

const BASE_URL = process.env.REACT_APP_BASE_URL;
const TASK_API_URL = `${BASE_URL}/api/v1/tasks/`;
const token = localStorage.getItem("accessToken");

const TaskDetail = () => {
  const { id } = useParams();
  const [task, setTask] = useState(null);

  useEffect(() => {
    axios
      .get(`${TASK_API_URL}${id}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => setTask(response.data))
      .catch((error) => console.error("Error fetching task details:", error));
  }, [id]);

  if (!task) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
        <Spinner animation="border" variant="primary" size="lg" />
      </div>
    );
  }

  const formatStatus = (status) => {
    switch (status) {
      case "in_progress":
        return "In Progress";
      case "completed":
        return "Completed";
      case "pending":
        return "Pending";
      default:
        return status;
    }
  };

  return (
    <div className="container-fluid">
      <Breadcrumb pageName="Task Detail" />
      <div className="d-flex justify-content-between align-items-center mt-4">
        <h3>Task Detail</h3>
        <Link to={`/task/edit/${task.id}`}>
          <button type="submit" className="c-btn btn-block mb-4">+ Edit Task</button>
        </Link>
      </div>
      <MainCard>
        <Row className="align-items-center flex-column flex-sm-row">
          {/* Project Logo */}
          <Col xs={12} md={2} className="d-flex justify-content-center">
            {task.uploads.length > 0 ? (
              task.uploads[0].file.match(/\.(jpeg|jpg|gif|png|svg)$/i) ? (
                <img
                  src={task.uploads[0].file}
                  alt="Task Attachment"
                  width="150"
                  height="150"
                  className="rounded"
                />
              ) : (
                <a href={task.uploads[0].file} target="_blank" rel="noopener noreferrer">
                  📎 Attachment
                </a>
              )
            ) : (
              <img src={opentask} alt="Default Task Logo" width="150" height="150" />
            )}

          </Col>

          {/* Project Info */}
          <Col xs={12} md={10}>
            <div className="d-flex flex-column flex-sm-row justify-content-between">
              <span className="mt-2">
                <h4 className="fw-bold mb-1">{task.title}</h4>
              </span>
              <span className="mt-2">
                <TaskPriorityBadge priority={task.priority} />
              </span>
            </div>
            <div className="d-flex flex-column" style={{ fontSize: "18px" }}>
              <span className="mt-2">
                <FaClipboardList className="me-1" />{task.description}
              </span>
              <span className="mt-2">
                <FaCheckCircle className="me-1" /><strong>Status:</strong> {formatStatus(task.status)}
              </span>
              <span className="mt-2">
                <FaExclamationCircle className="me-1" /><strong>Priority:</strong> {task.priority}
              </span>
              <span className="mt-2">
                <FaRegCalendarAlt className="me-1" /><strong>Completion Requested:</strong> {task.completion_requested ? "Yes" : "No"}
              </span>
              <span className="mt-2">
                <FaRegCalendarCheck className="me-1" /><strong>Due Date:</strong> {task.due_date}
              </span>

            </div>
          </Col>
        </Row>
      </MainCard>
    </div>
  );
};

export default TaskDetail;
