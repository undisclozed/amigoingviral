import { AuthProvider } from '@/lib/auth/AuthContext';
import { useAuth } from '@/lib/auth/AuthContext';
import { LoginForm } from '@/components/auth/LoginForm';
import { Toaster } from '@/components/ui/toaster';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AccountOverview } from '@/components/AccountOverview';
import { GrowthAnalytics } from '@/components/GrowthAnalytics';
import ChartsSection from '@/components/dashboard/ChartsSection';

const queryClient = new QueryClient();

function AppContent() {
  const { user } = useAuth();

  if (!user) {
    return <LoginForm />;
  }

  return (
    <div>
      <AccountOverview />
      <GrowthAnalytics />
      <ChartsSection />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppContent />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;