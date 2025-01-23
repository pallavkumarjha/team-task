"use client";

import { signIn } from "next-auth/react";
import { Button } from "../../components/ui/button";
import { SlackIcon, Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useState, useEffect } from "react";

export default function LoginPage() {
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status !== 'loading') {
      setIsLoading(false);
    }
  }, [status]);

  useEffect(() => {
    if (session) {
      redirect('/dashboard');
    }
  }, [session]);

  const handleSlackSignIn = async () => {
    try {
      await signIn('slack', { 
        callbackUrl: '/dashboard' 
      });
    } catch (error) {
      console.error("Slack Sign-In Error:", error);
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-slate-900">
        <div className="flex flex-col items-center">
          <Loader2 
            className="h-12 w-12 animate-spin text-blue-500" 
            strokeWidth={2} 
          />
          <p className="mt-4 text-slate-600 dark:text-slate-300">
            Checking authentication status...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-slate-900">
      <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-slate-800 dark:text-slate-200">
          Sign in to Team Task
        </h2>
        <Button 
          onClick={handleSlackSignIn}
          className="w-full flex items-center justify-center space-x-2"
          variant="outline"
        >
          <SlackIcon className="h-5 w-5" />
          <span>Sign in with Slack</span>
        </Button>
      </div>
    </div>
  );
}