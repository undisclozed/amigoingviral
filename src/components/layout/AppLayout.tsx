import { AppSidebar } from '@/components/shared/AppSidebar';
import { AppRoutes } from '@/components/routes/AppRoutes';

export const AppLayout = () => {
  return (
    <div className="flex h-screen">
      <AppSidebar />
      <main className="flex-1 overflow-y-auto p-8 ml-64">
        <AppRoutes />
      </main>
    </div>
  );
};