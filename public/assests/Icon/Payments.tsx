import * as React from 'react';
const PaymentIcon = ({
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
      d="M1.5 1.05a.45.45 0 1 0 0 .9h12a.45.45 0 1 0 0-.9zm2.432 6.382a.45.45 0 1 0 .636.636L7.05 5.586V13.5a.45.45 0 0 0 .9 0V5.586l2.482 2.482a.45.45 0 1 0 .636-.636l-3.25-3.25a.45.45 0 0 0-.636 0z"
      fill="currentColor"
    />
  </svg>
);
export default PaymentIcon;
