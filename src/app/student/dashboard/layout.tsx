'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Briefcase,
  Building,
  MessageSquare,
  Settings,
} from 'lucide-react';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
} from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Logo } from '@/components/logo';
import DashboardHeader from '@/components/dashboard-header';
import { useUser } from '@/firebase';
import { RoleRedirect } from '@/components/auth/role-redirect';
import { useState } from 'react';
import OnboardingPage from './onboarding';


const menuItems = [
  { href: '/student/dashboard', label: 'Dashboard', icon: <Home /> },
  {
    href: '/student/dashboard/applications',
    label: 'My Applications',
    icon: <Briefcase />,
  },
  { href: '/student/dashboard/companies', label: 'Companies', icon: <Building /> },
  { href: '/student/dashboard/messages', label: 'Messages', icon: <MessageSquare /> },
];


export default function StudentDashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, userData, isLoading } = useUser();
  const [onboardingComplete, setOnboardingComplete] = useState(false);

  const getInitials = (name: string | null | undefined) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(n => n[0])
      .join('');
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div>Loading...</div>
      </div>
    );
  }
  
  const handleOnboardingComplete = () => {
    setOnboardingComplete(true);
  }

  return (
    <SidebarProvider>
      <RoleRedirect />
      <Sidebar>
        <SidebarHeader>
          <Logo className="text-sidebar-foreground" />
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {menuItems.map(item => (
              <SidebarMenuItem key={item.label}>
                <SidebarMenuButton
                  asChild
                  tooltip={item.label}
                  isActive={pathname === item.href}
                >
                  <Link href={item.href}>
                    {item.icon}
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                tooltip="Settings"
                isActive={pathname === '/student/dashboard/settings'}
              >
                <Link href="/student/dashboard/settings">
                  <Settings />
                  <span>Settings</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton>
                <Avatar className="h-8 w-8">
                  <AvatarImage src={userData?.profilePictureUrl || ''} alt={userData?.fullName || 'User'} />
                  <AvatarFallback>{getInitials(userData?.fullName)}</AvatarFallback>
                </Avatar>
                <span>{userData?.fullName || 'User Name'}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <DashboardHeader />
        <main className="flex-1 p-4 sm:p-6 relative">
           {!onboardingComplete && (
            <div className="absolute inset-0 z-40 flex items-center justify-center bg-background/80 backdrop-blur-sm">
                <OnboardingPage onOnboardingComplete={handleOnboardingComplete} />
            </div>
           )}
          {children}
        </main>
      </SidebarInset>
       {process.env.NODE_ENV === 'development' && userData && (
        <div className="fixed bottom-4 left-4 z-50 rounded-md border bg-card p-2 shadow-lg">
            <p className="text-xs text-card-foreground">Logged in as: <span className="font-semibold">{userData.email}</span> (<span className="italic">{userData.role}</span>)</p>
        </div>
      )}
    </SidebarProvider>
  );
}
