
'use client';

import { useMemo, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Application, Job, User } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Lightbulb, Loader2 } from 'lucide-react';
import { suggestApplicationStatus } from '@/ai/flows/suggest-application-status';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';

// --- Static Data for UI/UX Development ---
const demoJob: Job = { id: 'job1-1', companyId: 'dev-company-id', jobIntroduction: 'Software Engineer Intern', program: 'Computer Science', qualifications: 'Experience with React and Node.js', requiredDocuments: 'Resume, Transcript' };

const demoStudents: { [id: string]: User } = {
    'stud1': { id: 'stud1', fullName: 'Maria Dela Cruz', email: 'maria@example.com', role: 'student', programEnrolled: 'BS in Information Technology', region: 'Central Visayas' },
    'stud2': { id: 'stud2', fullName: 'Juanito Santos', email: 'juanito@example.com', role: 'student', programEnrolled: 'BS in Computer Science', region: 'Central Visayas' },
};

const demoApplications: Application[] = [
    { id: 'app1', studentId: 'stud1', jobId: 'job1-1', companyId: 'dev-company-id', submissionDate: '', status: 'Under Review' },
    { id: 'app2', studentId: 'stud2', jobId: 'job1-1', companyId: 'dev-company-id', submissionDate: '', status: 'Accepted' },
];
// --- End of Static Data ---

function StudentProfileModal({ student }: { student: User }) {
    const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').substring(0, 2);

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="link" className="p-0 h-auto">View Profile</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <div className="flex items-center gap-4">
                        <Avatar className="h-16 w-16">
                            <AvatarImage src={student.profilePictureUrl} alt={student.fullName} />
                            <AvatarFallback>{getInitials(student.fullName)}</AvatarFallback>
                        </Avatar>
                        <div>
                            <DialogTitle className="text-2xl">{student.fullName}</DialogTitle>
                            <DialogDescription>{student.email}</DialogDescription>
                        </div>
                    </div>
                </DialogHeader>
                <div className="space-y-4 py-4 text-sm">
                    <p><strong>Program:</strong> {student.programEnrolled || 'N/A'}</p>
                    <p><strong>Address:</strong> {student.address || 'N/A'}</p>
                    <p><strong>Region:</strong> {student.region || 'N/A'}</p>
                    <p><strong>Contact:</strong> {student.contactInfo || 'N/A'}</p>
                     <p><strong>Institutional Email:</strong> {student.institutionalEmail || 'N/A'}</p>
                    {/* In a real app, you would have links to view uploaded documents */}
                </div>
            </DialogContent>
        </Dialog>
    )
}

