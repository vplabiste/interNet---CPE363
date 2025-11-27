'use client';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Users, Building, GraduationCap, Shield } from 'lucide-react';


const stats = [
    {
      title: 'Total Students',
      value: '150',
      icon: <Users className="h-6 w-6 text-muted-foreground" />,
      change: '+20 this month',
    },
    {
      title: 'Total Companies',
      value: '25',
      icon: <Building className="h-6 w-6 text-muted-foreground" />,
      change: '+3 this month',
    },
    {
      title: 'Total Schools',
      value: '10',
      icon: <GraduationCap className="h-6 w-6 text-muted-foreground" />,
      change: '+1 this month',
    },
    {
      title: 'Active Admins',
      value: '2',
      icon: <Shield className="h-6 w-6 text-muted-foreground" />,
      change: '',
    },
  ];


export default function AdminPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
            <CardTitle>Admin Dashboard</CardTitle>
            <CardDescription>
              High-level overview of the platform.
            </CardDescription>
        </CardHeader>
        <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {stats.map(stat => (
                <Card key={stat.title}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                    {stat.icon}
                    </CardHeader>
                    <CardContent>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <p className="text-xs text-muted-foreground">{stat.change}</p>
                    </CardContent>
                </Card>
                ))}
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
