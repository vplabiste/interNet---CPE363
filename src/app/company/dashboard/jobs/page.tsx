
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Job, Application } from '@/lib/types';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { PlusCircle, ArrowRight, Users } from 'lucide-react';
import { useMemo } from 'react';

// --- Static Data for UI/UX Development ---
const demoJobs: Job[] = [
    { id: 'job1-1', companyId: 'dev-company-id', jobIntroduction: 'Software Engineer Intern', program: 'Computer Science', qualifications: 'Experience with React and Node.js', requiredDocuments: 'Resume, Transcript' },
    { id: 'job1-2', companyId: 'dev-company-id', jobIntroduction: 'Data Science Intern', program: 'Data Science, Statistics', qualifications: 'Python, Pandas, Scikit-learn', requiredDocuments: 'Resume, Cover Letter' }
];

const demoApplications: Application[] = [
    { id: 'app1', studentId: 'stud1', jobId: 'job1-1', companyId: 'dev-company-id', submissionDate: '', status: 'Under Review' },
    { id: 'app2', studentId: 'stud2', jobId: 'job1-1', companyId: 'dev-company-id', submissionDate: '', status: 'Accepted' },
    { id: 'app3', studentId: 'stud3', jobId: 'job1-2', companyId: 'dev-company-id', submissionDate: '', status: 'Rejected' },
];
// --- End of Static Data ---


function JobCard({ job }: { job: Job }) {
    const applicantsForJob = useMemo(() => {
        return demoApplications.filter(app => app.jobId === job.id);
    }, [job.id]);

    const isLoading = false; // Using static data

    return (
        <Card key={job.id}>
            <CardHeader>
                <CardTitle>{job.jobIntroduction}</CardTitle>
                <CardDescription>{job.program}</CardDescription>
            </CardHeader>
            <CardContent>
                 <div className="flex items-center text-sm text-muted-foreground">
                    <Users className="mr-2 h-4 w-4" />
                    {isLoading ? "Loading..." : `${applicantsForJob?.length || 0} Applicants`}
                 </div>
            </CardContent>
            <CardFooter>
                <Button asChild variant="secondary" size="sm">
                    <Link href={`/company/dashboard/jobs/${job.id}/applications`}>
                        View Applicants <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                </Button>
            </CardFooter>
        </Card>
    );
}


export default function CompanyJobsPage() {
    const jobs = demoJobs;
    const jobsLoading = false;

    return (
        <Card>
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle>Manage Job Postings</CardTitle>
                        <CardDescription>View, edit, or create new internship postings.</CardDescription>
                    </div>
                    <Button asChild>
                        <Link href="/company/dashboard/jobs/new">
                            <PlusCircle className="mr-2 h-4 w-4" />
                            New Posting
                        </Link>
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                {jobsLoading ? (
                    <p>Loading jobs...</p>
                ) : jobs && jobs.length > 0 ? (
                    <div className="space-y-4">
                        {jobs.map(job => (
                            <JobCard key={job.id} job={job} />
                        ))}
                    </div>
                ) : (
                    <p className="text-sm text-muted-foreground">No job postings found. Create one to get started.</p>
                )}
            </CardContent>
        </Card>
    )
}
