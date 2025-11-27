
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { User, Job } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { useState, useMemo } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight, Briefcase, MapPin, Search } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

// --- Static Data for UI/UX Development ---
const demoCompanies: User[] = [
    {
        id: 'comp1',
        role: 'company',
        fullName: 'Tech Innovators Inc.',
        email: 'contact@tech-innovators.com',
        logoUrl: 'https://picsum.photos/seed/comp1/100/100',
        shortIntroduction: 'A leading company in AI and machine learning solutions, driving the future of technology and fostering new talent through our competitive internship programs.'
    },
    {
        id: 'comp2',
        role: 'company',
        fullName: 'Future Solutions LLC',
        email: 'hr@future-solutions.com',
        logoUrl: 'https://picsum.photos/seed/comp2/100/100',
        shortIntroduction: 'Specializing in sustainable energy and green tech to build a better planet. We are looking for passionate students to join our cause.'
    },
    {
        id: 'comp3',
        role: 'company',
        fullName: 'Creative Minds Agency',
        email: 'hello@creativeminds.com',
        logoUrl: 'https://picsum.photos/seed/comp3/100/100',
        shortIntroduction: 'A full-service digital marketing and design agency. We help brands tell their story in a compelling way. Join us to unleash your creativity.'
    },
    {
        id: 'comp4',
        role: 'company',
        fullName: 'Global Connect Logistics',
        email: 'careers@gcl.com',
        logoUrl: 'https://picsum.photos/seed/comp4/100/100',
        shortIntroduction: 'The backbone of global trade. We offer internships in supply chain management, logistics, and international business operations.'
    }
];

const allJobs = [
    { id: 'job1-1', companyId: 'comp1', companyName: 'Tech Innovators Inc.', companyLogo: 'https://picsum.photos/seed/comp1/100/100', jobIntroduction: 'Software Engineer Intern', program: 'Computer Science', qualifications: 'Experience with React and Node.js', requiredDocuments: 'Resume, Transcript of Records', location: 'Cebu City', type: 'Full-time' },
    { id: 'job1-2', companyId: 'comp1', companyName: 'Tech Innovators Inc.', companyLogo: 'https://picsum.photos/seed/comp1/100/100', jobIntroduction: 'Data Science Intern', program: 'Data Science, Statistics', qualifications: 'Python, Pandas, Scikit-learn', requiredDocuments: 'Resume, Cover Letter', location: 'Remote', type: 'Part-time' },
    { id: 'job2-1', companyId: 'comp2', companyName: 'Future Solutions LLC', companyLogo: 'https://picsum.photos/seed/comp2/100/100', jobIntroduction: 'Mechanical Engineer Intern', program: 'Mechanical Engineering', qualifications: 'CAD software (SolidWorks, AutoCAD)', requiredDocuments: 'Resume', location: 'Manila', type: 'Full-time' },
    { id: 'job3-1', companyId: 'comp3', companyName: 'Creative Minds Agency', companyLogo: 'https://picsum.photos/seed/comp3/100/100', jobIntroduction: 'Graphic Design Intern', program: 'Fine Arts, Multimedia Arts', qualifications: 'Adobe Creative Suite (Photoshop, Illustrator)', requiredDocuments: 'Portfolio', location: 'Remote', type: 'Part-time' },
    { id: 'job4-1', companyId: 'comp4', companyName: 'Global Connect Logistics', companyLogo: 'https://picsum.photos/seed/comp4/100/100', jobIntroduction: 'Logistics Coordinator Intern', program: 'Business Administration, Supply Chain', qualifications: 'MS Excel, strong organizational skills', requiredDocuments: 'Resume', location: 'Cebu City', type: 'Full-time' },
];

// --- End of Static Data ---

