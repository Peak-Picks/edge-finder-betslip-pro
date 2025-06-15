
import React from "react";

const WizPicksLogo: React.FC<{ className?: string }> = ({ className = "" }) => (
  <svg
    className={className}
    width="40"
    height="40"
    viewBox="0 0 40 40"
    fill="none"
    aria-label="WizPicks Logo"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="20" cy="20" r="19" fill="url(#bg-gradient)" stroke="#10B981" strokeWidth="2"/>
    <path
      d="M13 27L20 11L27 27M16.5 21H23.5"
      stroke="#fff"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="20" cy="30" r="2" fill="#10B981"/>
    <defs>
      <linearGradient id="bg-gradient" x1="6" y1="6" x2="34" y2="34" gradientUnits="userSpaceOnUse">
        <stop stopColor="#10B981"/>
        <stop offset="1" stopColor="#06B6D4"/>
      </linearGradient>
    </defs>
  </svg>
);

export default WizPicksLogo;
