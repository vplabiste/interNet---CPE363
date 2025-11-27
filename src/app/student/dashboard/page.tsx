'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Briefcase, Building, CheckCircle, Clock } from 'lucide-react';
import { useUser } from '@/firebase';


const stats = [
  {
    title: 'Companies Applied To',
    value: '12',
    icon: <Building className="h-6 w-6 text-muted-foreground" />,
    change: '+2 this month',
  },
  {
    title: 'Pending Applications',
    value: '5',
    icon: <Clock className="h-6 w-6 text-muted-foreground" />,
    change: '-1 from last week',
  },
  {
    title: 'Interview Offers',
    value: '3',
    icon: <CheckCircle className="h-6 w-6 text-muted-foreground" />,
    change: '+1 this week',
  },
  {
    title: 'Total Applications',
    value: '25',
    icon: <Briefcase className="h-6 w-6 text-muted-foreground" />,
    change: 'Since joining',
  },
];


export default function StudentDashboardPage() {
  const { userData } = useUser();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight font-headline">
          Welcome back, {userData?.fullName || 'Student'}!
        </h1>
        <p className="text-muted-foreground">
          Here's a summary of your internship search.
        </p>
      </div>

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

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Updates on your recent applications.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Placeholder for recent activity list */}
            <div className="space-y-4">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                <div>
                  <p className="font-medium">Tech Innovators Inc.</p>
                  <p className="text-sm text-muted-foreground">
                    Application moved to "Under Review"
                  </p>
                </div>
                <div className="ml-auto text-sm text-muted-foreground">
                  2h ago
                </div>
              </div>
              <div className="flex items-center">
                <Clock className="h-5 w-5 text-yellow-500 mr-3" />
                <div>
                  <p className="font-medium">Future Solutions LLC</p>
                  <p className="text-sm text-muted-foreground">
                    You applied for Software Engineer Intern
                  </p>
                </div>
                <div className="ml-auto text-sm text-muted-foreground">
                  1d ago
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Recommended for you</CardTitle>
            <CardDescription>
              Internships that match your profile.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Placeholder for recommendations list */}
            <div className="space-y-4">
              <div className="flex items-start">
                <Building className="h-5 w-5 text-muted-foreground mr-3 mt-1" />
                <div>
                  <p className="font-medium">
                    Data Analytics Intern at FinCorp
                  </p>
                  <p className="text-sm text-muted-foreground">
                    New York, NY - Matches your Data Science skills
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <Building className="h-5 w-5 text-muted-foreground mr-3 mt-1" />
                <div>
                  <p className="font-medium">
                    Frontend Developer Intern at Creative Minds
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Remote - Matches your React and UI/UX skills
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
