import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  User as FirebaseUser,
  updateProfile as updateFirebaseProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'admin';
  avatar?: string;
  bio?: string;
  skills?: string[];
  achievements?: string[];
  following?: string[];
  followers?: string[];
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Create or get user document from Firestore
  const createUserDocument = async (firebaseUser: FirebaseUser, additionalData?: any) => {
    if (!firebaseUser) return;
    
    const userRef = doc(db, 'users', firebaseUser.uid);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) {
      const { displayName, email } = firebaseUser;
      const userData = {
        name: displayName || additionalData?.name || 'User',
        email,
        role: email === 'admin@smartapp.com' ? 'admin' : 'student',
        bio: '',
        skills: [],
        achievements: [],
        following: [],
        followers: [],
        createdAt: new Date().toISOString(),
        ...additionalData
      };
      
      try {
        await setDoc(userRef, userData);
      } catch (error) {
        console.error('Error creating user document:', error);
      }
    }
    
    return userSnap.exists() ? userSnap.data() : null;
  };

  // Convert Firebase user to our User interface
  const convertFirebaseUser = async (firebaseUser: FirebaseUser): Promise<User> => {
    const userRef = doc(db, 'users', firebaseUser.uid);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      const userData = userSnap.data();
      return {
        id: firebaseUser.uid,
        name: userData.name || firebaseUser.displayName || 'User',
        email: firebaseUser.email || '',
        role: userData.role || 'student',
        avatar: userData.avatar,
        bio: userData.bio || '',
        skills: userData.skills || [],
        achievements: userData.achievements || [],
        following: userData.following || [],
        followers: userData.followers || []
      };
    } else {
      // Create user document if it doesn't exist
      await createUserDocument(firebaseUser);
      return {
        id: firebaseUser.uid,
        name: firebaseUser.displayName || 'User',
        email: firebaseUser.email || '',
        role: 'student',
        bio: '',
        skills: [],
        achievements: [],
        following: [],
        followers: []
      };
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userData = await convertFirebaseUser(firebaseUser);
          setUser(userData);
        } catch (error) {
          console.error('Error converting Firebase user:', error);
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const userData = await convertFirebaseUser(userCredential.user);
      setUser(userData);
      return true;
    } catch (error: any) {
      console.error('Login error:', error);
      
      // Handle specific Firebase auth errors
      let errorMessage = 'Login failed. Please try again.';
      switch (error.code) {
        case 'auth/user-not-found':
          errorMessage = 'No account found with this email address.';
          break;
        case 'auth/wrong-password':
          errorMessage = 'Incorrect password.';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Invalid email address.';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Too many failed attempts. Please try again later.';
          break;
        case 'auth/network-request-failed':
          errorMessage = 'Network error. Please check your connection.';
          break;
      }
      
      // You might want to show this error message to the user
      alert(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update the user's display name
      await updateFirebaseProfile(userCredential.user, {
        displayName: name
      });
      
      // Create user document in Firestore
      await createUserDocument(userCredential.user, { name });
      
      const userData = await convertFirebaseUser(userCredential.user);
      setUser(userData);
      return true;
    } catch (error: any) {
      console.error('Signup error:', error);
      
      // Handle specific Firebase auth errors
      let errorMessage = 'Signup failed. Please try again.';
      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'An account with this email already exists.';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Invalid email address.';
          break;
        case 'auth/weak-password':
          errorMessage = 'Password should be at least 6 characters.';
          break;
        case 'auth/network-request-failed':
          errorMessage = 'Network error. Please check your connection.';
          break;
      }
      
      alert(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const updateProfile = async (updates: Partial<User>): Promise<void> => {
    if (!user) return;
    
    try {
      const userRef = doc(db, 'users', user.id);
      await updateDoc(userRef, updates);
      
      // Update local state
      setUser({ ...user, ...updates });
      
      // Update Firebase Auth profile if name is being updated
      if (updates.name && auth.currentUser) {
        await updateFirebaseProfile(auth.currentUser, {
          displayName: updates.name
        });
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      login, 
      signup, 
      logout, 
      updateProfile 
    }}>
      {children}
    </AuthContext.Provider>
  );
};