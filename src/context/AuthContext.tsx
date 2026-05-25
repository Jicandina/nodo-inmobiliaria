import { createContext, useContext, useEffect, useState } from 'react';

interface AuthUser {
  email: string;
  uid: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const FIREBASE_READY = Boolean(import.meta.env.VITE_FIREBASE_API_KEY);

// ── Demo auth (usado cuando no hay Firebase configurado) ──────────
const DEMO_CREDENTIALS = { email: 'admin@inmobiliaria.com.ve', password: 'admin2024' };
const SESSION_KEY = 'inmobiliaria_admin_session';

function useDemoAuth() {
  const [user, setUser] = useState<AuthUser | null>(() => {
    try { return JSON.parse(sessionStorage.getItem(SESSION_KEY) ?? 'null'); }
    catch { return null; }
  });

  const login = async (email: string, password: string) => {
    if (email === DEMO_CREDENTIALS.email && password === DEMO_CREDENTIALS.password) {
      const u = { email, uid: 'demo-admin' };
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(u));
      setUser(u);
    } else {
      throw new Error('Credenciales incorrectas');
    }
  };

  const logout = async () => {
    sessionStorage.removeItem(SESSION_KEY);
    setUser(null);
  };

  return { user, loading: false, login, logout };
}

// ── Firebase auth (usado cuando .env está configurado) ────────────
function useFirebaseAuth() {
  const [user, setUser]       = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsub = () => {};
    import('firebase/auth').then(({ onAuthStateChanged }) =>
      import('../lib/firebase').then(({ auth }) => {
        unsub = onAuthStateChanged(auth, (u) => {
          setUser(u ? { email: u.email ?? '', uid: u.uid } : null);
          setLoading(false);
        });
      })
    );
    return () => unsub();
  }, []);

  const login = async (email: string, password: string) => {
    const { signInWithEmailAndPassword } = await import('firebase/auth');
    const { auth } = await import('../lib/firebase');
    await signInWithEmailAndPassword(auth, email, password);
  };

  const logout = async () => {
    const { signOut } = await import('firebase/auth');
    const { auth } = await import('../lib/firebase');
    await signOut(auth);
  };

  return { user, loading, login, logout };
}

// ── Provider ──────────────────────────────────────────────────────
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const demo     = useDemoAuth();
  const firebase = useFirebaseAuth();
  const value    = FIREBASE_READY ? firebase : demo;

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
