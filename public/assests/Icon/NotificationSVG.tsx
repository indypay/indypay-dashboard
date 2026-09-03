import React from 'react';

const NotificationIcon = ({
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
 <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 29 34" fill="none" {...props}>
<path d="M17.092 31.5051C16.828 31.9597 16.456 32.3371 16 32.5995C15.544 32.8619 15.028 33 14.5 33C13.972 33 13.456 32.8619 13 32.5995C12.544 32.3371 12.172 31.9597 11.908 31.5051M23.5 12.602C23.5 10.0561 22.5521 7.61379 20.8601 5.8135C19.1801 4.01309 16.888 3.00049 14.5 3.00049C12.112 3.00049 9.81994 4.01165 8.13994 5.8135C6.44794 7.61379 5.5 10.0561 5.5 12.602C5.5 23.8043 1 27.0043 1 27.0043H28C28 27.0043 23.5 23.8043 23.5 12.602Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
<path d="M21.7 12.0019C25.0137 12.0019 27.7 9.3152 27.7 6.00096C27.7 2.68672 25.0137 0 21.7 0C18.3863 0 15.7 2.68672 15.7 6.00096C15.7 9.3152 18.3863 12.0019 21.7 12.0019Z" fill="url(#paint0_linear_287_45)"/>
<defs>
<linearGradient id="paint0_linear_287_45" x1="14.74" y1="10.5974" x2="29.2547" y2="9.99518" gradientUnits="userSpaceOnUse">
<stop stopColor="#53BEC2"/>
<stop offset="1" stopColor="#00EF64"/>
</linearGradient>
</defs>
</svg>
);

export default NotificationIcon;
