import { getApp, getApps, initializeApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getStorage, type FirebaseStorage } from 'firebase/storage';
import {
  getAppCheck,
  initializeAppCheck,
  ReCaptchaEnterpriseProvider,
  type AppCheck,
} from 'firebase/app-check';
import appletConfig from '../../../firebase-applet-config.json';

function clean(value?: string) {
  const v = (value || '').trim();
  return v && !v.includes('YOUR_') && !v.includes('your-project-id') ? v : '';
}

const firebaseConfig = {
  apiKey: clean(process.env.NEXT_PUBLIC_FIREBASE_API_KEY) || appletConfig.apiKey,
  authDomain: clean(process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN) || appletConfig.authDomain,
  projectId: clean(process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) || appletConfig.projectId,
  storageBucket: clean(process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET) || appletConfig.storageBucket,
  messagingSenderId: clean(process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID) || appletConfig.messagingSenderId,
  appId: clean(process.env.NEXT_PUBLIC_FIREBASE_APP_ID) || appletConfig.appId,
};

export const firebaseDatabaseId = '(default)' as const;
export const isFirebaseConfigured = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.appId);

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;
let storage: FirebaseStorage | null = null;
let appCheck: AppCheck | null = null;

if (isFirebaseConfigured) {
  try {
    app = getApps().length ? getApp() : initializeApp(firebaseConfig);

    const appCheckKey = clean(process.env.NEXT_PUBLIC_FIREBASE_APPCHECK_SITE_KEY);
    if (typeof window !== 'undefined' && appCheckKey) {
      try {
        appCheck = initializeAppCheck(app, {
          provider: new ReCaptchaEnterpriseProvider(appCheckKey),
          isTokenAutoRefreshEnabled: true,
        });
      } catch {
        try { appCheck = getAppCheck(app); } catch { appCheck = null; }
      }
    }

    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);
  } catch (error) {
    console.error('Firebase initialization failed:', error);
  }
}

export { app, appCheck, auth, db, storage };
