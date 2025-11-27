
'use client';

import { User as FirebaseAuthUser } from 'firebase/auth';
import { Firestore, doc, getDoc, writeBatch } from 'firebase/firestore';
import { User } from '@/lib/types';


/**
 * Creates or links a user document in Firestore upon signup.
 * This function handles two main scenarios atomically using a write batch:
 * 1. A brand new user (student) signs up.
 * 2. A user who was pre-added by an admin (as a school or company) signs up for the first time.
 *
 * @param firestore - The Firestore instance.
 * @param firebaseUser - The newly created Firebase Auth User object.
 */
export async function createUserDocument(firestore: Firestore, firebaseUser: FirebaseAuthUser) {
    const userEmail = firebaseUser.email;
    if (!userEmail) {
        throw new Error('User email is not available for document creation.');
    }

    const finalUserDocRef = doc(firestore, 'users', firebaseUser.uid);
    const batch = writeBatch(firestore);
    
    // Check for a pending document using the user's email as the temporary ID.
    const pendingDocRef = doc(firestore, 'users', userEmail);
    const pendingDocSnap = await getDoc(pendingDocRef);

    if (pendingDocSnap.exists()) {
        // SCENARIO 2: This is a user claiming a pending account created by an admin.
        const pendingData = pendingDocSnap.data() as User;
        
        // The final user data inherits the role and name from the pending doc.
        const finalUserData: User = {
            ...pendingData,
            id: firebaseUser.uid, // Use the real auth UID as the ID.
            fullName: pendingData.fullName || firebaseUser.displayName || 'New User',
            email: userEmail,
            pending: false, // Mark as no longer pending.
        };

        // In the batch: Create the new document and delete the old temporary one.
        batch.set(finalUserDocRef, finalUserData);
        batch.delete(pendingDocRef);
        
    } else {
        // SCENARIO 1: This is a brand-new user (a student) signing up on their own.
        const newUser: User = {
            id: firebaseUser.uid,
            email: userEmail,
            fullName: firebaseUser.displayName || 'New Student',
            role: 'student', // Default role for self-signup is always 'student'.
            pending: false,
        };
    
        // In the batch: Just create the new user document.
        batch.set(finalUserDocRef, newUser);
    }

    // Commit the batch to execute the operations atomically.
    await batch.commit();
}

    