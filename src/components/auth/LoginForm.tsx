import { useState } from 'react';
import { useAuth } from '@/lib/auth/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signIn } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await signIn(email);
      toast({
        title: "Check your email",
        description: "We've sent you a magic link to sign in.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send login link. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="mx-auto max-w-sm space-y-6 p-4">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold">Welcome to Statsss</h1>
          <p className="text-gray-500">Enter your email to sign in or create an account</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Button className="w-full" type="submit" disabled={isLoading}>
            {isLoading ? "Sending..." : "Continue with Email"}
          </Button>
        </form>
      </div>
    </div>
  );
}