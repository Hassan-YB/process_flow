import React from 'react';
import axios from 'axios';

const BASE_URL = process.env.REACT_APP_BASE_URL;
const API_URL = `${BASE_URL}/api/v1/projects/`;
const token = localStorage.getItem("accessToken");

const DeleteProject = ({ id }) => {
  const handleDelete = () => {
    axios
      .delete(`${API_URL}${id}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => alert('Project deleted successfully!'))
      .catch((error) => console.error('Error deleting project:', error));
  };

  return (
    <button onClick={handleDelete}>Delete Project</button>
  );
};

export default DeleteProject;