function CompaniesBrowser() {
    const [searchTerm, setSearchTerm] = useState('');
    const companies = demoCompanies;
    const isLoading = false;

    const filteredCompanies = useMemo(() => {
        if (!companies) return [];
        return companies.filter(company => 
            company.fullName.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [companies, searchTerm]);

    const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').substring(0, 2);

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Browse Companies</CardTitle>
                    <CardDescription>
                    Discover and search for companies offering internships.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input 
                            placeholder="Search for a company..."
                            className="pl-8"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </CardContent>
            </Card>

            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <Skeleton className="h-48 w-full" />
                    <Skeleton className="h-48 w-full" />
                    <Skeleton className="h-48 w-full" />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCompanies?.map(company => (
                        <Card key={company.id} className="flex flex-col">
                            <CardHeader className="flex-row items-center gap-4">
                                 <Avatar className="h-12 w-12">
                                    <AvatarImage src={company.logoUrl} alt={company.fullName} />
                                    <AvatarFallback>{getInitials(company.fullName)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <CardTitle>{company.fullName}</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent className="flex-grow">
                                <p className="text-sm text-muted-foreground line-clamp-3">{company.shortIntroduction || 'No introduction provided.'}</p>
                            </CardContent>
                            <CardFooter>
                                <Button variant="outline" className="w-full" asChild>
                                    <Link href={`/student/dashboard/companies/${company.id}`}>
                                        View Profile <ArrowRight className="ml-2 h-4 w-4" />
                                    </Link>
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}

function JobsBrowser() {
    const [searchTerm, setSearchTerm] = useState('');
    const [locationFilter, setLocationFilter] = useState('all');
    const [typeFilter, setTypeFilter] = useState('all');
    const jobs = allJobs;
    const isLoading = false;
    
    const filteredJobs = useMemo(() => {
        if (!jobs) return [];
        return jobs.filter(job => {
            const matchesSearch = job.jobIntroduction.toLowerCase().includes(searchTerm.toLowerCase()) || job.companyName.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesLocation = locationFilter === 'all' || job.location === locationFilter;
            const matchesType = typeFilter === 'all' || job.type === typeFilter;
            return matchesSearch && matchesLocation && matchesType;
        });
    }, [jobs, searchTerm, locationFilter, typeFilter]);

    return (
         <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Browse Internships</CardTitle>
                    <CardDescription>
                    Search and filter for internship opportunities.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input 
                            placeholder="Search for a job title or company..."
                            className="pl-8"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Select value={locationFilter} onValueChange={setLocationFilter}>
                            <SelectTrigger>
                                <SelectValue placeholder="Filter by location" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Locations</SelectItem>
                                <SelectItem value="Remote">Remote</SelectItem>
                                <SelectItem value="Cebu City">Cebu City</SelectItem>
                                <SelectItem value="Manila">Manila</SelectItem>
                            </SelectContent>
                        </Select>
                         <Select value={typeFilter} onValueChange={setTypeFilter}>
                            <SelectTrigger>
                                <SelectValue placeholder="Filter by job type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Types</SelectItem>
                                <SelectItem value="Full-time">Full-time</SelectItem>
                                <SelectItem value="Part-time">Part-time</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

             {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Skeleton className="h-48 w-full" />
                    <Skeleton className="h-48 w-full" />
                </div>
            ) : filteredJobs.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredJobs.map(job => (
                        <Card key={job.id} className="flex flex-col">
                            <CardHeader>
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <CardTitle className="text-lg">{job.jobIntroduction}</CardTitle>
                                        <CardDescription className="pt-1">{job.companyName}</CardDescription>
                                    </div>
                                    <Avatar className="h-10 w-10 border">
                                        <AvatarImage src={job.companyLogo} />
                                        <AvatarFallback>{job.companyName.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                </div>
                            </CardHeader>
                            <CardContent className="flex-grow space-y-3">
                                 <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <MapPin className="h-4 w-4" /> {job.location}
                                </div>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Briefcase className="h-4 w-4" /> {job.type}
                                </div>
                                <div className="flex flex-wrap gap-2">
                                     <Badge variant="secondary">{job.program}</Badge>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button className="w-full" asChild>
                                    <Link href={`/student/dashboard/jobs/${job.id}`}>View & Apply</Link>
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            ) : (
                <Card>
                    <CardContent className="p-8 text-center text-muted-foreground">
                        No job postings match your current filters.
                    </CardContent>
                </Card>
            )}
        </div>
    );
}

export default function CompaniesAndJobsPage() {
  return (
      <Tabs defaultValue="companies" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="companies">Browse Companies</TabsTrigger>
            <TabsTrigger value="jobs">Browse Jobs</TabsTrigger>
        </TabsList>
        <TabsContent value="companies" className="mt-6">
            <CompaniesBrowser />
        </TabsContent>
        <TabsContent value="jobs" className="mt-6">
            <JobsBrowser />
        </TabsContent>
      </Tabs>
  );
}

    