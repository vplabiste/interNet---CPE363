
'use client';

import { useState, useMemo } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { User } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';
import { Loader2, Search, LayoutGrid, List, CheckCircle, FileText } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

// Static data for demonstration
const demoStudents: User[] = [
    { id: 'demo1', fullName: 'Maria Dela Cruz', email: 'maria.cruz@example.com', role: 'student', programEnrolled: 'BS in Information Technology', confirmed: false, profilePictureUrl: 'https://picsum.photos/seed/student1/100/100', schoolIdDocumentUrl: '#', transcriptUrl: '#', birthCertificateUrl: '#' },
    { id: 'demo2', fullName: 'Juanito Santos', email: 'juanito.santos@example.com', role: 'student', programEnrolled: 'BS in Computer Science', confirmed: false, profilePictureUrl: 'https://picsum.photos/seed/student2/100/100', schoolIdDocumentUrl: '#', transcriptUrl: '#', birthCertificateUrl: '#' },
    { id: 'demo3', fullName: 'Ana Gomez', email: 'ana.gomez@example.com', role: 'student', programEnrolled: 'BS in Business Administration', confirmed: true, profilePictureUrl: 'https://picsum.photos/seed/student3/100/100', schoolIdDocumentUrl: '#', transcriptUrl: '#', birthCertificateUrl: '#' },
    { id: 'demo4', fullName: 'Luis Reyes', email: 'luis.reyes@example.com', role: 'student', programEnrolled: 'BS in Marketing Management', confirmed: true, profilePictureUrl: 'https://picsum.photos/seed/student4/100/100', schoolIdDocumentUrl: '#', transcriptUrl: '#', birthCertificateUrl: '#' },
];


function StudentDocumentsModal({ student }: { student: User }) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant={student.confirmed ? 'outline' : 'default'} size="sm">View Documents</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Documents for {student.fullName}</DialogTitle>
                    <DialogDescription>Review the documents submitted by the student.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                    <a href={student.schoolIdDocumentUrl || '#'} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
                        <div className="flex items-center gap-3">
                            <FileText className="h-5 w-5 text-muted-foreground"/>
                            <span className="font-medium">School ID</span>
                        </div>
                        <Button variant="ghost" size="sm">View</Button>
                    </a>
                     <a href={student.transcriptUrl || '#'} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
                        <div className="flex items-center gap-3">
                            <FileText className="h-5 w-5 text-muted-foreground"/>
                            <span className="font-medium">Transcript of Records</span>
                        </div>
                        <Button variant="ghost" size="sm">View</Button>
                    </a>
                     <a href={student.birthCertificateUrl || '#'} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
                        <div className="flex items-center gap-3">
                            <FileText className="h-5 w-5 text-muted-foreground"/>
                            <span className="font-medium">Birth Certificate</span>
                        </div>
                        <Button variant="ghost" size="sm">View</Button>
                    </a>
                </div>
            </DialogContent>
        </Dialog>
    )
}


function StudentRow({ student }: { student: User }) {
  const { toast } = useToast();
  const [isToggling, setIsToggling] = useState(false);
  
  const handleVerificationToggle = (isConfirmed: boolean) => {
    setIsToggling(true);
    toast({
      title: 'UI-Only Action',
      description: `In a real app, ${student.fullName}'s status would be updated.`,
    });
    // Simulate API call
    setTimeout(() => {
        // In a real app, you would update the student object in the parent state.
        // For this demo, we can't mutate the prop directly.
        setIsToggling(false);
    }, 500);
  };
  
  const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').substring(0, 2);

  return (
    <TableRow className={student.confirmed ? 'bg-green-500/5' : ''}>
       <TableCell>
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={student.profilePictureUrl} />
            <AvatarFallback>{getInitials(student.fullName)}</AvatarFallback>
          </Avatar>
          <div className="font-medium">{student.fullName}</div>
        </div>
      </TableCell>
      <TableCell>{student.email}</TableCell>
      <TableCell>{student.programEnrolled}</TableCell>
      <TableCell>
        <div className="flex items-center space-x-2">
          <Switch
            id={`verification-switch-${student.id}`}
            checked={!!student.confirmed}
            onCheckedChange={handleVerificationToggle}
            disabled={isToggling}
            aria-label="Student Verification"
          />
          <Label htmlFor={`verification-switch-${student.id}`} className="flex items-center gap-1.5">
            {student.confirmed ? <><CheckCircle className="h-4 w-4 text-green-600" /> Verified</> : 'Unverified'}
          </Label>
           {isToggling && <Loader2 className="h-4 w-4 animate-spin" />}
        </div>
      </TableCell>
       <TableCell>
          <StudentDocumentsModal student={student} />
      </TableCell>
    </TableRow>
  );
}

