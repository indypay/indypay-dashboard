import { ReactNode } from 'react';

const ForgotPasswordLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="w-full min-h-screen bg-gray-50">
      <div className="w-full min-h-screen shadow-4xl bg-white">{children}</div>
    </div>
  );
};

export default ForgotPasswordLayout;
