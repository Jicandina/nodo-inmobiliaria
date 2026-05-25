import { initializeApp, type FirebaseApp } from 'firebase/app';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getAuth, type Auth } from 'firebase/auth';
import { getStorage, type FirebaseStorage } from 'firebase/storage';

export const USE_MOCK = !import.meta.env.VITE_FIREBASE_API_KEY;

let app:     FirebaseApp      | null = null;
let _db:     Firestore        | null = null;
let _auth:   Auth             | null = null;
let _storage: FirebaseStorage | null = null;

if (!USE_MOCK) {
  app      = initializeApp({
    apiKey:            import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId:             import.meta.env.VITE_FIREBASE_APP_ID,
  });
  _db      = getFirestore(app);
  _auth    = getAuth(app);
  _storage = getStorage(app);
}

export const db      = _db!;
export const auth    = _auth!;
export const storage = _storage!;
