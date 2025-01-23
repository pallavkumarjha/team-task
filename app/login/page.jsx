"use client";
import { signIn } from "next-auth/react";
import { Button } from "../../components/ui/button";
import { SlackIcon } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-slate-900">
      <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Sign in to Team Task
        </h2>
        <Button
          onClick={() => signIn('slack')}
          className="w-full flex items-center justify-center"
        >
          <SlackIcon className="mr-2" />
          Sign in with Slack
        </Button>
      </div>
    </div>
  );
}