import React, { useEffect, useState } from "react";
import axios from "axios";
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from "recharts";
import { Container, Row, Col, Button, Card } from "react-bootstrap";
import MainCard from "../../components/Card/MainCard";
import ProjectList from "../projects/ProjectsList";
import Breadcrumb from "../../components/Breadcrumb/breadcrumb";
import { showSuccessToast, showErrorToast } from "../../utils/toastUtils";
import { FaTasks, FaCheckCircle, FaClock, FaClipboardCheck } from "react-icons/fa";
import opentask from "../../assets/img/open_task.png"
import opentaskbg from "../../assets/img/open_tasks_bg.png"
import completetask from "../../assets/img/complete_task.png"
import completetasksbg from "../../assets/img/complete_tasks_bg.png"

const BASE_URL = process.env.REACT_APP_BASE_URL;
const API_URL = `${BASE_URL}/api/v1/projects/dashboard/`;

const Dashboard = () => {
  const [chartData, setChartData] = useState(null);
  const [selectedWeek, setSelectedWeek] = useState("thisWeek");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        const response = await axios.get(API_URL, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        const data = response.data;

        const projectsData = [
          { category: "Total Projects", value: data.total_projects },
          { category: "Completed Projects", value: data.completed_projects },
          { category: "In Progress Projects", value: data.in_progress_projects },
        ];

        const tasksData = [
          { category: "Total Tasks", value: data.total_tasks },
          { category: "Completed Tasks", value: data.completed_tasks },
          { category: "Pending Tasks", value: data.pending_tasks },
          { category: "Overdue Tasks", value: data.overdue_tasks },
        ];

        setChartData({ projects: projectsData, tasks: tasksData });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchData();
  }, []);

  if (!chartData) return <p>Loading...</p>;

  const cardData = [
    {
      title: "In Progress Projects",
      value: chartData.projects.find((item) => item.category === "In Progress Projects")?.value || 0,
      change: "+2",
      icon: <FaTasks size={30} color="purple" />,
    },
    {
      title: "Completed Projects",
      value: chartData.projects.find((item) => item.category === "Completed Projects")?.value || 0,
      change: "+5",
      icon: <FaCheckCircle size={30} color="purple" />,
    },
    {
      title: "Pending Tasks",
      value: chartData.tasks.find((item) => item.category === "Pending Tasks")?.value || 0,
      change: "+7",
      icon: <FaClock size={30} color="purple" />,
    },
    {
      title: "Completed Tasks",
      value: chartData.tasks.find((item) => item.category === "Completed Tasks")?.value || 0,
      change: "+15",
      icon: <FaClipboardCheck size={30} color="purple" />,
    },
  ];

  return (
    <div className="container-fluid">
      <Breadcrumb pageName="Dashboard" />

      <Row className="g-3">
        {cardData.map((card, index) => (
          <Col key={index} md={3}>
            <Card className="dashboard-shadow border-0 p-3">
              <Card.Body className="text-center">
                <div className="mb-2">{card.icon}</div>
                <h4 className="fw-bold mt-2">{card.title}</h4>
                <h4 className="fw-bold mt-2">{card.value}</h4>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Row className="mb-4 d-none">
        <Col>
          <Button
            variant={selectedWeek === "thisWeek" ? "primary" : "outline-primary"}
            onClick={() => setSelectedWeek("thisWeek")}
          >
            This Week
          </Button>
          <Button
            variant={selectedWeek === "lastWeek" ? "primary" : "outline-primary"}
            className="ms-2"
            onClick={() => setSelectedWeek("lastWeek")}
          >
            Last Week
          </Button>
        </Col>
      </Row>

      {/* Projects Chart */}
      <Row className="mt-4">
        <Col md={8}>
          <MainCard>
            <Row>
              <h5 className="mb-4">Projects Overview</h5>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData.projects}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E4E4E4" />
                  <XAxis dataKey="category" tick={{ fill: "#6f42c1" }} />
                  <YAxis tick={{ fill: "#6f42c1" }} allowDecimals={false} />
                  <Tooltip contentStyle={{ backgroundColor: "#fff", borderRadius: "10px", padding: "10px", boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)" }} />
                  <Legend />
                  <Line type="monotone" dataKey="value" stroke="#6f42c1" strokeWidth={3} dot={{ r: 5, fill: "#6f42c1" }} />
                </LineChart>
              </ResponsiveContainer>
            </Row>
          </MainCard>
        </Col>
        <Col md={4} className="mt-4">
          <Row className="mt-2">
            <Col md={12}>
              <Card className="task-card" style={{
                background: `url(${opentaskbg}) no-repeat center right`,
                backgroundColor: "#DEECED",
                backgroundSize: "contain",
                padding: "20px",
                borderRadius: "15px",
                border: "none",
                minHeight: "170px",
                maxHeight: "175px",
                boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)"
              }}>
                <div className="d-flex flex-column align-items-start">
                  <img src={opentask} alt="title" width="35" height="35" />
                  <span className="mt-2" style={{ fontSize: "14px", fontWeight: "500" }}>Open</span>
                  <span style={{ fontSize: "22px", fontWeight: "bold" }}>80</span>
                </div>
              </Card>
            </Col>
          </Row>
          <Row className="mt-4">
            <Col md={12}>
              <Card className="task-card" style={{
                background: `url(${completetasksbg}) no-repeat center right`,
                backgroundColor: "#DDD2FD",
                backgroundSize: "contain",
                padding: "20px",
                borderRadius: "15px",
                border: "none",
                minHeight: "170px",
                maxHeight: "175px",
                boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)"
              }}>
                <div className="d-flex flex-column align-items-start">
                  <img src={completetask} alt="title" width="35" height="35" />
                  <span className="mt-2" style={{ fontSize: "14px", fontWeight: "500" }}>Completed</span>
                  <span style={{ fontSize: "22px", fontWeight: "bold" }}>10</span>
                </div>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>

      {/* Tasks Chart */}
      <Row className="mt-5">
      <MainCard>
        <Row>
          <h5 className="mb-4">Tasks Overview</h5>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData.tasks}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E4E4E4" />
              <XAxis dataKey="category" tick={{ fill: "#6f42c1" }} />
              <YAxis tick={{ fill: "#6f42c1" }} allowDecimals={false} />
              <Tooltip contentStyle={{ backgroundColor: "#fff", borderRadius: "10px", padding: "10px", boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)" }} />
              <Legend />
              <Line type="monotone" dataKey="value" stroke="#6f42c1" strokeWidth={3} dot={{ r: 5, fill: "#6f42c1" }} />
            </LineChart>
          </ResponsiveContainer>
        </Row>
      </MainCard>
      </Row>

      <ProjectList />
    </div>
  );
};

export default Dashboard;
