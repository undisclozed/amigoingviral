import { Routes, Route, Navigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import Dashboard from "@/pages/Dashboard";
import Posts from "@/pages/Posts";
import Profile from "@/pages/Profile";
import Settings from "@/pages/Settings";
import { AuthGuard } from "@/components/auth/AuthGuard";

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<AuthGuard><AppLayout /></AuthGuard>}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="posts" element={<Posts />} />
        <Route path="profile" element={<Profile />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  );
}