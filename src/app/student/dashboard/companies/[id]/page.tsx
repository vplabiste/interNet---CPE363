
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
import { Briefcase, MapPin, Building2, ExternalLink, ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

// --- Static Data for UI/UX Development ---
const demoCompanies: { [key: string]: User & { jobs: Job[] } } = {
    'comp1': {
        id: 'comp1',
        role: 'company',
        fullName: 'Tech Innovators Inc.',
        email: 'contact@tech-innovators.com',
        logoUrl: 'https://picsum.photos/seed/comp1/200/200',
        headerImageUrl: 'https://picsum.photos/seed/header1/1200/400',
        shortIntroduction: 'A leading company in AI and machine learning solutions, driving the future of technology and fostering new talent through our competitive internship programs.',
        jobs: [
            { id: 'job1-1', companyId: 'comp1', jobIntroduction: 'Software Engineer Intern', program: 'Computer Science', qualifications: 'Experience with React and Node.js', requiredDocuments: 'Resume, Transcript' },
            { id: 'job1-2', companyId: 'comp1', jobIntroduction: 'Data Science Intern', program: 'Data Science, Statistics', qualifications: 'Python, Pandas, Scikit-learn', requiredDocuments: 'Resume, Cover Letter' }
        ]
    },
    'comp2': {
        id: 'comp2',
        role: 'company',
        fullName: 'Future Solutions LLC',
        email: 'hr@future-solutions.com',
        logoUrl: 'https://picsum.photos/seed/comp2/200/200',
        headerImageUrl: 'https://picsum.photos/seed/header2/1200/400',
        shortIntroduction: 'Specializing in sustainable energy and green tech to build a better planet. We are looking for passionate students to join our cause.',
        jobs: [
             { id: 'job2-1', companyId: 'comp2', jobIntroduction: 'Mechanical Engineer Intern', program: 'Mechanical Engineering', qualifications: 'CAD software (SolidWorks, AutoCAD)', requiredDocuments: 'Resume' }
        ]
    }
};
// --- End of Static Data ---

export default function CompanyProfilePage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const company = demoCompanies[params.id] || Object.values(demoCompanies)[0]; // Fallback to first company
    const isLoading = false; // Set to false since we're using static data

    const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').substring(0, 2);

    if (isLoading) {
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
            Back to Companies
        </Button>
        <Card className="overflow-hidden">
            <div className="relative h-48 w-full bg-muted">
                {company.headerImageUrl && (
                    <Image 
                        src={company.headerImageUrl} 
                        alt={`${company.fullName} header`} 
                        fill
                        className="object-cover"
                    />
                )}
            </div>
            <div className="flex items-end -mt-20 ml-8">
                <Avatar className="h-32 w-32 rounded-full border-4 border-background">
                    <AvatarImage src={company.logoUrl} alt={company.fullName} />
                    <AvatarFallback>{getInitials(company.fullName)}</AvatarFallback>
                </Avatar>
            </div>
            <CardHeader className="pt-4">
                <CardTitle className="text-3xl font-headline">{company.fullName}</CardTitle>
                <CardDescription>{company.shortIntroduction}</CardDescription>
                <div className="flex gap-4 pt-2">
                    <Button>Follow</Button>
                    <Button variant="outline" asChild>
                        <a href="#" target="_blank" rel="noopener noreferrer">
                            Visit Website <ExternalLink className="ml-2 h-4 w-4" />
                        </a>
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <Separator className="my-4" />
                 <div>
                    <h3 className="text-xl font-semibold font-headline mb-4 flex items-center">
                        <Briefcase className="mr-3 h-5 w-5 text-accent" />
                        Open Internships ({company.jobs.length})
                    </h3>
                    <div className="space-y-4">
                        {company.jobs.map(job => (
                            <Card key={job.id} className="hover:bg-muted/50 transition-colors">
                                <CardHeader>
                                    <CardTitle className="text-lg">{job.jobIntroduction}</CardTitle>
                                    <CardDescription>Relevant Program: {job.program}</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm font-medium">Qualifications:</p>
                                    <p className="text-sm text-muted-foreground">{job.qualifications}</p>
                                </CardContent>
                                <CardFooter>
                                    <Button>Apply Now</Button>
                                </CardFooter>
                            </Card>
                        ))}
                         {company.jobs.length === 0 && (
                            <p className="text-sm text-muted-foreground text-center py-4">This company has no open internships at the moment.</p>
                         )}
                    </div>
                 </div>
            </CardContent>
        </Card>
      </div>
  );
}
