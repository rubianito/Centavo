import React, { ReactNode } from 'react';
import { User } from '../../types/auth';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';

interface DashboardLayoutProps {
  user: User | null;
  onLogout: () => void;
  children: ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  user,
  onLogout,
  children,
}) => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar user={user} onLogout={onLogout} />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
};