function StudentCard({ student }: { student: User }) {
  const { toast } = useToast();
  const [isToggling, setIsToggling] = useState(false);

  const handleVerificationToggle = (isConfirmed: boolean) => {
    setIsToggling(true);
    toast({
      title: 'UI-Only Action',
      description: `In a real app, ${student.fullName}'s status would be updated.`,
    });
    setTimeout(() => setIsToggling(false), 500);
  };
  
  const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').substring(0, 2);

  return (
    <Card className={student.confirmed ? 'border-green-500/50' : ''}>
      <CardHeader>
        <div className="flex items-center gap-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={student.profilePictureUrl} alt={student.fullName} />
            <AvatarFallback>{getInitials(student.fullName)}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle>{student.fullName}</CardTitle>
            <CardDescription>{student.email}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">Program:</span> {student.programEnrolled}
        </p>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Switch
            id={`verification-card-${student.id}`}
            checked={!!student.confirmed}
            onCheckedChange={handleVerificationToggle}
            disabled={isToggling}
            aria-label="Student Verification"
          />
          <Label htmlFor={`verification-card-${student.id}`} className="flex items-center gap-1.5">
            {student.confirmed ? <><CheckCircle className="h-4 w-4 text-green-600" /> Verified</> : 'Unverified'}
          </Label>
          {isToggling && <Loader2 className="h-4 w-4 animate-spin" />}
        </div>
         <StudentDocumentsModal student={student} />
      </CardFooter>
    </Card>
  )
}

export default function SchoolStudentsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [layout, setLayout] = useState<'list' | 'grid'>('list');

  // We use the static demoStudents for UI purposes
  const students = demoStudents;
  const isLoading = false; // Set to false as we are using static data

  const filteredStudents = useMemo(() => {
    if (!students) return { pending: [], verified: [] };
    
    const lowercasedFilter = searchTerm.toLowerCase();
    
    const filtered = students.filter(student =>
      (student.fullName?.toLowerCase() ?? '').includes(lowercasedFilter) ||
      (student.email?.toLowerCase() ?? '').includes(lowercasedFilter) ||
      (student.programEnrolled?.toLowerCase() ?? '').includes(lowercasedFilter)
    );

    return {
      pending: filtered.filter(s => !s.confirmed),
      verified: filtered.filter(s => s.confirmed),
    }

  }, [students, searchTerm]);


  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage Student Verifications</CardTitle>
        <CardDescription>
          Verify the enrollment of students who have registered under your
          school.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center gap-4">
            <div className="relative w-full max-w-sm">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                    placeholder="Search by name, email, or program..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <div className="flex items-center gap-2">
                 <Button variant={layout === 'list' ? 'default': 'outline'} size="icon" onClick={() => setLayout('list')}>
                    <List className="h-4 w-4" />
                </Button>
                 <Button variant={layout === 'grid' ? 'default': 'outline'} size="icon" onClick={() => setLayout('grid')}>
                    <LayoutGrid className="h-4 w-4" />
                </Button>
            </div>
        </div>
         <Tabs defaultValue="pending">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="pending">Pending ({isLoading ? '...' : filteredStudents.pending.length})</TabsTrigger>
            <TabsTrigger value="verified">Verified ({isLoading ? '...' : filteredStudents.verified.length})</TabsTrigger>
          </TabsList>
          <TabsContent value="pending">
             {layout === 'list' ? (
                <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Program</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {isLoading ? (
                    <TableRow>
                        <TableCell colSpan={5} className="h-24 text-center">
                        <Loader2 className="mx-auto h-8 w-8 animate-spin text-muted-foreground" />
                        </TableCell>
                    </TableRow>
                    ) : filteredStudents.pending.length > 0 ? (
                    filteredStudents.pending.map(student => (
                        <StudentRow key={student.id} student={student} />
                    ))
                    ) : (
                    <TableRow>
                        <TableCell
                        colSpan={5}
                        className="text-center text-muted-foreground pt-8"
                        >
                        No pending students found.
                        </TableCell>
                    </TableRow>
                    )}
                </TableBody>
                </Table>
             ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4">
                     {isLoading ? (
                        Array.from({length:3}).map((_, i) => <Skeleton key={i} className="h-60" />)
                     ) : filteredStudents.pending.length > 0 ? (
                        filteredStudents.pending.map(student => (
                            <StudentCard key={student.id} student={student} />
                        ))
                     ) : (
                        <p className="col-span-full text-center text-muted-foreground pt-8">No pending students found.</p>
                     )}
                </div>
             )}
          </TabsContent>
          <TabsContent value="verified">
             {layout === 'list' ? (
                <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Program</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {isLoading ? (
                    <TableRow>
                        <TableCell colSpan={5} className="h-24 text-center">
                        <Loader2 className="mx-auto h-8 w-8 animate-spin text-muted-foreground" />
                        </TableCell>
                    </TableRow>
                    ) : filteredStudents.verified.length > 0 ? (
                    filteredStudents.verified.map(student => (
                        <StudentRow key={student.id} student={student} />
                    ))
                    ) : (
                    <TableRow>
                        <TableCell
                        colSpan={5}
                        className="text-center text-muted-foreground pt-8"
                        >
                        No verified students found.
                        </TableCell>
                    </TableRow>
                    )}
                </TableBody>
                </Table>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4">
                     {isLoading ? (
                        Array.from({length:3}).map((_, i) => <Skeleton key={i} className="h-60" />)
                     ) : filteredStudents.verified.length > 0 ? (
                        filteredStudents.verified.map(student => (
                            <StudentCard key={student.id} student={student} />
                        ))
                     ) : (
                        <p className="col-span-full text-center text-muted-foreground pt-8">No verified students found.</p>
                     )}
                </div>
              )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
