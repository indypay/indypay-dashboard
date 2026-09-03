import * as React from 'react';
const SuccessIcon = ({
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
    id="success-toast"
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
  >
    <g id="Group_1981" data-name="Group 1981" transform="translate(0 0)">
      <circle
        id="Ellipse_66"
        data-name="Ellipse 66"
        cx="12"
        cy="12"
        r="12"
        transform="translate(0 0)"
        fill="#29b170"
      />
      <path
        id="Path_8817"
        data-name="Path 8817"
        d="M1504.634-1096.558l2.981,2.972,6.019-6"
        transform="translate(-1496.634 1108.586)"
        fill="none"
        stroke="#fff"
        // strokeLinecap="round"
        // strokeLinejoin="round"
        strokeWidth={strokeWidth}
      />
    </g>
  </svg>
);
export default SuccessIcon;
