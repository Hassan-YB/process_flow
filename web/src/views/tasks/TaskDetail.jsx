import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Container, Card, Form, Button, Row, Col, Table } from "react-bootstrap";
import axios from "axios";
import Breadcrumb from "../../components/Breadcrumb/breadcrumb";
import { showSuccessToast, showErrorToast } from "../../utils/toastUtils";
import MainCard from "../../components/Card/MainCard";
import { Doughnut } from "react-chartjs-2"; // Import the Doughnut chart
import Chart from "chart.js/auto";
import opentask from "../../assets/img/open_task.png"
import opentaskbg from "../../assets/img/open_tasks_bg.png"
import completetask from "../../assets/img/complete_task.png"
import completetasksbg from "../../assets/img/complete_tasks_bg.png"
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
    return <p>Loading task details...</p>;
  }

  return (
    <div className="container-fluid">
      <Breadcrumb pageName="Task Detail" />
      <MainCard>
        <Row className="align-items-center">
          {/* Project Logo */}
          <Col xs={2} className="d-flex justify-content-center flex-column flex-sm-row">
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
          <Col xs={10}>
            <div className="d-flex flex-column justify-content-between">
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
                <FaCheckCircle className="me-1" /><strong>Status:</strong> {task.status}
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
