import * as React from 'react';
const HistoryIcon = ({
  size = 24,
  strokeWidth = 1.5,
  width,
  height,
  color,
  ...props
}: {
  size?: number;
  strokeWidth?: number;
  width?: number;
  height?: number;
  color?: string;
}) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 15 15"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    color={color}
    {...props}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M8.754 2.05a.45.45 0 1 0 0 .9H9.95v4.1h-4.9v-4.1h1.204a.45.45 0 1 0 0-.9h-3.5a.45.45 0 1 0 0 .9H3.95v9.1H2.754a.45.45 0 0 0 0 .9h3.5a.45.45 0 0 0 0-.9H5.05v-4.1h4.9v4.1H8.754a.45.45 0 0 0 0 .9h3.5a.45.45 0 0 0 0-.9H11.05v-9.1h1.204a.45.45 0 0 0 0-.9z"
      fill="currentColor"
    />
  </svg>
);
export default HistoryIcon;
