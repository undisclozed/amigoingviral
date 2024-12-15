import { Routes, Route, Navigate } from 'react-router-dom';
import { AccountOverview } from '@/components/AccountOverview';
import { GrowthAnalytics } from '@/components/GrowthAnalytics';
import ChartsSection from '@/components/dashboard/ChartsSection';
import Profile from '@/pages/Profile';
import Posts from '@/pages/Posts';
import DashboardHeader from '@/components/dashboard/DashboardHeader';

export const AppRoutes = () => {
  console.log('AppRoutes rendering');
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/dashboard" element={
        <>
          <DashboardHeader />
          <div className="container mx-auto px-4 py-8 space-y-6">
            <AccountOverview />
            <GrowthAnalytics />
            <ChartsSection />
          </div>
        </>
      } />
      <Route path="/profile" element={
        <>
          {console.log('Profile route matched')}
          <DashboardHeader />
          <div className="container mx-auto px-4 py-8 bg-gray-50 min-h-screen">
            <Profile />
          </div>
        </>
      } />
      <Route path="/posts" element={
        <>
          <DashboardHeader />
          <div className="container mx-auto px-4 py-8">
            <Posts />
          </div>
        </>
      } />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};