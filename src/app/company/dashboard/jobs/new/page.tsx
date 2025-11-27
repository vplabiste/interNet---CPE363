'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { nanoid } from 'nanoid';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
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
import { useUser, useFirestore } from '@/firebase';
import { collection, doc } from 'firebase/firestore';
import { setDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { useToast } from '@/hooks/use-toast';

const jobSchema = z.object({
  jobIntroduction: z.string().min(5, 'Job title/introduction is required'),
  program: z.string().min(1, 'Program is required'),
  qualifications: z.string().min(10, 'Qualifications are required'),
  requiredDocuments: z.string().min(5, 'Required documents are required'),
});

type FormData = z.infer<typeof jobSchema>;

export default function NewJobPage() {
  const router = useRouter();
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      jobIntroduction: '',
      program: '',
      qualifications: '',
      requiredDocuments: 'Resume, Transcript of Records',
    },
  });

  const onSubmit = (data: FormData) => {
    if (!user) {
      toast({ variant: 'destructive', title: 'Error', description: 'You must be logged in.' });
      return;
    }
    if (!firestore) return;

    const jobId = nanoid();
    const jobDocRef = doc(firestore, 'jobs', jobId);
    const newJob = {
      ...data,
      id: jobId,
      companyId: user.uid,
    };

    setDocumentNonBlocking(jobDocRef, newJob);

    toast({
      title: 'Job Posting Created!',
      description: 'Your new job posting is now live.',
    });
    router.push('/company/dashboard/jobs');
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-headline">Create New Job Posting</CardTitle>
        <CardDescription>
          Fill out the details below to attract the best interns.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="jobIntroduction"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job Title / Introduction</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Software Engineer Intern" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="program"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Relevant Program(s)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Computer Science, Information Technology" {...field} />
                  </FormControl>
                   <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="qualifications"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Qualifications</FormLabel>
                  <FormControl>
                     <Textarea
                        placeholder="List the skills and qualifications required for this role..."
                        className="resize-y min-h-[100px]"
                        {...field}
                        />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="requiredDocuments"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Required Documents for Application</FormLabel>
                  <FormControl>
                     <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end">
                <Button type="submit">
                    Create Posting
                </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
