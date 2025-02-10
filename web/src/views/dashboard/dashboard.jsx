import React, { useEffect, useState } from "react";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from "recharts";
import { Spinner, Container, Row, Col, Button, Card } from "react-bootstrap";
import MainCard from "../../components/Card/MainCard";
import ProjectList from "../projects/ProjectsList";
import DashboardBreadcrumb from "../../components/Breadcrumb/breadcrumb";
import { FaTasks, FaCheckCircle, FaClock, FaClipboardCheck } from "react-icons/fa";
import opentaskbg from "../../assets/img/open_tasks_bg.png"
import completetasksbg from "../../assets/img/complete_tasks_bg.png"
import CircularProgress from "../../components/Widgets/CircularProgress/CircularProgress"

const BASE_URL = process.env.REACT_APP_BASE_URL;
const API_URL = `${BASE_URL}/api/v1/projects/dashboard/`;

const Dashboard = () => {
  const [chartData, setChartData] = useState(null);
  const [selectedWeek, setSelectedWeek] = useState("thisWeek");
  const [dashboardData, setDashboardData] = useState(null);

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
        setDashboardData(data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchData();
  }, []);

  if (!chartData) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
        <Spinner animation="border" variant="primary" size="lg" />
      </div>
    );
  }

  const { completed_tasks, total_tasks, completed_projects, total_projects } = dashboardData;

  const taskCompletionPercentage = total_tasks > 0
    ? Math.round((completed_tasks / total_tasks) * 100)
    : 0;

  const projectCompletionPercentage = total_projects > 0
    ? Math.round((completed_projects / total_projects) * 100)
    : 0;


  const cardData = [
    {
      title: "In Progress Projects",
      value: chartData.projects.find((item) => item.category === "In Progress Projects")?.value || 0,
      change: "+2",
      icon: <FaTasks size={30} color="#a445b2" />,
    },
    {
      title: "Completed Projects",
      value: chartData.projects.find((item) => item.category === "Completed Projects")?.value || 0,
      change: "+5",
      icon: <FaCheckCircle size={30} color="#a445b2" />,
    },
    {
      title: "Pending Tasks",
      value: chartData.tasks.find((item) => item.category === "Pending Tasks")?.value || 0,
      change: "+7",
      icon: <FaClock size={30} color="#a445b2" />,
    },
    {
      title: "Completed Tasks",
      value: chartData.tasks.find((item) => item.category === "Completed Tasks")?.value || 0,
      change: "+15",
      icon: <FaClipboardCheck size={30} color="#a445b2" />,
    },
  ];

  return (
    <div className="container-fluid">
      <DashboardBreadcrumb pageName="Dashboard" />

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
            <h5 className="mb-4">Projects Overview</h5>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData?.projects}>
                <defs>
                  <linearGradient id="barGradientVertical" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6f42c1" />
                    <stop offset="100%" stopColor="#a445b2" />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E4E4E4" />
                <XAxis dataKey="category" tick={{ fill: "#6f42c1" }} />
                <YAxis tick={{ fill: "#6f42c1" }} allowDecimals={false} />
                <Tooltip contentStyle={{ backgroundColor: "#fff", borderRadius: "10px", padding: "10px", boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)" }} />
                <Legend />
                <Bar dataKey="value" fill="url(#barGradientVertical)" barSize={50} />
              </BarChart>
            </ResponsiveContainer>
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
                  <CircularProgress percentage={taskCompletionPercentage} color="#7D5EF2" />
                  <span className="mt-2" style={{ fontSize: "14px", fontWeight: "500" }}>Tasks Completed</span>
                  <span style={{ fontSize: "22px", fontWeight: "bold" }}>{taskCompletionPercentage}% </span>
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
                  <CircularProgress percentage={projectCompletionPercentage} color="#17A673" />
                  <span className="mt-2" style={{ fontSize: "14px", fontWeight: "500" }}>Projects Completed</span>
                  <span style={{ fontSize: "22px", fontWeight: "bold" }}>{projectCompletionPercentage}% </span>
                </div>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>

      {/* Tasks Chart */}
      <Row className="mt-5">
        <MainCard>
          <h5 className="mb-4">Tasks Overview</h5>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData?.tasks}>
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#6f42c1" />
                  <stop offset="100%" stopColor="#a445b2" />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E4E4E4" />
              <XAxis dataKey="category" tick={{ fill: "#6f42c1" }} />
              <YAxis tick={{ fill: "#6f42c1" }} allowDecimals={false} />
              <Tooltip contentStyle={{ backgroundColor: "#fff", borderRadius: "10px", padding: "10px", boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)" }} />
              <Legend />
              <Bar dataKey="value" fill="url(#barGradient)" barSize={50} />
            </BarChart>
          </ResponsiveContainer>
        </MainCard>

      </Row>

      <ProjectList />
    </div>
  );
};

export default Dashboard;
