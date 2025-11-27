'use client';

import React, {
  createContext,
  useContext,
  ReactNode,
  useMemo,
  useState,
  useEffect,
} from 'react';
import { FirebaseApp } from 'firebase/app';
import { Firestore, doc, getDoc, onSnapshot } from 'firebase/firestore';
import { Auth, User, onAuthStateChanged } from 'firebase/auth';
import { FirebaseErrorListener } from '@/components/FirebaseErrorListener';
import { User as AppUser, Company } from '@/lib/types';

// This combines the Auth user and the Firestore user data
interface UserState {
  user: User | null;
  userData: AppUser | null;
  isLoading: boolean;
  error: Error | null;
}

export interface FirebaseContextState {
  firebaseApp: FirebaseApp;
  firestore: Firestore;
  auth: Auth;
  user: User | null;
  userData: AppUser | null;
  isLoading: boolean;
  isUserLoading: boolean; // Kept for compatibility with other components
  error: Error | null;
  userRole: AppUser['role'] | null;
  setDevUser?: (user: AppUser) => void;
}

export interface UserHookResult {
  user: User | null;
  userData: AppUser | null;
  isLoading: boolean;
  isUserLoading: boolean;
  userRole: AppUser['role'] | null;
}

export const FirebaseContext = createContext<FirebaseContextState | undefined>(
  undefined
);

export interface FirebaseProviderProps {
  children: ReactNode;
  firebaseApp: FirebaseApp;
  firestore: Firestore;
  auth: Auth;
}

export const FirebaseProvider: React.FC<FirebaseProviderProps> = ({
  children,
  firebaseApp,
  firestore,
  auth,
}) => {
  const [devUser, setDevUser] = useState<AppUser | null>(null);
  const [state, setState] = useState<UserState>({
    user: null,
    userData: null,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    // Dev mode user bypass
    if (process.env.NEXT_PUBLIC_DEV_MODE === 'true' && devUser) {
      setState({
        user: { uid: devUser.id } as User,
        userData: devUser,
        isLoading: false,
        error: null
      });
      return;
    }

    // This is the core listener for Firebase Auth state changes.
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      if (!authUser) {
        // User is not authenticated.
        setState({ user: null, userData: null, isLoading: false, error: null });
        return;
      }

      // User is authenticated, now fetch their data.
      // We use onSnapshot to get real-time updates.
      const userDocRef = doc(firestore, 'users', authUser.uid);
      const unsubscribeFirestore = onSnapshot(userDocRef, async (userDoc) => {
        if (!userDoc.exists()) {
          // This can happen briefly during signup before the user doc is created.
          // We set user data to null but keep the auth user.
          setState({ user: authUser, userData: null, isLoading: false, error: null });
          return;
        }

        const baseUserData = userDoc.data() as AppUser;
        let detailedUserData: AppUser | null = baseUserData;

        // If the user is a student or company, fetch their detailed profile
        // from the corresponding collection.
        if (baseUserData.role === 'student' || baseUserData.role === 'company') {
          const detailCollection = baseUserData.role === 'student' ? 'students' : 'companies';
          const detailDocRef = doc(firestore, detailCollection, authUser.uid);
          const detailDocSnap = await getDoc(detailDocRef);

          if (detailDocSnap.exists()) {
            detailedUserData = { ...baseUserData, ...detailDocSnap.data() };
          }
        }
        
        setState({ user: authUser, userData: detailedUserData, isLoading: false, error: null });

      }, (error) => {
        console.error("Firestore snapshot error on user document:", error);
        setState({ user: authUser, userData: null, isLoading: false, error });
      });

      return () => unsubscribeFirestore();
    });

    // Cleanup the main auth listener on component unmount.
    return () => unsubscribe();
  }, [auth, firestore, devUser]);

  const contextValue = useMemo(
    (): FirebaseContextState => ({
      firebaseApp,
      firestore,
      auth,
      user: state.user,
      userData: state.userData,
      isLoading: state.isLoading,
      isUserLoading: state.isLoading, // Map the main loading state
      error: state.error,
      userRole: state.userData?.role || null,
      setDevUser: process.env.NEXT_PUBLIC_DEV_MODE === 'true' ? setDevUser : undefined,
    }),
    [firebaseApp, firestore, auth, state]
  );

  return (
    <FirebaseContext.Provider value={contextValue}>
      <FirebaseErrorListener />
      {children}
    </FirebaseContext.Provider>
  );
};


export const useFirebase = (): FirebaseContextState => {
  const context = useContext(FirebaseContext);

  if (context === undefined) {
    throw new Error('useFirebase must be used within a FirebaseProvider.');
  }

  return context;
};

export const useAuth = (): Auth => {
  const { auth } = useFirebase();
  return auth;
};

export const useFirestore = (): Firestore => {
  const { firestore } = useFirebase();
  return firestore;
};

export const useFirebaseApp = (): FirebaseApp => {
  const { firebaseApp } = useFirebase();
  return firebaseApp;
};

export const useUser = (): UserHookResult => {
  const { user, userData, userRole, isLoading, isUserLoading } = useFirebase();
  return { user, userData, userRole, isLoading, isUserLoading };
};
