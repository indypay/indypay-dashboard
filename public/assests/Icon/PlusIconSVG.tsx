import React from 'react';

const PlusIcon = ({
  size = 24,
  strokeWidth = 1.5,
  width,
  height,
  color = '#fff',
  ...props
}: {
  size?: number;
  strokeWidth?: number;
  width?: number;
  height?: number;
  color?: string;
}) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 20 19" fill="none" {...props}>
  <path d="M8.48 18.12V0.679999H11.48V18.12H8.48ZM0.84 10.8V7.96H19.12V10.8H0.84Z" fill="#01261D"/>
</svg>
);

export default PlusIcon;
