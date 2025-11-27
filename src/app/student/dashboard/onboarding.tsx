
'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { signOut } from 'firebase/auth';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Upload, LogOut } from 'lucide-react';
import { User } from '@/lib/types';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/firebase';

// --- Static Data for UI/UX Development ---
const demoSchools: User[] = [
    { id: 'school1', fullName: 'Cebu Institute of Technology', role: 'school', email: 'info@cit.edu', programs: ['BS in Computer Science', 'BS in Information Technology', 'BS in Computer Engineering'] },
    { id: 'school2', fullName: 'University of San Carlos', role: 'school', email: 'info@usc.edu.ph', programs: ['BS in Business Administration', 'BS in Accountancy', 'BS in Marketing Management'] },
    { id: 'school3', fullName: 'University of the Philippines Cebu', role: 'school', email: 'info@upcebu.edu.ph', programs: ['BA in Political Science', 'BS in Biology', 'BA in Communication'] },
];
// --- End of Static Data ---


const personalInfoSchema = z.object({
  address: z.string().min(1, 'Address is required'),
  region: z.string().min(1, 'Region is required'),
  contactInfo: z.string().min(1, 'Contact number is required'),
  profilePicture: z.any().optional(),
});

const schoolInfoSchema = z.object({
  schoolId: z.string().min(1, 'Please select your school'),
  programEnrolled: z.string().min(1, 'Program is required'),
  institutionalEmail: z.string().email('Invalid email address'),
});

const documentSchema = z.object({
  schoolIdDocument: z.any().optional(),
  transcript: z.any().optional(),
  birthCertificate: z.any().optional(),
});

const formSchemas = [personalInfoSchema, schoolInfoSchema, documentSchema];

type FormData = z.infer<typeof personalInfoSchema> &
  z.infer<typeof schoolInfoSchema> &
  z.infer<typeof documentSchema>;

const philippineRegions = [
  'National Capital Region (NCR)',
  'Cordillera Administrative Region (CAR)',
  'Ilocos Region (Region I)',
  'Cagayan Valley (Region II)',
  'Central Luzon (Region III)',
  'CALABARZON (Region IV-A)',
  'MIMAROPA Region (Region IV-B)',
  'Bicol Region (Region V)',
  'Western Visayas (Region VI)',
  'Central Visayas (Region VII)',
  'Eastern Visayas (Region VIII)',
  'Zamboanga Peninsula (Region IX)',
  'Northern Mindanao (Region X)',
  'Davao Region (Region XI)',
  'SOCCSKSARGEN (Region XII)',
  'Caraga (Region XIII)',
  'Bangsamoro Autonomous Region in Muslim Mindanao (BARMM)',
];

interface OnboardingPageProps {
  onOnboardingComplete: () => void;
}

