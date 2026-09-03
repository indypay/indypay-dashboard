import * as React from 'react';
const ErrorIcon = ({
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
    id="error-toast"
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
  >
    <g id="Group_3127" data-name="Group 3127" transform="translate(-1486 931)">
      <circle
        id="Ellipse_66"
        data-name="Ellipse 66"
        cx="12"
        cy="12"
        r="12"
        transform="translate(1486 -931)"
        fill="#c11f1f"
      />
      <path
        id="Union_9"
        data-name="Union 9"
        d="M4,4,0,0,4,4,8,0,4,4,8,8,4,4,0,8Z"
        transform="translate(1494 -923)"
        fill="none"
        stroke="#fff"
        // strokeLinecap="round"
        // strokeLinejoin="round"
        strokeWidth={strokeWidth}
      />
    </g>
  </svg>
);
export default ErrorIcon;
