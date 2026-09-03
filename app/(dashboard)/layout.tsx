// 'use client';

// import { ReactNode, useState, useEffect, useCallback } from 'react';
// import { useRouter } from 'next/navigation';
// import clsx from 'clsx';
// import { Skeleton } from '@heroui/react';

// import { Sidebar } from '@/lib/components/Sidebar';
// import Header from '@/lib/components/Header';
// import '@/styles/globals.scss';
// import { useLogout } from '@/lib/hooks/auth-verification';
// import { LocalStorageKeys } from '@/lib/utils/localStorage-utils';
// import { persistToLocalStorage } from '@/lib/utils/localStorage-utils';

// const INACTIVITY_TIMEOUT = 10 * 60 * 1000;

// export default function RootLayout({ children }: { children: ReactNode }) {
//   const [isCollapsed, setIsCollapsed] = useState(true);
//   const [lastActivity, setLastActivity] = useState(Date.now());
//   const router = useRouter();
//   const { mutate: logout } = useLogout();
//   const [role, setRole] = useState('');
//   const [loading, setLoading] = useState(true);

//   const handleActivity = useCallback(() => {
//     setLastActivity(Date.now());
//   }, []);

//   useEffect(() => {
//     const checkInactivity = () => {
//       if (Date.now() - lastActivity > INACTIVITY_TIMEOUT) {
//         logout(undefined, {
//           onSuccess: () => {
//             router.push('/sign-in');
//           },
//         });
//       }
//     };

//     const intervalId = setInterval(checkInactivity, 60 * 1000);

//     return () => clearInterval(intervalId);
//   }, [lastActivity, logout, router]);

//   useEffect(() => {
//     const fetchRole = async () => {
//       const response = await fetch(window.location.href);
//       const userRole = response.headers.get('x-user-role'); // Get role from headers
//       if (userRole) {
//         persistToLocalStorage(LocalStorageKeys.ROLE, userRole);
//         setRole(userRole);
//       }
//       setLoading(false);
//     };
//     fetchRole();
//   }, []);

//   const toggleNavbar = () => {
//     setIsCollapsed((prev) => !prev);
//   };

//   return (
//     <div
//       onMouseMove={handleActivity}
//       onClick={handleActivity}
//       onKeyDown={handleActivity}
//       onScroll={handleActivity}
//       className="flex flex-row h-screen"
//     >
//       {!loading && role ? (
//         <div>
//           <Sidebar
//             isCollapsed={isCollapsed}
//             toggleNavbar={toggleNavbar}
//             role={role}
//             isLoading={false}
//           />
//         </div>
//       ) : (
//         <div className="absolute h-full p-4 w-24 border-r dark:border-primary border-secondary bg-zinc-50 dark:bg-default-50 transition-all duration-500 overflow-y-auto shadow-md">
//           <Skeleton
//             style={{ height: 65, width: '75%' }}
//             className="mb-6 rounded-md"
//           />
//           <Skeleton
//             style={{ height: 40, width: '65%' }}
//             className="mb-4 rounded-md ml-3"
//           />
//           <Skeleton
//             style={{ height: 40, width: '65%' }}
//             className="mb-4 rounded-md ml-3"
//           />
//           <Skeleton
//             style={{ height: 40, width: '65%' }}
//             className="mb-4 rounded-md ml-3"
//           />
//           <Skeleton
//             style={{ height: 40, width: '65%' }}
//             className="mb-4 rounded-md ml-3"
//           />
//           <Skeleton
//             style={{ height: 40, width: '65%' }}
//             className="mb-4 rounded-md ml-3"
//           />
//           <Skeleton
//             style={{ height: 40, width: '65%' }}
//             className="mb-4 rounded-md ml-3"
//           />
//         </div>
//       )}
//       <div
//         className={clsx('flex-1 transition-all bg-zinc-50 dark:bg-default-50', {
//           'pl-24': isCollapsed,
//           'pl-64': !isCollapsed,
//         })}
//       >
//         <main className="overflow-y-scroll">
//           <Header isCollapsed={isCollapsed} />
//           {children}
//         </main>
//       </div>
//     </div>
//   );
// }

'use client';

import { ReactNode, useState, useEffect, useCallback } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import clsx from 'clsx';
import { Sidebar } from '@/lib/components/Sidebar';
import Header from '@/lib/components/Header';
import '@/styles/globals.scss';
import { useLogout } from '@/lib/hooks/auth-verification';
import HSkeleton from '@/lib/components/HomeSkeleton/merchant';
import AdminSkeleton from '@/lib/components/HomeSkeleton/admin';
import { useRole, RoleProvider } from '@/lib/components/Role/RoleContext';
import { ModeProvider } from '@/lib/context/ModeContext';
import { NotificationProvider } from '@/lib/context/NotificationContext';
import { ErrorBoundary } from '@/lib/components/ErrorBoundary';

const INACTIVITY_TIMEOUT = 10 * 60 * 1000;

function DashboardLayout({ children }: { children: ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [lastActivity, setLastActivity] = useState(Date.now());
  const router = useRouter();
  const { role, isLoading } = useRole();
  const pathname = usePathname();
  const { mutate: logout } = useLogout();

  const handleActivity = useCallback(() => {
    setLastActivity(Date.now());
  }, []);

  useEffect(() => {
    const checkInactivity = () => {
      if (Date.now() - lastActivity > INACTIVITY_TIMEOUT) {
        logout(undefined, {
          onSuccess: () => {
            router.push(
              `/sign-in?redirect=${encodeURIComponent(pathname || '')}`,
            );
          },
        });
      }
    };
    const intervalId = setInterval(checkInactivity, 60 * 1000);

    return () => clearInterval(intervalId);
  }, [lastActivity, logout, router]);

  const toggleNavbar = () => {
    setIsCollapsed((prev) => !prev);
  };

  if (isLoading) {
    return role === '5' ? <AdminSkeleton /> : <HSkeleton />;
  }

  return (
    <div
      onMouseMove={handleActivity}
      onClick={handleActivity}
      onKeyDown={handleActivity}
      className="flex h-screen"
    >
      <Sidebar isCollapsed={isCollapsed} toggleNavbar={toggleNavbar} />
      <div className="flex-1 flex flex-col overflow-y-auto">
        <Header isCollapsed={isCollapsed} />
        <main className="flex-1">
          <ErrorBoundary>{children}</ErrorBoundary>
        </main>
      </div>
    </div>
  );
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <RoleProvider>
      <ModeProvider>
        <NotificationProvider>
          <DashboardLayout>{children}</DashboardLayout>
        </NotificationProvider>
      </ModeProvider>
    </RoleProvider>
  );
}