export default function OnboardingPage({ onOnboardingComplete }: OnboardingPageProps) {
  const [step, setStep] = useState(0);
  const router = useRouter();
  const auth = useAuth();
  const { toast } = useToast();
  
  // Use static data
  const schools = demoSchools;
  const schoolsLoading = false;

  const currentSchema = formSchemas[step];
  const form = useForm({
    resolver: zodResolver(currentSchema),
    defaultValues: {
      address: '',
      region: '',
      contactInfo: '',
      profilePicture: null,
      schoolId: '',
      programEnrolled: '',
      institutionalEmail: '',
      schoolIdDocument: null,
      transcript: null,
      birthCertificate: null,
    },
  });

  const selectedSchoolId = useWatch({ control: form.control, name: 'schoolId' });
  const selectedSchoolData = useMemo(() => {
    return schools?.find(s => s.id === selectedSchoolId);
  }, [schools, selectedSchoolId]);
  
  const onSubmit = (data: Partial<FormData>) => {
    if (step < formSchemas.length - 1) {
      setStep(prev => prev + 1);
    } else {
      // This is the final step, call the completion handler
      console.log("Onboarding data (simulation):", form.getValues());
      toast({
        title: 'Onboarding Complete!',
        description: 'Your profile has been created. You can now explore the dashboard.',
      });
      onOnboardingComplete();
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(prev => prev + 1);
    }
  };

  const handleLogout = async () => {
    if (!auth) return;
    try {
        await signOut(auth);
        router.push('/login');
    } catch (error) {
        console.error("Error signing out:", error);
        toast({ variant: 'destructive', title: "Logout Failed", description: "Could not log out. Please try again." });
    }
  };

  const progress = ((step + 1) / formSchemas.length) * 100;

  return (
    <div className="w-full max-h-[90vh] md:max-h-auto">
      <Card className="w-full max-w-4xl shadow-xl">
        <div className="flex justify-between items-center p-6">
            <div>
                 <CardTitle className="text-xl md:text-2xl font-headline">Student Onboarding</CardTitle>
                 <CardDescription className="mt-1">Complete your profile to get started.</CardDescription>
            </div>
            <Button variant="ghost" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
            </Button>
        </div>
        <Progress value={progress} className="mt-0" />

        <ScrollArea className="h-auto md:h-[60vh]">
            <CardContent className="p-6">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(data => onSubmit(data as Partial<FormData>))} className="space-y-8">
                {step === 0 && (
                    <div className="space-y-6">
                    <FormField
                        control={form.control}
                        name="profilePicture"
                        render={({ field }) => (
                        <FormItem className="flex flex-col items-center">
                            <FormLabel>Profile Picture</FormLabel>
                            <FormControl>
                            <div className="relative">
                                <Avatar className="h-24 w-24">
                                <AvatarImage src={field.value ? URL.createObjectURL(field.value) : ''} />
                                <AvatarFallback>
                                    <Upload className="h-8 w-8 text-muted-foreground" />
                                </AvatarFallback>
                                </Avatar>
                                <Input
                                    id="profilePicture"
                                    type="file"
                                    className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                                    onChange={(e) => field.onChange(e.target.files ? e.target.files[0] : null)}
                                />
                            </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                        <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Address</FormLabel>
                            <FormControl>
                                <Input placeholder="123 Mabini St, Brgy. Guadalupe, Cebu City" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        <FormField
                        control={form.control}
                        name="region"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Region</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select your region" />
                                </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                {philippineRegions.map((region) => (
                                    <SelectItem key={region} value={region}>
                                        {region}
                                    </SelectItem>
                                ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        <FormField
                            control={form.control}
                            name="contactInfo"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Contact Number</FormLabel>
                                <FormControl>
                                <Input placeholder="+63 917 123 4567" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                    </div>
                    </div>
                )}

                {step === 1 && (
                    <div className="space-y-4">
                    <FormField
                        control={form.control}
                        name="schoolId"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>School</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                                <SelectTrigger disabled={schoolsLoading}>
                                <SelectValue placeholder={schoolsLoading ? "Loading schools..." : "Select your school"} />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                {schools?.map(school => (
                                    <SelectItem key={school.id} value={school.id}>{school.fullName}</SelectItem>
                                ))}
                            </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                        <FormField
                        control={form.control}
                        name="programEnrolled"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Program Enrolled</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!selectedSchoolId || !selectedSchoolData?.programs}>
                                <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select your program" />
                                </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                {selectedSchoolData?.programs?.map(program => (
                                    <SelectItem key={program} value={program}>{program}</SelectItem>
                                ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        <FormField
                        control={form.control}
                        name="institutionalEmail"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Institutional Email</FormLabel>
                            <FormControl>
                                <Input placeholder="student.name@school.edu" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                    </div>
                    </div>
                )}
                
                {step === 2 && (
                    <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                        <FormField
                        control={form.control}
                        name="schoolIdDocument"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>School ID Document</FormLabel>
                            <FormControl>
                                <Input type="file" onChange={(e) => field.onChange(e.target.files ? e.target.files[0] : null)} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        <FormField
                        control={form.control}
                        name="transcript"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Transcript of Records</FormLabel>
                            <FormControl>
                                <Input type="file" onChange={(e) => field.onChange(e.target.files ? e.target.files[0] : null)} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                    </div>
                    <FormField
                        control={form.control}
                        name="birthCertificate"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Birth Certificate</FormLabel>
                            <FormControl>
                            <Input type="file" onChange={(e) => field.onChange(e.target.files ? e.target.files[0] : null)} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    </div>
                )}

                <CardFooter className="flex justify-between p-0 pt-6">
                    {step > 0 ? (
                    <Button type="button" variant="outline" onClick={handleBack}>
                        Back
                    </Button>
                    ) : <div />}
                    <Button type="submit" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting ? 'Saving...' : (step === formSchemas.length - 1 ? 'Finish' : 'Next')}
                    </Button>
                </CardFooter>
                </form>
            </Form>
            </CardContent>
        </ScrollArea>
      </Card>
    </div>
  );
}
