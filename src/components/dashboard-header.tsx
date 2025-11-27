
'use client';

import Link from 'next/link';
import { Bell, Briefcase, User } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { useAuth, useUser } from '@/firebase';
import { useToast } from '@/hooks/use-toast';

export default function DashboardHeader() {
  const auth = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const { userData } = useUser();
  const { toast } = useToast();

  const handleLogout = async () => {
    if (!auth) return;
    try {
      await signOut(auth);
      router.push('/login');
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to log out. Please try again.',
      });
    }
  };

  const getSettingsPath = () => {
    if (!userData) return '/';
    return `/${userData.role}/dashboard/settings`;
  }

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 pt-8 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 sm:pt-0">
      <SidebarTrigger className="sm:hidden" />
      <div className="ml-auto flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative rounded-full">
                  <Bell className="h-5 w-5" />
                   <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">2</span>
                  <span className="sr-only">Toggle notifications</span>
              </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="flex items-start gap-3">
                  <Briefcase className="mt-1 h-4 w-4 text-muted-foreground" />
                  <div className="flex flex-col">
                      <span>New application for <strong>Software Engineer Intern</strong>.</span>
                      <span className="text-xs text-muted-foreground">2h ago</span>
                  </div>
              </DropdownMenuItem>
               <DropdownMenuItem className="flex items-start gap-3">
                  <User className="mt-1 h-4 w-4 text-muted-foreground" />
                  <div className="flex flex-col">
                      <span>Your profile was viewed by <strong>Tech Innovators Inc</strong>.</span>
                      <span className="text-xs text-muted-foreground">1d ago</span>
                  </div>
              </DropdownMenuItem>
               <DropdownMenuItem className="flex items-start gap-3">
                  <Bell className="mt-1 h-4 w-4 text-muted-foreground" />
                  <div className="flex flex-col">
                      <span>Welcome to interNet! Complete your profile to get started.</span>
                       <span className="text-xs text-muted-foreground">3d ago</span>
                  </div>
              </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-9 w-9">
                <AvatarImage
                  src="https://picsum.photos/seed/user-avatar/100/100"
                  alt="User Avatar"
                  data-ai-hint="professional headshot"
                />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href={getSettingsPath()}>Settings</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>Support</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
