import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
  Auth
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import type { FirebaseApp } from 'firebase/app';
import type { Firestore } from 'firebase/firestore';
const { app, db }: { app: FirebaseApp | null; db: Firestore | null } = require('./firebase');
import { User, UserPreferences } from '../types';

// Initialize auth with error handling
let auth: Auth | null = null;
try {
  if (app) {
    auth = getAuth(app);
  }
} catch (error) {
  console.warn('Firebase Auth initialization warning:', error);
}

// Default user preferences
const defaultPreferences: UserPreferences = {
  theme: 'auto',
  language: 'en',
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  notifications: {
    email: true,
    push: true,
    sms: false,
    reminders: true
  },
  accessibility: {
    fontSize: 'medium',
    highContrast: false,
    reduceMotion: false,
    screenReader: false
  }
};

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

export class AuthError extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = 'AuthError';
  }
}

// Create user profile in Firestore
const createUserProfile = async (firebaseUser: FirebaseUser, additionalData: Partial<User> = {}): Promise<User> => {
  if (!db) {
    // If Firestore is not available, return a basic user object
    return {
      id: firebaseUser.uid,
      name: firebaseUser.displayName || '',
      email: firebaseUser.email || '',
      role: 'user',
      preferences: defaultPreferences,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...additionalData
    };
  }
  
  const userRef = doc(db, 'users', firebaseUser.uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    const userData: User = {
      id: firebaseUser.uid,
      name: firebaseUser.displayName || '',
      email: firebaseUser.email || '',
      role: 'user', // Default role
      preferences: defaultPreferences,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...additionalData
    };

    try {
      await setDoc(userRef, userData);
      return userData;
    } catch (error) {
      console.error('Error creating user profile:', error);
      throw new AuthError('Failed to create user profile');
    }
  } else {
    return userSnap.data() as User;
  }
};

// Convert Firebase user to app user
const convertFirebaseUser = async (firebaseUser: FirebaseUser): Promise<User> => {
  if (!db) {
    // If Firestore is not available, return a basic user object
    return {
      id: firebaseUser.uid,
      name: firebaseUser.displayName || '',
      email: firebaseUser.email || '',
      role: 'user',
      preferences: defaultPreferences,
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }
  
  const userRef = doc(db, 'users', firebaseUser.uid);
  const userSnap = await getDoc(userRef);

  if (userSnap.exists()) {
    return userSnap.data() as User;
  } else {
    // Create profile if it doesn't exist
    return createUserProfile(firebaseUser);
  }
};

export const signUp = async (email: string, password: string, name: string): Promise<User> => {
  if (!auth) {
    throw new AuthError('Authentication not available');
  }
  
  try {
    const { user: firebaseUser } = await createUserWithEmailAndPassword(auth, email, password);
    return await createUserProfile(firebaseUser, { name, role: 'user' });
  } catch (error: any) {
    console.error('Sign up error:', error);
    
    switch (error.code) {
      case 'auth/email-already-in-use':
        throw new AuthError('This email is already registered');
      case 'auth/weak-password':
        throw new AuthError('Password is too weak');
      case 'auth/invalid-email':
        throw new AuthError('Invalid email address');
      default:
        throw new AuthError('Failed to create account');
    }
  }
};

export const signIn = async (email: string, password: string): Promise<User> => {
  if (!auth) {
    throw new AuthError('Authentication not available');
  }
  
  try {
    const { user: firebaseUser } = await signInWithEmailAndPassword(auth, email, password);
    return await convertFirebaseUser(firebaseUser);
  } catch (error: any) {
    console.error('Sign in error:', error);
    
    switch (error.code) {
      case 'auth/user-not-found':
      case 'auth/wrong-password':
        throw new AuthError('Invalid email or password');
      case 'auth/invalid-email':
        throw new AuthError('Invalid email address');
      case 'auth/too-many-requests':
        throw new AuthError('Too many failed attempts. Please try again later');
      default:
        throw new AuthError('Failed to sign in');
    }
  }
};

export const signOut = async (): Promise<void> => {
  if (!auth) {
    throw new AuthError('Authentication not available');
  }
  
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    console.error('Sign out error:', error);
    throw new AuthError('Failed to sign out');
  }
};

export const getCurrentUser = (): Promise<User | null> => {
  return new Promise((resolve) => {
    if (!auth) {
      resolve(null);
      return;
    }
    
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      unsubscribe();
      if (firebaseUser) {
        try {
          const user = await convertFirebaseUser(firebaseUser);
          resolve(user);
        } catch (error) {
          console.error('Error getting current user:', error);
          resolve(null);
        }
      } else {
        resolve(null);
      }
    });
  });
};

export const updateUserProfile = async (userId: string, updates: Partial<User>): Promise<void> => {
  if (!db) {
    throw new AuthError('Database not available');
  }
  
  try {
    const userRef = doc(db, 'users', userId);
    await setDoc(userRef, {
      ...updates,
      updatedAt: new Date()
    }, { merge: true });
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw new AuthError('Failed to update profile');
  }
};

// Auth state listener
export const onAuthStateChange = (callback: (user: User | null) => void) => {
  if (!auth) {
    // If auth is not available, call callback with null immediately
    callback(null);
    // Return a no-op unsubscribe function
    return () => {};
  }
  
  return onAuthStateChanged(auth, async (firebaseUser) => {
    if (firebaseUser) {
      try {
        const user = await convertFirebaseUser(firebaseUser);
        callback(user);
      } catch (error) {
        console.error('Error in auth state change:', error);
        callback(null);
      }
    } else {
      callback(null);
    }
  });
};

export { auth };