
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

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
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { User } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { X, PlusCircle } from 'lucide-react';
import { updateDocumentNonBlocking } from '@/firebase/non-blocking-updates';


const formSchema = z.object({
  contactInfo: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

export default function SchoolOnboardingPage() {
  const router = useRouter();
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const [newProgram, setNewProgram] = useState('');
  
  const userDocRef = useMemoFirebase(
    () => (user && firestore ? doc(firestore, 'users', user.uid) : null),
    [firestore, user]
  );
  const { data: userData, isLoading: isUserDocLoading } = useDoc<User>(userDocRef);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      contactInfo: '',
    },
  });

  useEffect(() => {
    if (userData?.contactInfo) {
      form.setValue('contactInfo', userData.contactInfo);
    }
  }, [userData, form]);


  const handleAddProgram = async () => {
    if (!newProgram.trim() || !userDocRef || !userData) return;
    
    const updatedPrograms = [...(userData.programs || []), newProgram.trim()];
    
    updateDocumentNonBlocking(userDocRef, { programs: updatedPrograms });
    setNewProgram('');
    toast({
        title: 'Success',
        description: 'Program added successfully.',
    });
  };

  const handleRemoveProgram = async (programToRemove: string) => {
    if (!userDocRef || !userData || !userData.programs) return;

    const updatedPrograms = userData.programs.filter(p => p !== programToRemove);

    updateDocumentNonBlocking(userDocRef, { programs: updatedPrograms });
    toast({
        title: 'Success',
        description: 'Program removed successfully.',
    });
  }

  const onSubmit = async (data: FormData) => {
    if (isUserLoading || !user || !userData || !firestore) {
      toast({ variant: 'destructive', title: 'Error', description: 'Please wait and try again.' });
      return;
    }
     if (!userData.programs || userData.programs.length === 0) {
      toast({ variant: 'destructive', title: 'Error', description: 'Please add at least one program to continue.' });
      return;
    }

    // Update user profile
    updateDocumentNonBlocking(userDocRef, {
      contactInfo: data.contactInfo
    });

    toast({
      title: 'Profile Complete!',
      description: 'Your school profile has been updated.',
    });
    router.push('/dashboard/school');
  };
  
  if (isUserDocLoading || isUserLoading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <Card className="w-full max-w-lg shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl font-headline">School Onboarding</CardTitle>
          <CardDescription>
            Complete your school's profile to connect with students.
          </CardDescription>
          <Progress value={((userData?.programs?.length || 0) > 0) ? 100 : 50} className="mt-2" />
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-4">
                    <FormField
                        control={form.control}
                        name="contactInfo"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Contact Phone</FormLabel>
                            <FormControl>
                            <Input placeholder="e.g., (032) 253-1000" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <div className="space-y-2">
                        <Label>Academic Programs</Label>
                         <p className="text-sm text-muted-foreground">Add the programs students can enroll in for internships.</p>
                        <div className="flex gap-2">
                            <Input 
                                value={newProgram}
                                onChange={(e) => setNewProgram(e.target.value)}
                                placeholder="e.g., BS in Computer Science"
                            />
                            <Button type="button" onClick={handleAddProgram}><PlusCircle className="mr-2 h-4 w-4" /> Add</Button>
                        </div>
                    </div>
                     <div className="space-y-2">
                        <h4 className="text-sm font-medium text-muted-foreground">Current Programs:</h4>
                        <div className="flex flex-wrap gap-2">
                            {userData?.programs && userData.programs.length > 0 ? (
                                userData.programs.map(program => (
                                    <Badge key={program} variant="secondary" className="text-base py-1 pl-3 pr-1">
                                        {program}
                                        <button type="button" onClick={() => handleRemoveProgram(program)} className="ml-2 rounded-full p-0.5 hover:bg-destructive/80">
                                            <X className="h-3 w-3" />
                                        </button>
                                    </Badge>
                                ))
                            ) : (
                                <p className="text-sm text-muted-foreground">No programs added yet. Add at least one to continue.</p>
                            )}
                        </div>
                    </div>
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
