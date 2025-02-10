import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Modal, Card, Button, Row, Col, Table, Carousel } from "react-bootstrap";
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
import { FaRegCalendarAlt, FaCheckCircle } from "react-icons/fa";
import TaskPriorityBadge from "../../components/Badge/badge"
import '../dashboard/dashboard.css';

const BASE_URL = process.env.REACT_APP_BASE_URL;
const PROJECT_API_URL = `${BASE_URL}/api/v1/projects/`;
const token = localStorage.getItem("accessToken");

const ProjectDetail = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState(null);

  useEffect(() => {
    fetchProjectDetails();
  }, [id]);

  const fetchProjectDetails = () => {
    axios
      .get(`${PROJECT_API_URL}${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => setProject(response.data))
      .catch((error) => console.error("Error fetching project details:", error));
  };

  const handleDeleteTask = (taskId) => {
    setSelectedTaskId(taskId);
    setShowDeleteModal(true);
  };

  const confirmDeleteTask = () => {
    if (!selectedTaskId) return;

    axios
      .delete(`${BASE_URL}/api/v1/tasks/${selectedTaskId}/`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        showSuccessToast("Task deleted successfully!");
        setProject((prevProject) => ({
          ...prevProject,
          tasks: prevProject.tasks.filter((task) => task.id !== selectedTaskId),
        }));
      })
      .catch((error) => showErrorToast("Error deleting task: " + error))
      .finally(() => {
        setShowDeleteModal(false);
        setSelectedTaskId(null);
      });
  };

  // Prepare data for the ring chart
  const getTaskCounts = () => {
    const pending = project.tasks.filter((task) => task.status === "pending").length;
    const inProgress = project.tasks.filter((task) => task.status === "in progress").length;
    const completed = project.tasks.filter((task) => task.status === "completed").length;
    const overdue = project.tasks.filter((task) => task.status === "overdue").length;
    return { pending, inProgress, completed, overdue };
  };

  const taskCounts = project ? getTaskCounts() : { pending: 0, inProgress: 0, completed: 0, overdue: 0 };

  // Chart Data
  const data = {
    labels: ["Pending", "In Progress", "Completed", "Overdue"],
    datasets: [
      {
        data: [taskCounts.pending, taskCounts.inProgress, taskCounts.completed, taskCounts.overdue],
        backgroundColor: ["#6149cd", "#800080", "#deeced", "#5a0096"],
        borderWidth: 0,
      },
    ],
  };

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
      <Breadcrumb pageName="Project Detail" />
      <div className="d-flex justify-content-between align-items-center mt-4">
        <h3>Project Detail</h3>
        <span>
          <Link to={`/task/create/${id}`}>
            <button type="submit" className="c-btn btn-block mb-4">+ New Task</button>
          </Link>
          <Link to={`/project/${id}/update`} className="ms-2">
            <button type="submit" className="c-btn btn-block mb-4">+ Edit Project</button>
          </Link>
        </span>
      </div>


      {project ? (
        <>
          <MainCard>
            <Row className="align-items-center flex-column flex-sm-row">
              {/* Project Logo */}
              <Col xs={12} md={2} className="d-flex align-items-center justify-content-center">
                {project.uploads.length > 0 ? (
                  <Carousel interval={7000} pause="hover">
                    {project.uploads.map((upload) => (
                      <Carousel.Item key={upload.id}>
                        <img
                          src={upload.file}
                          alt={`Project Image ${upload.id}`}
                          width="100%"
                          height="300"
                          className="rounded"
                        />
                      </Carousel.Item>
                    ))}
                  </Carousel>
                ) : (
                  <img src={opentask} alt="Default Project Logo" width="150" height="150" />
                )}
              </Col>

              {/* Project Info */}
              <Col xs={12} md={10}>
                <div className="d-flex flex-column flex-sm-row justify-content-between">
                  <span className="mt-2">
                    <h4 className="fw-bold mb-1">{project.title}</h4>
                  </span>
                  <span className="mt-2">
                    <TaskPriorityBadge priority={project.priority} />
                  </span>
                </div>
                <div className="d-flex align-items-center text-muted" style={{ fontSize: "14px" }}>
                  <span className="mt-3">
                    <FaRegCalendarAlt className="me-1" /> {project.start_date} - {project.end_date}
                  </span>
                  <span className="mt-3 ms-3">
                    <FaCheckCircle className="me-1" /> {formatStatus(project.status)}
                  </span>
                </div>
              </Col>
            </Row>
          </MainCard>

          <Row className="mt-4">
            <Col md={8}>
              <MainCard>
                <div style={{ height: "250px", }}>
                  <Doughnut data={data} options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    cutout: "70%",
                  }} />
                </div>
              </MainCard>
            </Col>
            <Col md={4}>
              <Row className="mt-4">
                <Col md={12}>
                  <Card className="task-card" style={{
                    background: `url(${opentaskbg}) no-repeat center right`,
                    backgroundColor: "#DEECED",
                    backgroundSize: "contain",
                    padding: "20px",
                    borderRadius: "15px",
                    border: "none",
                    boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)"
                  }}>
                    <div className="d-flex flex-column align-items-start">
                      <img src={opentask} alt="title" width="35" height="35" />
                      <span className="mt-2" style={{ fontSize: "14px", fontWeight: "500" }}>Open</span>
                      <span style={{ fontSize: "22px", fontWeight: "bold" }}>{project.in_progress_tasks_count}</span>
                    </div>
                  </Card>
                </Col>
              </Row>
              <Row className="mt-2">
                <Col md={12}>
                  <Card className="task-card" style={{
                    background: `url(${completetasksbg}) no-repeat center right`,
                    backgroundColor: "#DDD2FD",
                    backgroundSize: "contain",
                    padding: "20px",
                    borderRadius: "15px",
                    border: "none",
                    boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)"
                  }}>
                    <div className="d-flex flex-column align-items-start">
                      <img src={completetask} alt="title" width="35" height="35" />
                      <span className="mt-2" style={{ fontSize: "14px", fontWeight: "500" }}>Completed</span>
                      <span style={{ fontSize: "22px", fontWeight: "bold" }}>{project.completed_tasks_count}</span>
                    </div>
                  </Card>
                </Col>
              </Row>
            </Col>
          </Row>

          <h2 className="mt-5">Tasks</h2>
          <MainCard>
            {project.tasks.length > 0 ? (
              <div className="table-responsive">
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Title</th>
                      <th>Description</th>
                      <th>Priority</th>
                      <th>Status</th>
                      <th>Due Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {project.tasks.map((task) => (
                      <tr key={task.id}>
                        <td>{task.id}</td>
                        <td>
                          <Link
                            to={`/task/${task.id}`}
                            style={{ textDecoration: "none", fontWeight: "bold" }}
                          >
                            {task.title}
                          </Link>
                        </td>
                        <td>{task.description}</td>
                        <td><TaskPriorityBadge priority={task.priority} /></td>
                        <td>{formatStatus(task.status)}</td>
                        <td>{task.due_date}</td>
                        <td>
                          <Link to={`/task/edit/${task.id}`}>
                            <button type="submit" className="c-btn btn-block me-2">Edit</button>
                          </Link>
                          <button type="submit" className="c-btn btn-block" onClick={() => handleDeleteTask(task.id)}>
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            ) : (
              <p>No tasks available for this project.</p>
            )}
          </MainCard>

          {/* Confirmation Modal */}
          <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
            <Modal.Header closeButton>
              <Modal.Title>Confirm Task Deletion</Modal.Title>
            </Modal.Header>
            <Modal.Body>Are you sure you want to delete this task? This action cannot be undone.</Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" style={{ background: '#fff', color: '#9860DA', border: '2px solid #9860DA' }}
                onClick={() => setShowDeleteModal(false)}>Cancel</Button>
              <Button variant="danger" style={{ background: '#9860DA', color: '#fff' }}
                onClick={confirmDeleteTask}>Delete</Button>
            </Modal.Footer>
          </Modal>
        </>
      ) : (
        <p>No project found.</p>
      )}
    </div>
  );
};

export default ProjectDetail;
