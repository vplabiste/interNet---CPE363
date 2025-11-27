
'use client';

import { useUser } from '@/firebase';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

/**
 * A client component responsible for handling all role-based and onboarding-related
 * redirects within the application. It acts as the single source of truth for routing
 * after a user is authenticated.
 */
export function RoleRedirect() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, userData, isLoading } = useUser();

  useEffect(() => {
    // Wait until we have the definitive authentication and user data status.
    if (isLoading) {
      return;
    }

    const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/signup');
    const isLandingPage = pathname === '/';
    const isOnboardingPage = pathname.startsWith('/onboarding');

    // 1. If user is not logged in
    if (!user) {
      // If they are on any protected page (not landing or auth), redirect to login.
      if (!isAuthPage && !isLandingPage) {
        router.replace('/login');
      }
      return;
    }

    // 2. If user is logged in, but we don't have their Firestore data yet, wait.
    if (!userData) {
      return;
    }

    // 3. User is logged in and we have their data. Time to figure out where they should go.
    let needsOnboarding = false;
    let expectedOnboardingPath: string | null = null;
    let expectedDashboardPath: string | null = null;

    switch (userData.role) {
      case 'student':
        // For students, onboarding is handled within the dashboard layout.
        // So, the expected path is always the dashboard.
        needsOnboarding = !userData.programEnrolled;
        expectedDashboardPath = '/student/dashboard';
        expectedOnboardingPath = expectedDashboardPath; // Onboarding happens at the dashboard
        break;
      case 'school':
        needsOnboarding = !userData.programs || userData.programs.length === 0;
        expectedOnboardingPath = '/onboarding/school';
        expectedDashboardPath = '/school/dashboard';
        break;
      case 'company':
        needsOnboarding = !userData.shortIntroduction;
        expectedOnboardingPath = '/onboarding/company';
        expectedDashboardPath = '/company/dashboard';
        break;
      case 'admin':
        needsOnboarding = false;
        expectedDashboardPath = '/admin/dashboard';
        break;
      default:
        // Unknown role, maybe log out or show an error. For now, do nothing.
        return;
    }

    const isCorrectDashboard = expectedDashboardPath && pathname.startsWith(expectedDashboardPath);
    const isCorrectOnboarding = expectedOnboardingPath && pathname.startsWith(expectedOnboardingPath);

    // 4. Perform the redirect if necessary.
    if (needsOnboarding) {
      // If user needs onboarding, send them there, unless they're already on the correct onboarding page.
      if (!isCorrectOnboarding) {
        router.replace(expectedOnboardingPath!);
      }
    } else {
      // If user is fully onboarded, send them to their dashboard if they are not already on it
      // or one of its sub-pages.
      if (isAuthPage || isLandingPage || isOnboardingPage) {
         router.replace(expectedDashboardPath!);
      }
    }
  }, [isLoading, user, userData, pathname, router]);

  // This component does not render anything itself.
  return null;
}
