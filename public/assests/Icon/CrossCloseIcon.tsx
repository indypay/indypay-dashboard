import * as React from 'react';
const CrossCloseIcon = ({
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
  class?: string;
}) => (
  <svg
    id="cross-close"
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    viewBox="0 0 24 24"
  >
    <path d="M18.909,18.7a.854.854,0,0,0-.022-.992l-5.7-5.7,5.726-5.73a.845.845,0,0,0-.1-1.082.982.982,0,0,0-.115-.1.854.854,0,0,0-.993.022l-5.7,5.7L6.27,5.091a.847.847,0,0,0-1.082.1.923.923,0,0,0-.1.116.857.857,0,0,0,.022.993L10.817,12,5.091,17.73a.845.845,0,0,0,.1,1.082.99.99,0,0,0,.115.1.856.856,0,0,0,.993-.023l5.7-5.7,5.729,5.726a.849.849,0,0,0,1.083-.1.917.917,0,0,0,.1-.116" />
  </svg>
);
export default CrossCloseIcon;
