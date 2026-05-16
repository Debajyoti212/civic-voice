import { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Fetch user profile from Firestore
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        const userDoc = await getDoc(userDocRef);
        
        if (userDoc.exists()) {
          setUser({ id: firebaseUser.uid, phone: firebaseUser.phoneNumber, ...userDoc.data() });
        } else {
          // Fallback if profile not created yet
          setUser({ id: firebaseUser.uid, phone: firebaseUser.phoneNumber, role: 'citizen', name: 'Citizen User', avatar: '👤' });
        }
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const saveUserProfile = async (uid, phone, role) => {
    const userDocRef = doc(db, 'users', uid);
    const userData = {
      phone,
      role,
      name: role === 'admin' ? 'Municipal Staff' : 'Citizen User',
      avatar: role === 'admin' ? '👨‍💼' : '👤',
      joinedAt: new Date().toISOString(),
    };
    await setDoc(userDocRef, userData, { merge: true });
    setUser({ id: uid, ...userData });
  };

  const logout = async () => {
    setIsLoading(true);
    await signOut(auth);
    setIsLoading(false);
  };

  return (
    <AuthContext.Provider value={{ user, saveUserProfile, logout, isLoading, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
