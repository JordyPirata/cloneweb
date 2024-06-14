import React from "react";
export const CellPhone = ({ size, ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width={size || 24}
    height={size || 24}
    fill="currentColor"
  >
    <path d="M17 0H7C5.9 0 5 .9 5 2v20c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V2c0-1.1-.9-2-2-2zm0 22H7V2h10v20zM12 20c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1zm2-18H10v1h4V2z" />
  </svg>
);
