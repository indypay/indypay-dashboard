import * as React from 'react';
const FeedBackIcon = ({
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
  <svg
    xmlns="http://www.w3.org/2000/svg"
    height={height}
    width={width}
    viewBox="0 0 32 32"
    {...props}
  >
    <path
      style={{
        lineHeight: 'normal',
        textIndent: 0,
        textAlign: 'start',
        textDecorationLine: 'none',
        textDecorationStyle: 'solid',
        textDecorationColor: '#000',
        textTransform: 'none',
        // blockProgression: "tb",
        isolation: 'auto',
        mixBlendMode: 'normal',
      }}
      fillRule="evenodd"
      d="M20.486 3.006a9.77 9.77 0 0 0-9.342 8.13c-.164-.029-.328-.06-.494-.08a8.3 8.3 0 0 0-5.576 1.333 8.32 8.32 0 0 0-3.053 10.18l-1.011 4.83a.5.5 0 0 0 .629.583l4.29-1.238A8.33 8.33 0 0 0 16.274 24.4a8.3 8.3 0 0 0 1.276-2.392 9.76 9.76 0 0 0 7.678-.508l5.134 1.48a.5.5 0 0 0 .63-.582l-1.212-5.76a9.79 9.79 0 0 0-3.576-12.003 9.76 9.76 0 0 0-5.717-1.63zm.032.994a8.77 8.77 0 0 1 5.132 1.467 8.78 8.78 0 0 1 3.155 10.922.5.5 0 0 0-.03.326l.004.023 1.06 5.053-4.448-1.285-.059-.014a.5.5 0 0 0-.166-.023v.002a.5.5 0 0 0-.225.06 8.77 8.77 0 0 1-7.12.514A8.33 8.33 0 0 0 16.784 15h9.707a.5.5 0 1 0 0-1H16.068c-.098-.119-.194-.24-.3-.354a8.3 8.3 0 0 0-3.649-2.277A8.78 8.78 0 0 1 20.517 4zm-5.061 4a.5.5 0 0 0 .05 1h10.981a.5.5 0 1 0 0-1zm0 3a.5.5 0 0 0 .05 1h10.981a.5.5 0 1 0 0-1zm-5.553 1a7.3 7.3 0 0 1 5.131 2.328 7.316 7.316 0 0 1 .445 9.461 7.32 7.32 0 0 1-9.263 1.982.5.5 60.003 0 0-.397-.035l-.04.01-3.62 1.045.863-4.127v-.006A.5.5 60.003 0 0 3 22.32a7.315 7.315 0 0 1 2.627-9.1A7.3 7.3 0 0 1 9.904 12m-4.447 4a.5.5 0 0 0 .05 1h8.985a.5.5 0 1 0 0-1zm13.783 1a.5.5 0 0 0 .051 1h2.404a.5.5 0 1 0 0-1zM5.457 19a.5.5 0 0 0 .05 1h8.985a.5.5 0 1 0 0-1zm-.008 3a.5.5 0 0 0 .051 1h4a.5.5 0 1 0 0-1H5.45z"
      color="#000"
      fontFamily="sans-serif"
      fontWeight={400}
      overflow="visible"
    />
  </svg>
);
export default FeedBackIcon;
