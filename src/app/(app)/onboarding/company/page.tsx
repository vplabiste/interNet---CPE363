
'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { writeBatch, doc } from 'firebase/firestore';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { useUser, useFirestore } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Upload } from 'lucide-react';
import { Company } from '@/lib/types';
import { useRef } from 'react';


const profileSchema = z.object({
  shortIntroduction: z.string().min(10, 'Introduction is too short').max(500, 'Introduction is too long'),
  logoUrl: z.any().optional(),
  headerImageUrl: z.any().optional(),
});

type FormData = z.infer<typeof profileSchema>;

export default function CompanyOnboardingPage() {
  const router = useRouter();
  const { user, userData } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const logoInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      shortIntroduction: '',
      logoUrl: null,
      headerImageUrl: null,
    },
  });

  const logoUrlValue = form.watch('logoUrl');

  const onSubmit = async (data: FormData) => {
    if (!user || !userData) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'You must be logged in to update your profile.',
      });
      return;
    }
    if (!firestore) return;

    try {
      const batch = writeBatch(firestore);
      
      // 1. Update the private user document
      const userDocRef = doc(firestore, 'users', user.uid);
      batch.update(userDocRef, { shortIntroduction: data.shortIntroduction });
      
      // 2. Create/update the public company profile document
      const companyDocRef = doc(firestore, 'companies', user.uid);
      const publicCompanyProfile: Company = {
          id: user.uid,
          fullName: userData.fullName,
          email: userData.email,
          shortIntroduction: data.shortIntroduction,
          // In a real app, you'd upload images and get URLs here
          // logoUrl: uploadedLogoUrl,
          // headerImageUrl: uploadedHeaderUrl
      }
      batch.set(companyDocRef, publicCompanyProfile, { merge: true });

      await batch.commit();

      toast({
        title: 'Profile Complete!',
        description: 'Your company profile has been updated.',
      });
      router.push('/dashboard/company');
    } catch (error) {
      console.error("Onboarding error:", error);
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'Could not update your profile.',
      });
    }
  };

  const getInitials = (name: string | null | undefined) => {
    if (!name) return 'C';
    return name
      .split(' ')
      .map(n => n[0])
      .join('');
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <Card className="w-full max-w-lg shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl font-headline">Company Onboarding</CardTitle>
          <CardDescription>
            Complete your company profile to start recruiting interns.
          </CardDescription>
          <Progress value={100} className="mt-2" />
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="logoUrl"
                  render={({ field }) => (
                    <FormItem className="flex flex-col items-center space-y-4">
                      <FormLabel>Company Logo</FormLabel>
                      <Avatar className="h-24 w-24">
                         <AvatarImage src={logoUrlValue ? URL.createObjectURL(logoUrlValue) : userData?.logoUrl} />
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
                        <Upload className="mr-2 h-4 w-4" />
                        Upload Logo
                      </Button>
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
                          placeholder="Tell us about your company..."
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
                    name="headerImageUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Header Image (Optional)</FormLabel>
                        <FormControl>
                          <Input type="file" onChange={(e) => field.onChange(e.target.files ? e.target.files[0] : null)} />
                        </FormControl>
                         <FormMessage />
                      </FormItem>
                    )}
                  />
              </div>
              <CardFooter className="flex justify-end p-0 pt-6">
                <Button type="submit">
                  Finish Setup
                </Button>
              </CardFooter>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
