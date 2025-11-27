'use client';

import { useMemo } from 'react';
import type { Query, DocumentReference } from 'firebase/firestore';

/**
 * A hook that memoizes a Firebase query or document reference.
 * This is crucial to prevent re-renders and infinite loops when using
 * hooks like useCollection or useDoc, which expect a stable reference.
 *
 * @param factory A function that returns a Firestore Query or DocumentReference.
 * @param deps The dependency array for the useMemo hook.
 * @returns The memoized query or document reference.
 */
export function useMemoFirebase<T extends Query | DocumentReference | null>(
  factory: () => T,
  deps: React.DependencyList
): T {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(factory, deps);
}
