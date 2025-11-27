
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Application, Job, User } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Building, Calendar, FileText, Info } from 'lucide-react';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';

// --- Static Data for UI/UX Development ---
const demoApplications: (Application & { job: Job, company: User })[] = [
    {
        id: 'app1',
        studentId: 'dev-student-id',
        jobId: 'job1',
        companyId: 'comp1',
        submissionDate: new Date(2024, 6, 15).toISOString(),
        status: 'Accepted',
        companyNote: 'Excellent profile! We would like to move forward. Please check your email for the next steps.',
        job: {
            id: 'job1',
            companyId: 'comp1',
            jobIntroduction: 'Software Engineer Intern',
            program: 'Computer Science',
            qualifications: 'React, Node.js',
            requiredDocuments: 'Resume'
        },
        company: {
            id: 'comp1',
            role: 'company',
            fullName: 'Tech Innovators Inc.',
            email: 'contact@tech-innovators.com'
        }
    },
    {
        id: 'app2',
        studentId: 'dev-student-id',
        jobId: 'job2',
        companyId: 'comp2',
        submissionDate: new Date(2024, 7, 1).toISOString(),
        status: 'Under Review',
        job: {
            id: 'job2',
            companyId: 'comp2',
            jobIntroduction: 'UI/UX Design Intern',
            program: 'Information Technology, Fine Arts',
            qualifications: 'Figma, Adobe XD',
            requiredDocuments: 'Resume, Portfolio'
        },
        company: {
            id: 'comp2',
            role: 'company',
            fullName: 'Future Solutions LLC',
            email: 'hr@future-solutions.com'
        }
    },
    {
        id: 'app3',
        studentId: 'dev-student-id',
        jobId: 'job3',
        companyId: 'comp3',
        submissionDate: new Date(2024, 5, 20).toISOString(),
        status: 'Rejected',
        companyNote: 'Thank you for your interest. While your qualifications are impressive, we have decided to move forward with other candidates whose experience more closely matches our needs at this time.',
        job: {
            id: 'job3',
            companyId: 'comp3',
            jobIntroduction: 'Data Analyst Intern',
            program: 'Statistics, Mathematics',
            qualifications: 'Python, SQL, R',
            requiredDocuments: 'Resume, Transcript'
        },
        company: {
            id: 'comp3',
            role: 'company',
            fullName: 'DataDriven Co.',
            email: 'careers@datadriven.co'
        }
    }
];
// --- End of Static Data ---

function ApplicationItem({ application }: { application: (Application & { job: Job, company: User }) }) {

    const getStatusVariant = (status: Application['status']) => {
        switch (status) {
            case 'Accepted':
                return 'default';
            case 'Rejected':
                return 'destructive';
            case 'Needs Resubmission':
                return 'secondary';
            case 'Under Review':
            default:
                return 'outline';
        }
    };
    
    const { job, company } = application;

    return (
        <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle className="text-xl font-headline">{job.jobIntroduction}</CardTitle>
                        <CardDescription className="flex items-center gap-2 pt-1">
                           <Building className="h-4 w-4" /> {company.fullName}
                        </CardDescription>
                    </div>
                     <Badge variant={getStatusVariant(application.status)}>{application.status}</Badge>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                 <Separator />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>Applied on: {format(new Date(application.submissionDate), "PPP")}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <FileText className="h-4 w-4" />
                        <span>Program: {job.program}</span>
                    </div>
                </div>
                {application.companyNote && (
                     <div className="p-3 rounded-md bg-muted/50 border text-sm">
                         <div className="flex items-center gap-2 font-semibold mb-2">
                            <Info className="h-4 w-4 text-accent" />
                            Note from {company.fullName}:
                         </div>
                        <p className="text-muted-foreground pl-6">{application.companyNote}</p>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}


export default function ApplicationsPage() {
    const applications = demoApplications;
    const isLoading = false;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>My Applications</CardTitle>
          <CardDescription>
            Track the status of all your internship applications here.
          </CardDescription>
        </CardHeader>
      </Card>

        {isLoading ? (
             <div className="space-y-4">
                <Skeleton className="h-40 w-full" />
                <Skeleton className="h-40 w-full" />
            </div>
        ) : applications && applications.length > 0 ? (
            <div className="space-y-4">
                {applications.map(app => (
                    <ApplicationItem key={app.id} application={app} />
                ))}
            </div>
        ) : (
             <Card>
                <CardContent className="pt-6">
                    <p className="text-center text-muted-foreground">You haven't applied to any jobs yet.</p>
                </CardContent>
            </Card>
        )}
    </div>
  );
}
