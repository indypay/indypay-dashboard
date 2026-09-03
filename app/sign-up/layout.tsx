import { ReactNode } from 'react';

const LoginLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gradient-bg-dark-from to-gradient-bg-dark-to">
      {children}
    </div>
  );
};

export default LoginLayout;
