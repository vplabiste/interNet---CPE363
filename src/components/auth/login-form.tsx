'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import Link from 'next/link';
import { useAuth, useFirebase } from '@/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { Separator } from '../ui/separator';
import { User } from '@/lib/types';

const formSchema = z.object({
  email: z.string().email({
    message: 'Please enter a valid email address.',
  }),
  password: z.string().min(1, {
    message: 'Password is required.',
  }),
});

export function LoginForm() {
  const auth = useAuth();
  const { setDevUser } = useFirebase();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!auth) {
        toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: "Firebase is not available. Please try again later.",
        });
        return;
    }
    setIsSubmitting(true);
    try {
      await signInWithEmailAndPassword(auth, values.email, values.password);
      // No need to show a success toast, RoleRedirect will handle navigation
    } catch (error: any) {
       toast({
          variant: "destructive",
          title: "Login Failed",
          description: error.code === 'auth/invalid-credential' 
              ? 'Invalid email or password.'
              : error.message || "Could not login.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }
  
  const handleDevLogin = (role: 'student' | 'company' | 'admin' | 'school') => {
    if (process.env.NEXT_PUBLIC_DEV_MODE === 'true' && setDevUser) {
        let devUserData: User;
        if (role === 'student') {
            devUserData = {
                id: 'dev-student-id',
                role: 'student',
                email: 'dev-student@example.com',
                fullName: 'Dev Student',
                pending: false,
            };
        } else if (role === 'company') {
            devUserData = {
                id: 'dev-company-id',
                role: 'company',
                email: 'dev-company@example.com',
                fullName: 'Dev Company Inc.',
                pending: false,
                 // Add the required onboarding field to bypass it
                shortIntroduction: 'A leading dev company.'
            };
        } else if (role === 'admin') {
             devUserData = {
                id: 'dev-admin-id',
                role: 'admin',
                email: 'dev-admin@example.com',
                fullName: 'Dev Admin',
                pending: false,
            };
        } else if (role === 'school') {
            devUserData = {
                id: 'dev-school-id',
                role: 'school',
                email: 'dev-school@example.com',
                fullName: 'Dev University',
                pending: false,
                 // Add the required onboarding field to bypass it
                programs: ['BS in Information Technology', 'BS in Computer Science']
            };
        } else {
            return;
        }
        setDevUser(devUserData);
    }
  }

  return (
    <>
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="name@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
                <div className="flex items-center">
                    <FormLabel>Password</FormLabel>
                    <Link
                        href="#"
                        className="ml-auto inline-block text-sm underline"
                    >
                        Forgot your password?
                    </Link>
                </div>
              <div className="relative">
                <FormControl>
                  <Input type={showPassword ? 'text' : 'password'} placeholder="••••••••" {...field} />
                </FormControl>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Login
        </Button>
      </form>
    </Form>

    {process.env.NEXT_PUBLIC_DEV_MODE === 'true' && (
      <>
        <div className="my-4 flex items-center">
            <Separator className="flex-1" />
            <span className="mx-4 text-xs text-muted-foreground">OR</span>
            <Separator className="flex-1" />
        </div>
        <div className="flex flex-col gap-2">
             <Button variant="outline" className="w-full" onClick={() => handleDevLogin('student')}>
                Sign in as Student (Dev)
            </Button>
            <Button variant="outline" className="w-full" onClick={() => handleDevLogin('company')}>
                Sign in as Company (Dev)
            </Button>
            <Button variant="outline" className="w-full" onClick={() => handleDevLogin('school')}>
                Sign in as School (Dev)
            </Button>
             <Button variant="outline" className="w-full" onClick={() => handleDevLogin('admin')}>
                Sign in as Admin (Dev)
            </Button>
        </div>
      </>
    )}
    </>
  );
}
