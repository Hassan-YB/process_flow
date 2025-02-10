import React, { useState, useEffect } from "react";
import { Modal, Button, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import axios from "axios";
import Breadcrumb from "../../components/Breadcrumb/breadcrumb";
import { showSuccessToast, showErrorToast } from "../../utils/toastUtils";
import MainCard from "../../components/Card/MainCard";
import TaskPriorityBadge from "../../components/Badge/badge"
import '../dashboard/dashboard.css';

const BASE_URL = process.env.REACT_APP_BASE_URL;
const API_URL = `${BASE_URL}/api/v1/projects/`;
const token = localStorage.getItem("accessToken");

const ProjectList = () => {
  const [projects, setProjects] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState(null);


  useEffect(() => {
    fetchProjects(currentPage);
  }, [currentPage]);

  const fetchProjects = (page) => {
    axios
      .get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
        params: { page: page }, // Send page number in request
      })

      .then((response) => {
        setProjects(response.data.results);
        setTotalPages(response.data.total_pages);
      })
      .catch((error) => console.error("Error fetching projects"));
  };

  const handleDelete = (id) => {
    setSelectedProjectId(id);
    setShowDeleteModal(true);
  };

  const confirmDeleteProject = () => {
    if (!selectedProjectId) return;

    axios
      .delete(`${API_URL}${selectedProjectId}/`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        showSuccessToast("Project deleted successfully!");
        fetchProjects(currentPage);
      })
      .catch((error) => showErrorToast("Error deleting project"))
      .finally(() => {
        setShowDeleteModal(false);
        setSelectedProjectId(null);
      });
  };

  // Function to format status
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

  // Function to format priority
  const formatPriority = (priority) => {
    switch (priority) {
      case "low":
        return "Low";
      case "medium":
        return "Medium";
      case "high":
        return "High";
      default:
        return priority;
    }
  };

  return (
    <div className="mt-5">
      <div className="d-flex justify-content-between align-items-center mt-4">
        <h3>Projects</h3>
        <Link to="/project/create">
          <button type="submit" className="c-btn btn-block">+ New Project</button>
        </Link>
      </div>

      <MainCard>
        <div className="table-responsive">
          <Table bordered hover className="mt-4">
            <thead>
              <tr>
                <th>Title</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => (
                <tr key={project.id}>
                  <td>
                    <Link
                      to={`/project/${project.id}`}
                      style={{ textDecoration: "none", fontWeight: "bold" }}
                    >
                      {project.title}
                    </Link>
                  </td>
                  <td>{project.start_date}</td>
                  <td>{project.end_date}</td>
                  <td>{formatStatus(project.status)}</td>
                  <td><TaskPriorityBadge priority={project.priority} /></td>
                  <td>
                    <Link to={`/project/${project.id}/update`}>
                      <button type="submit" className="c-btn btn-block me-2">
                        Edit
                      </button>
                    </Link>
                    <button type="submit" className="c-btn btn-block" onClick={() => handleDelete(project.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </MainCard>
      {/* Pagination Controls */}
      <div className="d-flex justify-content-center mt-4">
        <button
          className="c-btn me-2"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
        >
          Previous
        </button>
        <span> Page {currentPage} of {totalPages} </span>
        <button
          className="c-btn ms-2"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
        >
          Next
        </button>
      </div>

      {/* Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Project Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this project? This action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" style={{ background: '#fff', color: '#9860DA', border: '2px solid #9860DA' }}
            onClick={() => setShowDeleteModal(false)}>Cancel</Button>
          <Button variant="danger" style={{ background: '#9860DA', color: '#fff' }}
            onClick={confirmDeleteProject}>Delete</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ProjectList;
