#!/usr/bin/env node
import { applicationDefault, cert, getApps, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import fs from 'node:fs';

const [emailOrUid, rawRole] = process.argv.slice(2);
const role = String(rawRole || '').toUpperCase();
const allowedRoles = ['ADMIN', 'AGENT', 'USER'];
if (!emailOrUid || !allowedRoles.includes(role)) {
  console.error('Usage: npm run set-role -- <email-or-uid> <ADMIN|AGENT|USER>');
  process.exit(1);
}

const projectId = process.env.FIREBASE_PROJECT_ID || process.env.GCLOUD_PROJECT;
const databaseId = process.env.FIREBASE_DATABASE_ID || '(default)';
const serviceAccountPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
let credential;
if (serviceAccountPath && fs.existsSync(serviceAccountPath)) {
  credential = cert(JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8')));
} else {
  credential = applicationDefault();
}

const app = getApps()[0] || initializeApp({ credential, projectId });
const auth = getAuth(app);
const user = emailOrUid.includes('@') ? await auth.getUserByEmail(emailOrUid) : await auth.getUser(emailOrUid);
if (role !== 'USER' && !user.emailVerified) {
  throw new Error('Refusing to grant staff access until the Firebase Authentication email is verified.');
}
const db = databaseId === '(default)' ? getFirestore(app) : getFirestore(app, databaseId);
const profileRef = db.collection('profiles').doc(user.uid);
const profileSnap = await profileRef.get();
if (!profileSnap.exists) {
  throw new Error(`Profile ${user.uid} does not exist in Firestore database "${databaseId}". Ask the user to register/sign in first.`);
}

const profileRole = String(profileSnap.data()?.role || 'USER').toUpperCase();
const claimRole = String(user.customClaims?.role || 'USER').toUpperCase();
const currentClaims = user.customClaims || {};

async function writeClaim() {
  await auth.setCustomUserClaims(user.uid, { ...currentClaims, role });
  // Existing ID tokens can remain valid until expiry, so revoke refresh tokens immediately
  // whenever the claim is changed. The user must sign in again to continue.
  await auth.revokeRefreshTokens(user.uid);
}

async function writeProfile() {
  await profileRef.update({ role });
}

// Both Firestore and Storage require the profile role and Auth claim to agree.
// Update Firestore first for every role change. Promotions remain denied until the claim
// is added; demotions lose staff access as soon as the profile changes, even if an older
// ID token still carries the previous claim. If the claim update fails, access fails closed
// until this script is rerun.
await writeProfile();
await writeClaim();

console.log(`Updated ${user.email || user.uid}: ${profileRole}/${claimRole} -> ${role}`);
console.log('Refresh tokens were revoked. The user must sign in again before continuing.');
