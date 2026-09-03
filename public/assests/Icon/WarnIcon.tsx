import * as React from 'react';
const WarnIcon = ({
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
    id="warn-toast"
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
  >
    <g id="Group_3123" data-name="Group 3123" transform="translate(-1486 931)">
      <circle
        id="Ellipse_66"
        data-name="Ellipse 66"
        cx="12"
        cy="12"
        r="12"
        transform="translate(1486 -931)"
        fill="#bf7332"
      />
      <g id="exclamation" transform="translate(1480.746 -933.992)">
        <path
          id="Path_8820"
          data-name="Path 8820"
          d="M15.755,19.492a1.5,1.5,0,1,1,1.5,1.5A1.5,1.5,0,0,1,15.755,19.492Zm.147-9a1.357,1.357,0,1,1,2.7,0l-.524,5.258a.828.828,0,0,1-1.649,0Z"
          transform="translate(0 0)"
          fill="#fff"
        />
      </g>
    </g>
  </svg>
);
export default WarnIcon;
