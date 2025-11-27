'use client';
import { useMemo } from 'react';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { PlusCircle, Briefcase, Users } from 'lucide-react';
import { Application } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

export default function CompanyDashboardPage() {
    const { user } = useUser();
    const firestore = useFirestore();

    const jobsQuery = useMemoFirebase(
      () => user ? query(collection(firestore, 'jobs'), where('companyId', '==', user.uid)) : null,
      [user, firestore]
    );
    const {data: jobs, isLoading: jobsLoading} = useCollection(jobsQuery);

    const jobIds = useMemo(() => jobs?.map(j => j.id) || [], [jobs]);

    const applicationsQuery = useMemoFirebase(
        () => (jobIds.length > 0 && firestore) ? query(collection(firestore, 'applications'), where('jobId', 'in', jobIds)) : null,
        [jobIds, firestore]
      );
    const {data: applications, isLoading: appsLoading} = useCollection<Application>(applicationsQuery);

    const uniqueApplicants = applications ? new Set(applications.map(app => app.studentId)).size : 0;

    const isLoading = jobsLoading || appsLoading;

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Welcome, {user?.displayName || 'Company Rep'}!</CardTitle>
                    <CardDescription>Manage your company profile, job postings, and applications.</CardDescription>
                </CardHeader>
            </Card>

            <div className="grid gap-4 md:grid-cols-2">
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Job Postings</CardTitle>
                        <Briefcase className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        {isLoading ? <Skeleton className="h-8 w-1/4" /> : <div className="text-2xl font-bold">{jobs?.length || 0}</div>}
                        <p className="text-xs text-muted-foreground">
                            Total job postings you have created.
                        </p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Applicants</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                       {isLoading ? <Skeleton className="h-8 w-1/4" /> : <div className="text-2xl font-bold">{uniqueApplicants}</div>}
                        <p className="text-xs text-muted-foreground">
                            Unique students who applied to your jobs.
                        </p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex justify-between items-start">
                        <div>
                            <CardTitle>Manage Job Postings</CardTitle>
                            <CardDescription>Create and manage your internship opportunities.</CardDescription>
                        </div>
                        <Button asChild>
                            <Link href="/company/dashboard/jobs">
                                View All Postings
                            </Link>
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">Click the button above to view, edit, or create new job postings.</p>
                </CardContent>
            </Card>
        </div>
    )
}
