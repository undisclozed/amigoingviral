import { Routes, Route } from "react-router-dom";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { AppLayout } from "@/components/layout/AppLayout";
import Dashboard from "@/pages/Dashboard";
import Posts from "@/pages/Posts";
import Profile from "@/pages/Profile";
import Settings from "@/pages/Settings";
import Test from "@/pages/Test";
import Index from "@/pages/Index";

export function AppRoutes() {
  console.log("AppRoutes rendering");
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route element={<AuthGuard><AppLayout /></AuthGuard>}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/posts" element={<Posts />} />
        <Route path="/test" element={<Test />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
      </Route>
    </Routes>
  );
}