function ApplicationRow({ application, job }: { application: Application, job: Job }) {
    const { toast } = useToast();
    const student = demoStudents[application.studentId];
    const studentLoading = false;
    const [isSuggesting, setIsSuggesting] = useState(false);
    const [suggestion, setSuggestion] = useState<any>(null);

    const handleStatusChange = async (newStatus: Application['status']) => {
        toast({ title: 'Status Updated (Simulation)', description: `Application status set to ${newStatus}.` });
    };
    
    const handleGetSuggestion = async () => {
        if (!student || !job) return;
        setIsSuggesting(true);
        setSuggestion(null);
        try {
            const result = await suggestApplicationStatus({
                studentProfile: `Program: ${student.programEnrolled}. Region: ${student.region}.`,
                companyRequirements: `Program: ${job.program}. Qualifications: ${job.qualifications}.`,
                historicalData: "Historically, students from the same region with matching programs are accepted."
            });
            setSuggestion(result);
        } catch(e) {
            console.error(e);
            toast({ variant: 'destructive', title: 'AI Suggestion Failed' });
        } finally {
            setIsSuggesting(false);
        }
    }


    if (studentLoading) {
        return (
            <TableRow>
                <TableCell colSpan={4} className="text-center">Loading student...</TableCell>
            </TableRow>
        )
    }

    if (!student) return null;

    return (
        <>
            {/* Mobile Card View */}
            <div className="md:hidden">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">{student.fullName}</CardTitle>
                        <CardDescription>
                            <StudentProfileModal student={student} />
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                         <div className="space-y-1">
                            <p className="text-sm font-medium">Status</p>
                            <Select
                                defaultValue={application.status}
                                onValueChange={(newStatus: Application['status']) => handleStatusChange(newStatus)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Under Review">Under Review</SelectItem>
                                    <SelectItem value="Accepted">Accepted</SelectItem>
                                    <SelectItem value="Rejected">Rejected</SelectItem>
                                    <SelectItem value="Needs Resubmission">Needs Resubmission</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button variant="outline" className="w-full" onClick={handleGetSuggestion} disabled={isSuggesting}>
                                {isSuggesting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Lightbulb className="h-4 w-4" />}
                                    <span className="ml-2">AI Suggest Status</span>
                                </Button>
                            </DialogTrigger>
                             <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>AI Status Suggestion</DialogTitle>
                                </DialogHeader>
                                {isSuggesting && <div className="flex items-center justify-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div>}
                                {suggestion && (
                                    <div className="space-y-4">
                                        <p>Based on the data, we suggest the status:</p>
                                        <Badge>{suggestion.suggestedStatus}</Badge>
                                        <p className="font-semibold">Explanation:</p>
                                        <p className="text-sm text-muted-foreground p-4 bg-muted rounded-md">{suggestion.explanation}</p>
                                        <p className="text-sm">Confidence: {Math.round(suggestion.confidenceScore * 100)}%</p>
                                        <Button onClick={() => handleStatusChange(suggestion.suggestedStatus)}>Apply this status</Button>
                                    </div>
                                )}
                            </DialogContent>
                        </Dialog>
                    </CardContent>
                </Card>
            </div>
        
            {/* Desktop Table Row */}
            <TableRow className="hidden md:table-row">
                <TableCell>{student.fullName}</TableCell>
                <TableCell>
                    <StudentProfileModal student={student} />
                </TableCell>
                <TableCell>
                    <Select
                        defaultValue={application.status}
                        onValueChange={(newStatus: Application['status']) => handleStatusChange(newStatus)}
                    >
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Under Review">Under Review</SelectItem>
                            <SelectItem value="Accepted">Accepted</SelectItem>
                            <SelectItem value="Rejected">Rejected</SelectItem>
                            <SelectItem value="Needs Resubmission">Needs Resubmission</SelectItem>
                        </SelectContent>
                    </Select>
                </TableCell>
                <TableCell>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="ghost" size="sm" onClick={handleGetSuggestion} disabled={isSuggesting}>
                            {isSuggesting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Lightbulb className="h-4 w-4" />}
                                <span className="ml-2">AI Suggest</span>
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>AI Status Suggestion</DialogTitle>
                            </DialogHeader>
                            {isSuggesting && <div className="flex items-center justify-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div>}
                            {suggestion && (
                                <div className="space-y-4">
                                    <p>Based on the data, we suggest the status:</p>
                                    <Badge>{suggestion.suggestedStatus}</Badge>
                                    <p className="font-semibold">Explanation:</p>
                                    <p className="text-sm text-muted-foreground p-4 bg-muted rounded-md">{suggestion.explanation}</p>
                                    <p className="text-sm">Confidence: {Math.round(suggestion.confidenceScore * 100)}%</p>
                                    <Button onClick={() => handleStatusChange(suggestion.suggestedStatus)}>Apply this status</Button>
                                </div>
                            )}
                        </DialogContent>
                    </Dialog>
                </TableCell>
            </TableRow>
        </>
    )
}

export default function JobApplicationsPage({ params }: { params: { jobId: string } }) {
    const { jobId } = params;
    
    const job = demoJob;
    const applications = demoApplications.filter(app => app.jobId === jobId);
    
    const jobLoading = false;
    const appsLoading = false;

    const isLoading = jobLoading || appsLoading;

  return (
    <Card>
      <CardHeader>
        {job && <CardTitle>Applicants for: {job.jobIntroduction}</CardTitle>}
        {job && <CardDescription>Review and manage all applications submitted for this role.</CardDescription>}
        {isLoading && <Skeleton className="h-8 w-3/4" />}
      </CardHeader>
      <CardContent className="p-0 md:p-6">
        {/* Mobile View */}
        <div className="space-y-4 md:hidden p-4">
             {isLoading ? (
                <Skeleton className="h-32 w-full" />
            ) : applications && applications.length > 0 && job ? (
                applications.map(app => <ApplicationRow key={app.id} application={app} job={job} />)
            ) : (
                <div className="text-center text-muted-foreground pt-8">No applications received yet.</div>
            )}
        </div>

        {/* Desktop View */}
        <Table className="hidden md:table">
          <TableHeader>
            <TableRow>
              <TableHead>Student Name</TableHead>
              <TableHead>Profile</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
             {isLoading ? (
                <TableRow>
                    <TableCell colSpan={4} className="text-center">
                        <Skeleton className="h-24 w-full" />
                    </TableCell>
                </TableRow>
            ) : applications && applications.length > 0 && job ? (
                applications.map(app => <ApplicationRow key={app.id} application={app} job={job} />)
            ) : (
                <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground h-24">No applications received yet.</TableCell>
                </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
