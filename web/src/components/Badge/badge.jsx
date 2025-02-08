import React from "react";

const getPriorityStyle = (priority) => {
  switch (priority) {
    case "low":
      return { backgroundColor: "#d6b4fc", color: "#6c1ea0" }; // Purple
    case "medium":
      return { backgroundColor: "#ffe599", color: "#b8860b" }; // Yellow
    case "high":
      return { backgroundColor: "#ffcccc", color: "#d9534f" }; // Red
    default:
      return { backgroundColor: "#f1f1f1", color: "#333" }; // Default Gray
  }
};

const TaskPriorityBadge = ({ priority }) => {
  return (
    <span
      className="badge px-3 py-2"
      style={{
        ...getPriorityStyle(priority),
        borderRadius: "20px",
        fontWeight: "bold",
        fontSize: "14px",
      }}
    >
      {priority.toUpperCase()}
    </span>
  );
};

export default TaskPriorityBadge;
