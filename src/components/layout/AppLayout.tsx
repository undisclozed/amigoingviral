import { AppRoutes } from '@/components/routes/AppRoutes';
import { AppSidebar } from '@/components/shared/AppSidebar';
import { useState } from 'react';

export const AppLayout = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <div className="min-h-screen flex w-full">
        <AppSidebar onCollapse={setIsCollapsed} />
        <main className={`flex-1 transition-all duration-300 ${
          isCollapsed ? 'pl-16' : 'pl-64'
        }`}>
          <AppRoutes />
        </main>
      </div>
    </div>
  );
};