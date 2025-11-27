'use client';

import { useUser, useFirestore } from '@/firebase';
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
import { useEffect, useRef } from 'react';
import { updateProfile, getAuth } from 'firebase/auth';
import { updateDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';

const profileSchema = z.object({
    fullName: z.string().min(2, 'Name is too short'),
    contactInfo: z.string().optional(),
    logo: z.any().optional(),
    headerImage: z.any().optional(),
    shortIntroduction: z.string().max(500, "Introduction is too long").optional(),
});

type FormData = z.infer<typeof profileSchema>;

export default function SettingsPage() {
    const { user, userData, isLoading } = useUser();
    const firestore = useFirestore();
    const { toast } = useToast();
    const logoInputRef = useRef<HTMLInputElement>(null);
    const headerInputRef = useRef<HTMLInputElement>(null);

    const form = useForm<FormData>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            fullName: '',
            contactInfo: '',
            shortIntroduction: '',
            logo: null,
            headerImage: null,
        }
    });
    
    useEffect(() => {
        if (userData) {
            form.reset({
                fullName: userData.fullName || '',
                contactInfo: userData.contactInfo || '',
                shortIntroduction: userData.shortIntroduction || '',
            });
        }
    }, [userData, form]);


    const onSubmit = async (data: FormData) => {
        if (!user || !firestore) {
            toast({ variant: 'destructive', title: 'Error', description: 'Not logged in' });
            return;
        }

        const userDocRef = doc(firestore, 'users', user.uid);
        const companyDocRef = doc(firestore, 'companies', user.uid);
        
        const updates = {
            fullName: data.fullName,
            contactInfo: data.contactInfo,
            shortIntroduction: data.shortIntroduction,
            // In a real app, upload files and get URLs
            // logoUrl: newLogoUrl,
            // headerImageUrl: newHeaderUrl,
        };

        updateDocumentNonBlocking(userDocRef, updates);
        updateDocumentNonBlocking(companyDocRef, updates);
        
        const auth = getAuth();
        if (auth.currentUser && auth.currentUser.displayName !== data.fullName) {
            await updateProfile(auth.currentUser, { displayName: data.fullName });
        }

        toast({ title: 'Success', description: 'Your profile has been updated.' });
    };
    
    const getInitials = (name: string | null | undefined) => {
        if (!name) return 'C';
        return name
        .split(' ')
        .map(n => n[0])
        .join('');
    };

    const logoValue = form.watch('logo');
    const headerValue = form.watch('headerImage');


    if (isLoading) {
        return (
            <div className="max-w-2xl mx-auto space-y-6">
                <Skeleton className="h-10 w-1/2" />
                <Skeleton className="h-8 w-3/4" />
                <div className="space-y-4 pt-6">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-24 w-full" />
                </div>
            </div>
        )
    }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Company Profile Settings</CardTitle>
        <CardDescription>
          Manage your company's public information.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="logo"
                  render={({ field }) => (
                    <FormItem className="flex flex-col items-center space-y-4">
                      <FormLabel>Company Logo</FormLabel>
                      <Avatar className="h-24 w-24">
                        <AvatarImage src={logoValue ? URL.createObjectURL(logoValue) : userData?.logoUrl} />
                        <AvatarFallback>
                            {getInitials(userData?.fullName)}
                        </AvatarFallback>
                      </Avatar>
                      <FormControl>
                        <Input
                          type="file"
                          ref={logoInputRef}
                          className="hidden"
                          onChange={(e) => field.onChange(e.target.files ? e.target.files[0] : null)}
                          accept="image/*"
                        />
                      </FormControl>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => logoInputRef.current?.click()}
                      >
                        Change Logo
                      </Button>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Company Name</FormLabel>
                        <FormControl>
                            <Input placeholder="Your company's name" {...field} />
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
                            <Input placeholder="Your company's phone number" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                  control={form.control}
                  name="shortIntroduction"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Short Introduction</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="A brief introduction about your company..."
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                 <FormField
                    control={form.control}
                    name="headerImage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Header Image</FormLabel>
                        {headerValue || userData?.headerImageUrl ?
                        <div className="aspect-video w-full rounded-md overflow-hidden relative">
                             <img src={headerValue ? URL.createObjectURL(headerValue) : userData?.headerImageUrl} className="object-cover w-full h-full" alt="Header preview" />
                        </div>
                        : null}
                        <FormControl>
                            <Input 
                                type="file" 
                                ref={headerInputRef}
                                onChange={(e) => field.onChange(e.target.files ? e.target.files[0] : null)} 
                                accept="image/*"
                            />
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
