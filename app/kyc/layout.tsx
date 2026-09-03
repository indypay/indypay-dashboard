import { ReactNode } from 'react';

const KYCLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div
      className="kyc-flow w-full min-h-screen"
      style={{ background: 'var(--background)' }}
    >
      {children}
    </div>
  );
};

export default KYCLayout;
