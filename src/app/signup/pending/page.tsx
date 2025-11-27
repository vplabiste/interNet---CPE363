
'use client';

import { useRouter } from 'next/navigation';
import { useEffect, Suspense } from 'react';

// This page is no longer needed with the new simplified signup flow.
// A user with a pending account just needs to sign up with their email.
// Redirecting to the main login page, as admins now create users directly.

function PendingSignupRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/login');
  }, [router]);

  return (
      <div className="flex h-screen items-center justify-center">
          <p>Redirecting to login...</p>
      </div>
  )
}

export default function PendingSignupPageWrapper() {
    return (
        <Suspense fallback={<div className="flex h-screen items-center justify-center">Loading...</div>}>
            <PendingSignupRedirect />
        </Suspense>
    )
}
