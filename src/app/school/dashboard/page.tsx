'use client';
import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { doc, collection, query, where } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { X, GraduationCap, UserCheck, Loader2, Building, CheckCircle, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { updateDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { Skeleton } from '@/components/ui/skeleton';
import { User } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

function SchoolStats() {
    const { user } = useUser();
    const firestore = useFirestore();

    const studentsQuery = useMemoFirebase(
      () => user ? query(collection(firestore, 'students'), where('schoolId', '==', user.uid)) : null,
      [user, firestore]
    );
    const {data: students, isLoading: studentsLoading } = useCollection<User>(studentsQuery);
    
    const stats = useMemo(() => {
        if (!students) return { verified: 0, pending: 0, total: 0 };
        const verified = students.filter(s => s.confirmed).length;
        const pending = students.length - verified;
        return { verified, pending, total: students.length };
    }, [students]);

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                    <GraduationCap className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    {studentsLoading ? <Skeleton className="h-8 w-1/4" /> : <div className="text-2xl font-bold">{stats.total}</div>}
                    <p className="text-xs text-muted-foreground">
                        Students registered with your school.
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Verified Students</CardTitle>
                    <UserCheck className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    {studentsLoading ? <Skeleton className="h-8 w-1/4" /> : <div className="text-2xl font-bold">{stats.verified}</div>}
                    <p className="text-xs text-muted-foreground">
                        Total students confirmed by you.
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Pending Verifications</CardTitle>
                    <Loader2 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    {studentsLoading ? <Skeleton className="h-8 w-1/4" /> : <div className="text-2xl font-bold">{stats.pending}</div>}
                    <p className="text-xs text-muted-foreground">
                        Students awaiting enrollment verification.
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}

const recentVerifications = [
    { name: 'Maria Dela Cruz', program: 'BS in Information Technology', avatar: 'https://picsum.photos/seed/student1/100/100' },
    { name: 'Juanito Santos', program: 'BS in Computer Science', avatar: 'https://picsum.photos/seed/student2/100/100' },
    { name: 'Ana Gomez', program: 'BS in Business Administration', avatar: 'https://picsum.photos/seed/student3/100/100' },
];

const companyPartners = [
    { 
        name: 'Tech Innovators Inc.', 
        logo: 'https://picsum.photos/seed/comp1/100/100', 
        description: 'A leading company in AI and machine learning solutions, driving the future of technology.',
        jobs: [
            { title: 'AI/ML Intern', connectedProgram: 'BS in Computer Science' },
            { title: 'Frontend Developer Intern', connectedProgram: 'BS in Information Technology' },
        ]
    },
    { 
        name: 'Future Solutions LLC', 
        logo: 'https://picsum.photos/seed/comp2/100/100', 
        description: 'Specializing in sustainable energy and green tech to build a better planet.',
        jobs: [
            { title: 'Business Analyst Intern', connectedProgram: 'BS in Business Administration' }
        ]
    },
    { 
        name: 'Cybernetics Corp', 
        logo: 'https://picsum.photos/seed/comp3/100/100', 
        description: 'Pioneers in robotics and automated systems for industrial and consumer markets.',
        jobs: [
             { title: 'Robotics Engineering Intern', connectedProgram: 'BS in Computer Engineering' }
        ]
    },
];

function CompanyPartnerModal({ company }: { company: typeof companyPartners[0] }) {
    const [showJobs, setShowJobs] = useState(false);
    return (
        <Dialog onOpenChange={(open) => !open && setShowJobs(false)}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="ml-auto">View</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader className="items-center text-center">
                    <Avatar className="h-20 w-20 mb-2">
                        <AvatarImage src={company.logo} alt={company.name} />
                        <AvatarFallback>{company.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <DialogTitle className="text-2xl">{company.name}</DialogTitle>
                    <DialogDescription>{company.description}</DialogDescription>
                </DialogHeader>
                {!showJobs && (
                    <div className="text-center p-4">
                        <Button onClick={() => setShowJobs(true)}>View Jobs</Button>
                    </div>
                )}
                {showJobs && (
                    <div className="pt-4">
                        <h3 className="text-lg font-semibold mb-2 text-center">Available Positions</h3>
                         <Accordion type="single" collapsible className="w-full">
                            {company.jobs.map((job, index) => (
                                <AccordionItem value={`item-${index}`} key={index}>
                                    <AccordionTrigger>{job.title}</AccordionTrigger>
                                    <AccordionContent>
                                       <div className="text-sm">
                                            <p><span className="font-semibold">Connected Program:</span> {job.connectedProgram}</p>
                                            <p className="mt-2 text-muted-foreground">This is a great opportunity for students in the specified program to gain industry experience.</p>
                                       </div>
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    )
}


export default function SchoolDashboardPage() {
    const { userData, isLoading } = useUser();
    
    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    {isLoading ? (
                        <div className="space-y-2">
                            <Skeleton className="h-8 w-1/2" />
                            <Skeleton className="h-4 w-3/4" />
                        </div>
                    ) : (
                        <>
                         <CardTitle>Welcome, {userData?.fullName || 'School Admin'}!</CardTitle>
                         <CardDescription>Manage your school's programs, student verifications, and company partnerships.</CardDescription>
                        </>
                    )}
                </CardHeader>
            </Card>

            <SchoolStats />

            <div className="grid gap-6 lg:grid-cols-2">
                 <Card>
                    <CardHeader>
                        <CardTitle>Recent Verifications</CardTitle>
                        <CardDescription>Students you have recently verified.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {recentVerifications.map((student, index) => (
                                <div key={index} className="flex items-center">
                                    <Avatar className="h-9 w-9">
                                        <AvatarImage src={student.avatar} alt="Avatar" />
                                        <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div className="ml-4 space-y-1">
                                        <p className="text-sm font-medium leading-none">{student.name}</p>
                                        <p className="text-sm text-muted-foreground">{student.program}</p>
                                    </div>
                                    <div className="ml-auto text-sm text-muted-foreground flex items-center gap-2">
                                        <CheckCircle className="h-4 w-4 text-green-500" />
                                        Verified
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                    <CardFooter>
                         <Button className="w-full" asChild>
                             <Link href="/school/dashboard/students">View All Students</Link>
                         </Button>
                    </CardFooter>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle>Company Partners</CardTitle>
                        <CardDescription>Companies that have hired your students.</CardDescription>
                    </CardHeader>
                    <CardContent>
                         <div className="space-y-4">
                            {companyPartners.map((company, index) => (
                                <div key={index} className="flex items-center">
                                    <Avatar className="h-9 w-9">
                                        <AvatarImage src={company.logo} alt="Avatar" />
                                        <AvatarFallback>{company.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div className="ml-4 space-y-1">
                                        <p className="text-sm font-medium leading-none">{company.name}</p>
                                    </div>
                                    <CompanyPartnerModal company={company} />
                                </div>
                            ))}
                        </div>
                    </CardContent>
                     <CardFooter>
                         <Button className="w-full" variant="secondary">Manage Partnerships</Button>
                    </CardFooter>
                </Card>

            </div>
        </div>
    )
}
