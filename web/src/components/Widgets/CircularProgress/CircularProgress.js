import React from "react";

const CircularProgress = ({ percentage, color }) => {
  const radius = 30; // Circle size
  const strokeWidth = 5;
  const circumference = 2 * Math.PI * radius;
  const progress = (percentage / 100) * circumference;

  return (
    <svg width="80" height="80" viewBox="0 0 80 80">
      {/* Background Circle */}
      <circle
        cx="40"
        cy="40"
        r={radius}
        fill="none"
        stroke="#e6e6e6"
        strokeWidth={strokeWidth}
      />
      
      {/* Progress Circle */}
      <circle
        cx="40"
        cy="40"
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={circumference - progress}
        strokeLinecap="round"
        transform="rotate(-90 40 40)" // Rotates from top
      />
      
      {/* Text (Percentage) */}
      <text x="50%" y="50%" textAnchor="middle" dy="5px" fontSize="16px" fill="#333">
        {percentage}%
      </text>
    </svg>
  );
};

export default CircularProgress;
