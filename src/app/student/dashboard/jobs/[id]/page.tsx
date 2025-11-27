
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import { User, Job } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Briefcase, MapPin, CheckCircle, Upload, FileText, ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// --- Static Data for UI/UX Development ---
const allJobs: (Job & { company: User })[] = [
    { id: 'job1-1', companyId: 'comp1', jobIntroduction: 'Software Engineer Intern', program: 'Computer Science', qualifications: 'Experience with React and Node.js. Strong understanding of data structures and algorithms. Excellent problem-solving skills.', requiredDocuments: 'Resume, Transcript of Records', company: { id: 'comp1', role: 'company', fullName: 'Tech Innovators Inc.', email: '', logoUrl: 'https://picsum.photos/seed/comp1/200/200', headerImageUrl: 'https://picsum.photos/seed/header1/1200/400' } },
    { id: 'job1-2', companyId: 'comp1', jobIntroduction: 'Data Science Intern', program: 'Data Science, Statistics', qualifications: 'Proficiency in Python, Pandas, and Scikit-learn. Experience with data visualization tools like Matplotlib or Seaborn.', requiredDocuments: 'Resume, Cover Letter, Portfolio', company: { id: 'comp1', role: 'company', fullName: 'Tech Innovators Inc.', email: '', logoUrl: 'https://picsum.photos/seed/comp1/200/200', headerImageUrl: 'https://picsum.photos/seed/header1/1200/400' } },
    { id: 'job2-1', companyId: 'comp2', jobIntroduction: 'Mechanical Engineer Intern', program: 'Mechanical Engineering', qualifications: 'Familiarity with CAD software (SolidWorks, AutoCAD). Basic knowledge of thermodynamics and fluid mechanics.', requiredDocuments: 'Resume', company: { id: 'comp2', role: 'company', fullName: 'Future Solutions LLC', email: '', logoUrl: 'https://picsum.photos/seed/comp2/200/200', headerImageUrl: 'https://picsum.photos/seed/header2/1200/400' } },
];
// --- End of Static Data ---

export default function JobApplicationPage({ params }: { params: { id: string } }) {
    const { toast } = useToast();
    const router = useRouter();
    const job = allJobs.find(j => j.id === params.id) || allJobs[0]; // Fallback to first job
    const isLoading = false; // Set to false since we're using static data
    const { company } = job;
    
    const requiredDocs = job.requiredDocuments.split(',').map(d => d.trim()).filter(Boolean);

    const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').substring(0, 2);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Simulate form submission
        toast({
            title: "Application Submitted!",
            description: `Your application for ${job.jobIntroduction} has been sent.`,
        });
        setTimeout(() => router.push('/student/dashboard/applications'), 1500);
    }

    if (isLoading || !job) {
        return (
             <div className="space-y-6">
                <Skeleton className="h-48 w-full rounded-lg" />
                <div className="flex items-end -mt-20 ml-8">
                     <Skeleton className="h-32 w-32 rounded-full border-4 border-background" />
                </div>
                <div className="p-6 pt-2 space-y-4">
                    <Skeleton className="h-8 w-1/2" />
                    <Skeleton className="h-5 w-3/4" />
                </div>
            </div>
        )
    }

  return (
      <div className="space-y-6">
         <Button variant="outline" onClick={() => router.back()} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Jobs
        </Button>
        <Card className="overflow-hidden">
            <div className="relative h-32 md:h-48 w-full bg-muted">
                {company.headerImageUrl && (
                    <Image 
                        src={company.headerImageUrl} 
                        alt={`${company.fullName} header`} 
                        fill
                        className="object-cover"
                    />
                )}
            </div>
            <div className="flex items-end -mt-16 md:-mt-20 ml-4 md:ml-8">
                <Avatar className="h-24 w-24 md:h-32 md:w-32 rounded-full border-4 border-background bg-muted">
                    <AvatarImage src={company.logoUrl} alt={company.fullName} />
                    <AvatarFallback>{getInitials(company.fullName)}</AvatarFallback>
                </Avatar>
            </div>
            <CardHeader className="pt-4">
                <CardTitle className="text-2xl md:text-3xl font-headline">{job.jobIntroduction}</CardTitle>
                <CardDescription className="text-md md:text-lg">{company.fullName}</CardDescription>
            </CardHeader>
            <CardContent>
                <Separator className="my-4" />
                <div className="grid md:grid-cols-3 gap-8">
                    <div className="md:col-span-2 space-y-6">
                        <div>
                            <h3 className="text-xl font-semibold font-headline mb-2 flex items-center">
                                <Briefcase className="mr-3 h-5 w-5 text-accent" />
                                Qualifications
                            </h3>
                            <p className="text-muted-foreground whitespace-pre-wrap">{job.qualifications}</p>
                        </div>
                         <div>
                            <h3 className="text-xl font-semibold font-headline mb-2 flex items-center">
                                <FileText className="mr-3 h-5 w-5 text-accent" />
                                Required Documents
                            </h3>
                            <ul className="list-disc list-inside text-muted-foreground">
                                {requiredDocs.map(doc => <li key={doc}>{doc}</li>)}
                            </ul>
                        </div>
                    </div>
                    <div>
                         <Card className="bg-muted/50">
                            <CardHeader>
                                <CardTitle>Submit Your Application</CardTitle>
                                <CardDescription>Upload the required documents to apply for this position.</CardDescription>
                            </CardHeader>
                            <form onSubmit={handleSubmit}>
                                <CardContent className="space-y-4">
                                    {requiredDocs.map(doc => (
                                        <div key={doc} className="grid w-full max-w-sm items-center gap-1.5">
                                            <Label htmlFor={doc.toLowerCase().replace(/\s/g, '-')}>{doc}</Label>
                                            <Input id={doc.toLowerCase().replace(/\s/g, '-')} type="file" required />
                                        </div>
                                    ))}
                                </CardContent>
                                <CardFooter>
                                     <Button type="submit" className="w-full">
                                        <CheckCircle className="mr-2 h-4 w-4" />
                                        Submit Application
                                    </Button>
                                </CardFooter>
                            </form>
                         </Card>
                    </div>
                </div>
            </CardContent>
        </Card>
      </div>
  );
}
