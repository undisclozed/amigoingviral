import { Outlet } from "react-router-dom";
import { AppSidebar } from "../shared/AppSidebar";
import { useState } from "react";

export function AppLayout() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <div className="min-h-screen flex">
        <AppSidebar onCollapse={setIsCollapsed} />
        <main className={`flex-1 ${isCollapsed ? 'pl-24' : 'pl-72'} p-6 transition-all duration-300`}>
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}