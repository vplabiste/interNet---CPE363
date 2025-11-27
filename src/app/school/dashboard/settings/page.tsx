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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';

const profileSchema = z.object({
    fullName: z.string().min(2, 'Name is too short'),
    contactInfo: z.string().optional(),
    profilePicture: z.any().optional(),
    shortIntroduction: z.string().optional(),
});

type FormData = z.infer<typeof profileSchema>;

export default function SettingsPage() {
    const { user, userData, isLoading } = useUser();
    const firestore = useFirestore();
    const { toast } = useToast();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const form = useForm<FormData>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            fullName: '',
            contactInfo: '',
            profilePicture: null,
            shortIntroduction: '',
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
        
        // In a real app, you would upload the file to Firebase Storage and get a URL
        // For now, we'll just update the text fields
        
        updateDocumentNonBlocking(userDocRef, {
            fullName: data.fullName,
            contactInfo: data.contactInfo,
            shortIntroduction: data.shortIntroduction,
            // profilePictureUrl: uploadedFileUrl 
        });
        
        const auth = getAuth();
        if (auth.currentUser && auth.currentUser.displayName !== data.fullName) {
            await updateProfile(auth.currentUser, { displayName: data.fullName });
        }

        toast({ title: 'Success', description: 'Your profile has been updated.' });
    };

    const getInitials = (name: string | null | undefined) => {
        if (!name) return 'U';
        return name
        .split(' ')
        .map(n => n[0])
        .join('');
    };

    const profilePictureValue = form.watch('profilePicture');

    if (isLoading) {
        return <p>Loading settings...</p>
    }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>School Profile Settings</CardTitle>
        <CardDescription>
          Manage your school's public information.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="profilePicture"
                  render={({ field }) => (
                    <FormItem className="flex flex-col items-center space-y-4">
                      <FormLabel>School Logo</FormLabel>
                      <Avatar className="h-24 w-24">
                        <AvatarImage src={profilePictureValue ? URL.createObjectURL(profilePictureValue) : userData?.profilePictureUrl} />
                        <AvatarFallback>
                            {getInitials(userData?.fullName)}
                        </AvatarFallback>
                      </Avatar>
                      <FormControl>
                        <Input
                          type="file"
                          ref={fileInputRef}
                          className="hidden"
                          onChange={(e) => field.onChange(e.target.files ? e.target.files[0] : null)}
                          accept="image/*"
                        />
                      </FormControl>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        Change Picture
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
                        <FormLabel>School Name</FormLabel>
                        <FormControl>
                            <Input placeholder="Your school's name" {...field} />
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
                            <Input placeholder="Your school's phone number" {...field} />
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
                      <FormLabel>School Introduction</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="A brief introduction about your university..."
                          className="resize-none"
                          {...field}
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
