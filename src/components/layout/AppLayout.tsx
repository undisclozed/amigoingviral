import { Outlet } from 'react-router-dom';
import { AppSidebar } from '@/components/shared/AppSidebar';
import { useState } from 'react';

export const AppLayout = () => {
  console.log('AppLayout rendering');
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <div className="min-h-screen flex w-full">
        <AppSidebar onCollapse={setIsCollapsed} />
        <main className={`flex-1 transition-all duration-300 ${
          isCollapsed ? 'pl-16' : 'pl-64'
        } bg-gray-50`}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};