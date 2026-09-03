'use client';
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface NavbarContextProps {
  isCollapsed: boolean;
  toggleNavbar: () => void;
}

const NavbarContext = createContext<NavbarContextProps | undefined>(undefined);

export const NavbarProvider = ({ children }: { children: ReactNode }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleNavbar = () => {
    setIsCollapsed((prev) => !prev);
  };

  return (
    <NavbarContext.Provider value={{ isCollapsed, toggleNavbar }}>
      {children}
    </NavbarContext.Provider>
  );
};

export const useNavbar = () => {
  const context = useContext(NavbarContext);
  if (!context) {
    throw new Error('useNavbar must be used within a NavbarProvider');
  }
  return context;
};
