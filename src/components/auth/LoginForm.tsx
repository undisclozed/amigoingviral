import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useNavigate } from 'react-router-dom';

interface LoginFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function LoginForm({ open, onOpenChange, onSuccess }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [cooldownTime, setCooldownTime] = useState(0);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (cooldownTime > 0) {
      timer = setInterval(() => {
        setCooldownTime((time) => Math.max(0, time - 1));
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [cooldownTime]);

  const validateEmail = (email: string) => {
    const regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    return regex.test(email.toLowerCase());
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (cooldownTime > 0) {
      toast({
        title: "Please wait",
        description: `You can request another login link in ${cooldownTime} seconds`,
        variant: "destructive",
      });
      return;
    }

    if (!validateEmail(email)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: email.toLowerCase().trim(),
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
        },
      });

      if (error) {
        if (error.message.includes('rate_limit')) {
          setCooldownTime(15); // Set 15 second cooldown
          throw new Error('Please wait 15 seconds before requesting another login link');
        }
        throw error;
      }

      toast({
        title: "Check your email",
        description: "We've sent you a magic link to sign in.",
      });
      
      if (onSuccess) {
        onSuccess();
      }

      onOpenChange(false);
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Login error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to send login link. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const buttonText = cooldownTime > 0 
    ? `Wait ${cooldownTime}s`
    : isLoading 
      ? "Sending..." 
      : "Continue with Email";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Welcome to ViewStats</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 p-4">
          <p className="text-center text-gray-500">
            Enter your email to sign in or create an account
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full"
            />
            <Button 
              className="w-full bg-green-500 hover:bg-green-600" 
              type="submit" 
              disabled={isLoading || cooldownTime > 0}
            >
              {buttonText}
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}