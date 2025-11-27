
'use client';
import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PlusCircle, Trash2 } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { User } from '@/lib/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';


function AddUserDialog() {
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<User['role'] | 'school' | 'company' | 'admin'>('company');
  const { toast } = useToast();
  const [open, setOpen] = useState(false);

  const handleCreateAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !fullName) return;

    // Simulate creating an account
    toast({
      title: 'User Account Created (Simulation)',
      description: `In a real app, an invitation would be sent to ${email}.`,
    });

    // Reset form and close dialog
    setEmail('');
    setFullName('');
    setRole('company');
    setOpen(false);
  };


  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New User</DialogTitle>
          <DialogDescription>
            Create a new user account. They will be prompted to set a password on their first login.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleCreateAccount} className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="col-span-3"
                placeholder="e.g., contact@cit.edu"
                required
              />
            </div>
             <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="fullName" className="text-right">
                Full Name
              </Label>
              <Input
                id="fullName"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                className="col-span-3"
                placeholder="e.g., Cebu Institute of Technology"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="role" className="text-right">
                Role
              </Label>
              <Select onValueChange={(value: User['role']) => setRole(value)} defaultValue={role}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="school">School</SelectItem>
                  <SelectItem value="company">Company</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end pt-4">
               <Button type="submit">Create Account</Button>
            </div>
          </form>
      </DialogContent>
    </Dialog>
  );
}

const demoUsers: User[] = [
    { id: '1', fullName: 'Dev Student', email: 'dev-student@example.com', role: 'student' },
    { id: '2', fullName: 'Dev Company', email: 'dev-company@example.com', role: 'company' },
    { id: '3', fullName: 'Dev School', email: 'dev-school@example.com', role: 'school' },
    { id: '4', fullName: 'Dev Admin', email: 'dev-admin@example.com', role: 'admin' },
];

export default function AdminUsersPage() {
    const { toast } = useToast();

    const getRoleVariant = (role: User['role']) => {
        switch(role) {
            case 'admin': return 'destructive';
            case 'school': return 'secondary';
            case 'company': return 'default';
            default: return 'outline';
        }
    }
    
    const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').substring(0, 2);

    const handleDeleteUser = (user: User) => {
        toast({
            title: 'Action Simulated',
            description: `User ${user.fullName} would be deleted in a real application.`
        })
    }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row justify-between items-start">
          <div>
            <CardTitle>Manage Users</CardTitle>
            <CardDescription>
              Add new school, company, or admin accounts.
            </CardDescription>
          </div>
          <AddUserDialog />
        </CardHeader>
        <CardContent>
           <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {demoUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                            <AvatarImage src={user.profilePictureUrl} />
                            <AvatarFallback>{getInitials(user.fullName)}</AvatarFallback>
                        </Avatar>
                         <div className="font-medium">{user.fullName}</div>
                         <div className="text-sm text-muted-foreground">{user.email}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getRoleVariant(user.role)}>{user.role}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteUser(user)}>
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete user</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
