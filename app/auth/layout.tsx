import { ReactNode } from 'react';

const RegisterLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex min-h-screen">
      <div className="flex flex-col shadow-large lg:w-1/2 ">
        <div className="max-w-lg w-full sm:max-w-3xl m-auto px-4 sm:shadow-lg sm:rounded-3xl sm:rounded-b-none sm:bg-[#fff] sm:mb-0  sm:flex-auto z-10 dark:bg-default-100">
          {children}
        </div>
      </div>
    </div>
  );
};

export default RegisterLayout;
