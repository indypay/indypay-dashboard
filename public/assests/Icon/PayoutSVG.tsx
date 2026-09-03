import React from 'react';
const PayoutSVG = ({
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
  <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 56 56" fill="none" {...props}>
  <g clipPath="url(#clip0_307_116)">
    <path d="M31.0872 33.19L33.1902 24.0075M33.1902 24.0075L24.0077 21.9045M33.1902 24.0075L21.9047 31.087M18.6981 13.4404C26.489 8.55305 36.7669 10.9069 41.6542 18.6978C46.5416 26.4888 44.1878 36.7666 36.3968 41.654C28.6059 46.5414 18.328 44.1876 13.4406 36.3966C8.55327 28.6057 10.9071 18.3278 18.6981 13.4404Z" stroke="#95A19D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </g>
  <defs>
    <clipPath id="clip0_307_116">
      <rect width="39.9666" height="39.9666" fill="white" transform="translate(21.2385 55.0947) rotate(-122.101)"/>
    </clipPath>
  </defs>
</svg>
);

export default PayoutSVG;
