import { Routes, Route, Navigate } from 'react-router-dom';
import { AccountOverview } from '@/components/AccountOverview';
import { GrowthAnalytics } from '@/components/GrowthAnalytics';
import ChartsSection from '@/components/dashboard/ChartsSection';
import Profile from '@/pages/Profile';
import Posts from '@/pages/Posts';

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route
        path="/dashboard"
        element={
          <div>
            <AccountOverview />
            <GrowthAnalytics />
            <ChartsSection />
          </div>
        }
      />
      <Route path="/profile" element={<Profile />} />
      <Route path="/posts" element={<Posts />} />
    </Routes>
  );
};