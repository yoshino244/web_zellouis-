import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, updatePassword } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  signIn: (password: string) => Promise<void>;
  logOut: () => Promise<void>;
  createInitialAdmin: (password: string) => Promise<void>;
  changeAdminPassword: (newPassword: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAdmin: false,
  loading: true,
  signIn: async () => {},
  logOut: async () => {},
  createInitialAdmin: async () => {},
  changeAdminPassword: async () => {},
});

const ADMIN_EMAIL = 'admin@zellouis.art';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        // Check if admin
        try {
          const adminDoc = await getDoc(doc(db, 'admins', u.uid));
          if (adminDoc.exists()) {
            setIsAdmin(true);
          } else {
             // Try to bootstrap if it's the admin email
             if (u.email === ADMIN_EMAIL) {
               await setDoc(doc(db, 'admins', u.uid), { email: u.email });
               setIsAdmin(true);
             } else if (u.email === 'tokioyoshino244@gmail.com') { // fallback for previous google login
                 setIsAdmin(false);
             } else {
                 setIsAdmin(false);
             }
          }
        } catch (e) {
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return () => unsub();
  }, []);

  const signIn = async (password: string) => {
    await signInWithEmailAndPassword(auth, ADMIN_EMAIL, password);
  };
  
  const createInitialAdmin = async (password: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, ADMIN_EMAIL, password);
    await setDoc(doc(db, 'admins', userCredential.user.uid), { email: ADMIN_EMAIL });
    setIsAdmin(true);
  };

  const logOut = async () => {
    await signOut(auth);
  };
  
  const changeAdminPassword = async (newPassword: string) => {
    if (auth.currentUser) {
      await updatePassword(auth.currentUser, newPassword);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAdmin, loading, signIn, logOut, createInitialAdmin, changeAdminPassword }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
