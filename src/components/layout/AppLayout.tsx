import { Outlet } from 'react-router-dom';
import { AppSidebar } from '@/components/shared/AppSidebar';
import { useState } from 'react';

export const AppLayout = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <div className="flex min-h-screen">
        <AppSidebar onCollapse={setIsCollapsed} />
        <main 
          className={`flex-1 transition-all duration-300 ${
            isCollapsed ? 'pl-16' : 'pl-64'
          } p-6 bg-gray-50`}
        >
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};