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
import { FaRegCalendarAlt } from "react-icons/fa";

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
    <div>
      <h1>{task.title}</h1>
      <p><strong>Description:</strong> {task.description}</p>
      <p><strong>Status:</strong> {task.status}</p>
      <p><strong>Completion Requested:</strong> {task.completion_requested ? "Yes" : "No"}</p>
    </div>
  );
};

export default TaskDetail;
