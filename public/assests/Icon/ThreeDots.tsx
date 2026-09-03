import React from 'react';
export const ThreeDotsIcon = ({
  size = 24,
  strokeWidth = 1.5,
  width,
  height,
  ...props
}: {
  size?: number;
  strokeWidth?: number;
  width?: number;
  height?: number;
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="50"
    height="40"
    viewBox="0 0 256 256"
    {...props}
  >
    <path d="M72 128a8 8 0 1 1-8-8 8.01 8.01 0 0 1 8 8m120-8a8 8 0 1 0 8 8 8.01 8.01 0 0 0-8-8m-64 0a8 8 0 1 0 8 8 8.01 8.01 0 0 0-8-8" />
  </svg>
);
