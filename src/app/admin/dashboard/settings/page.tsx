'use client';

import { useUser, useFirestore, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useEffect } from 'react';
import { updateProfile, getAuth } from 'firebase/auth';
import { updateDocumentNonBlocking } from '@/firebase/non-blocking-updates';

const profileSchema = z.object({
    fullName: z.string().min(2, 'Name is too short'),
    contactInfo: z.string().optional(),
});

type FormData = z.infer<typeof profileSchema>;

export default function SettingsPage() {
    const { user, userData, isLoading } = useUser();
    const firestore = useFirestore();
    const { toast } = useToast();

    const form = useForm<FormData>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            fullName: '',
            contactInfo: '',
        }
    });
    
    useEffect(() => {
        if (userData) {
            form.reset({
                fullName: userData.fullName || '',
                contactInfo: userData.contactInfo || '',
            });
        }
    }, [userData, form]);


    const onSubmit = async (data: FormData) => {
        if (!user || !firestore) {
            toast({ variant: 'destructive', title: 'Error', description: 'Not logged in' });
            return;
        }

        const userDocRef = doc(firestore, 'users', user.uid);
        updateDocumentNonBlocking(userDocRef, {
            fullName: data.fullName,
            contactInfo: data.contactInfo
        });
        
        const auth = getAuth();
        if (auth.currentUser && auth.currentUser.displayName !== data.fullName) {
            await updateProfile(auth.currentUser, { displayName: data.fullName });
        }

        toast({ title: 'Success', description: 'Your profile has been updated.' });
    };

    if (isLoading) {
        return <p>Loading settings...</p>
    }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Account Settings</CardTitle>
        <CardDescription>
          Manage your account settings and preferences.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                            <Input placeholder="Your full name" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="contactInfo"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Contact Number</FormLabel>
                        <FormControl>
                            <Input placeholder="Your phone number" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="flex justify-end">
                    <Button type="submit" disabled={form.formState.isSubmitting}>
                        {form.formState.isSubmitting ? 'Saving...' : 'Save Changes'}
                    </Button>
                </div>
            </form>
        </Form>
      </CardContent>
    </Card>
  );
}
