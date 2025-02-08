import React, { useState, useEffect } from "react";
import { Button, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import axios from "axios";
import Breadcrumb from "../../components/Breadcrumb/breadcrumb";
import { showSuccessToast, showErrorToast } from "../../utils/toastUtils";
import MainCard from "../../components/Card/MainCard";
import '../dashboard/dashboard.css';

const BASE_URL = process.env.REACT_APP_BASE_URL;
const API_URL = `${BASE_URL}/api/v1/projects/`;
const token = localStorage.getItem("accessToken");

const ProjectList = () => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = () => {
    axios
      .get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => setProjects(response.data.results))
      .catch((error) => console.error("Error fetching projects:", error));
  };

  const handleDelete = (id) => {
    axios
      .delete(`${API_URL}${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        showSuccessToast("Project deleted successfully!");
        fetchProjects();
      })
      .catch((error) => showErrorToast("Error deleting project: " + error));
  };

  return (
    <div className="mt-5">
      {/*<Breadcrumb pageName="Projects" />*/}
      <div className="d-flex justify-content-between align-items-center mt-4">
        <h3>Projects</h3>
        <Link to="/project/create">
          <button type="submit" className="c-btn btn-block">+ New Project</button>
        </Link>
      </div>

      <MainCard>
        <Table bordered hover className="mt-4">
          <thead>
            <tr>
              <th>Title</th>
              <th>Status</th>
              <th>Priority</th>
              <th>Attachments</th>
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
                <td>{project.status}</td>
                <td>{project.priority}</td>
                <td>
                  {project.uploads && project.uploads.length > 0 ? (
                    <a
                      href={project.uploads[0].File}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View Attachment
                    </a>
                  ) : (
                    "No Attachments"
                  )}
                </td>
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
      </MainCard>
    </div>
  );
};

export default ProjectList;
