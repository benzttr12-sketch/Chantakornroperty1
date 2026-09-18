import { readFileSync, readdirSync } from 'node:fs';
import { extname, join } from 'node:path';

const readJson = (path) => JSON.parse(readFileSync(path, 'utf8'));
const applet = readJson('firebase-applet-config.json');
const firebaseJson = readJson('firebase.json');
const firebaserc = readJson('.firebaserc');
const packageJson = readJson('package.json');

function clean(value) {
  const v = String(value || '').trim();
  return v && !v.includes('YOUR_') && !v.includes('your-domain.example') ? v : '';
}

function value(name, fallback = '') {
  return clean(process.env[name]) || clean(fallback);
}

function normalizedBasePath(value) {
  const cleanValue = String(value || '').trim();
  if (!cleanValue || cleanValue === '/') return '';
  return `/${cleanValue.replace(/^\/+|\/+$/g, '')}`;
}

function numericVersion(version) {
  return String(version || '').replace(/^[^0-9]*/, '').split('.').slice(0, 3).map(part => Number.parseInt(part, 10) || 0);
}

function versionAtLeast(version, minimum) {
  const a = numericVersion(version);
  const b = numericVersion(minimum);
  for (let index = 0; index < 3; index += 1) {
    if (a[index] > b[index]) return true;
    if (a[index] < b[index]) return false;
  }
  return true;
}

const errors = [];
const warnings = [];

const siteUrl = value('NEXT_PUBLIC_SITE_URL');
const basePath = normalizedBasePath(process.env.NEXT_PUBLIC_BASE_PATH);
let parsedSiteUrl = null;
if (!siteUrl) {
  errors.push('NEXT_PUBLIC_SITE_URL is required for a production deployment.');
} else {
  try {
    parsedSiteUrl = new URL(siteUrl);
    if (parsedSiteUrl.protocol !== 'https:') errors.push('NEXT_PUBLIC_SITE_URL must use https:// in production.');
    if (['localhost', '127.0.0.1'].includes(parsedSiteUrl.hostname)) errors.push('NEXT_PUBLIC_SITE_URL must not point to localhost in production.');
  } catch {
    errors.push('NEXT_PUBLIC_SITE_URL is not a valid URL.');
  }
}

if (parsedSiteUrl) {
  const sitePath = parsedSiteUrl.pathname.replace(/\/+$/, '') || '';
  if (basePath && sitePath !== basePath) {
    errors.push(`NEXT_PUBLIC_BASE_PATH (${basePath}) must match the path in NEXT_PUBLIC_SITE_URL (${sitePath || '/'}).`);
  }
  if (!basePath && sitePath) {
    warnings.push(`NEXT_PUBLIC_SITE_URL includes path "${sitePath}" but NEXT_PUBLIC_BASE_PATH is empty.`);
  }
}

const requiredFirebase = {
  NEXT_PUBLIC_FIREBASE_API_KEY: applet.apiKey,
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: applet.authDomain,
  NEXT_PUBLIC_FIREBASE_PROJECT_ID: applet.projectId,
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: applet.storageBucket,
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: applet.messagingSenderId,
  NEXT_PUBLIC_FIREBASE_APP_ID: applet.appId,
};

for (const [name, fallback] of Object.entries(requiredFirebase)) {
  if (!value(name, fallback)) errors.push(`${name} is missing (and no usable fallback exists).`);
  if (!clean(process.env[name])) warnings.push(`${name} is using the repository fallback. Configure it explicitly in the deployment environment.`);
}

const projectId = value('NEXT_PUBLIC_FIREBASE_PROJECT_ID', applet.projectId);
const firebaseCliProject = clean(firebaserc.projects?.default);
if (!firebaseCliProject) {
  errors.push('.firebaserc does not define projects.default.');
} else if (projectId !== firebaseCliProject) {
  errors.push(`Firebase project mismatch: website uses "${projectId}" but .firebaserc deploys to "${firebaseCliProject}".`);
}

const databaseId = '(default)';
const rulesDatabase = firebaseJson.firestore?.[0]?.database || '(default)';
if (rulesDatabase !== '(default)') {
  errors.push(`Firestore production rules must target "(default)"; firebase.json currently targets "${rulesDatabase}".`);
}
const firebaseClientSource = readFileSync('src/lib/firebase/client.ts', 'utf8');
if (/getFirestore\s*\(\s*app\s*,/.test(firebaseClientSource)) {
  errors.push('Browser code must use the stable default Firestore database API; named-database getFirestore(app, databaseId) is not allowed in production.');
}

if (!value('NEXT_PUBLIC_FIREBASE_APPCHECK_SITE_KEY')) {
  warnings.push('App Check site key is not set. Keep enforcement OFF until a valid key is deployed and verified.');
}

const contactEmail = value('NEXT_PUBLIC_CONTACT_EMAIL', 'contact@chantakornproperty.com');
if (!/^\S+@\S+\.\S+$/.test(contactEmail)) errors.push('NEXT_PUBLIC_CONTACT_EMAIL is not a valid email address.');

const contactPhone = value('NEXT_PUBLIC_CONTACT_PHONE', '081-604-0097').replace(/[^0-9+]/g, '');
if (contactPhone.replace(/\D/g, '').length < 9) errors.push('NEXT_PUBLIC_CONTACT_PHONE does not look like a valid phone number.');

const lineUrl = value('NEXT_PUBLIC_LINE_URL', 'https://lin.ee/NMSe28T3');
try {
  const url = new URL(lineUrl);
  if (url.protocol !== 'https:') errors.push('NEXT_PUBLIC_LINE_URL must use https://');
} catch {
  errors.push('NEXT_PUBLIC_LINE_URL is not a valid URL.');
}

const nextVersion = packageJson.dependencies?.next;
if (!nextVersion || !versionAtLeast(nextVersion, '15.5.24')) {
  errors.push(`Next.js ${nextVersion || '(missing)'} is below the required patched maintenance release 15.5.24.`);
}

function scanFiles(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (['node_modules', '.git', '.next', 'out'].includes(entry.name)) continue;
    const path = join(dir, entry.name);
    if (entry.isDirectory()) {
      scanFiles(path);
      continue;
    }
    if (!entry.isFile()) continue;
    if (!['.json', '.env', '.pem', '.key'].includes(extname(entry.name)) && !entry.name.startsWith('.env')) continue;
    const text = readFileSync(path, 'utf8');
    if (/"private_key"\s*:|-----BEGIN (?:RSA )?PRIVATE KEY-----|"type"\s*:\s*"service_account"/.test(text)) {
      errors.push(`Possible Firebase Admin credential found in repository file: ${path}`);
    }
  }
}
scanFiles('.');

for (const warning of [...new Set(warnings)]) console.warn(`WARN: ${warning}`);
if (errors.length) {
  for (const error of [...new Set(errors)]) console.error(`ERROR: ${error}`);
  process.exit(1);
}

console.log(`Production preflight passed for ${siteUrl}`);
console.log(`Firebase project: ${projectId}`);
console.log(`Firestore database: ${databaseId}`);
console.log(`Next.js: ${nextVersion}`);
