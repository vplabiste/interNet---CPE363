'use client';

import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { LoginForm } from '@/components/auth/login-form';
import { Logo } from '@/components/logo';
import { useUser } from '@/firebase';
import { RoleRedirect } from '@/components/auth/role-redirect';

export default function LoginPage() {
  const { isLoading } = useUser();

  // Show a loading state ONLY while checking for an existing user session on initial load.
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div>Loading...</div>
      </div>
    );
  }
  
  return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4">
        <RoleRedirect />
        <div className="mb-8">
          <Logo />
        </div>
        <Card className="w-full max-w-sm shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl font-headline">Welcome Back</CardTitle>
            <CardDescription>
              Enter your email below to login to your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm />
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{' '}
              <Link href="/signup" className="underline">
                Sign up
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
  );
}
