const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');

test('agent photo management uses Firebase Storage and Firestore', () => {
  const page = fs.readFileSync('src/app/admin/agents/page.tsx', 'utf8');
  const store = fs.readFileSync('src/lib/store/agents-store.ts', 'utf8');
  const rules = fs.readFileSync('storage.rules', 'utf8');
  const layout = fs.readFileSync('src/app/admin/layout.tsx', 'utf8');
  assert.match(page, /เปลี่ยนรูปคนขาย \/ นายหน้า/);
  assert.match(store, /agent-photos/);
  assert.match(store, /uploadBytes/);
  assert.match(store, /photo_url/);
  assert.match(rules, /image\/\(jpeg\|png\|webp\)/);
  assert.match(layout, /href: '\/admin\/agents'/);
});

test('Firebase security rules protect business data', () => {
  const rules = fs.readFileSync('firestore.rules', 'utf8');
  assert.match(rules, /isStaff/);
  assert.match(rules, /request\.resource\.data\.role == 'USER'/);
  assert.match(rules, /resource\.data\.published == true/);
});

test('v4 secures Storage with staff custom claims', () => {
  const rules = fs.readFileSync('storage.rules', 'utf8');
  const roleScript = fs.readFileSync('scripts/set-user-role.mjs', 'utf8');
  assert.match(rules, /request\.auth\.token\.role == 'ADMIN'/);
  assert.match(rules, /property-images/);
  assert.match(roleScript, /setCustomUserClaims/);
  assert.match(roleScript, /profiles/);
});

test('v4 includes property uploads, password reset, privacy and shared contact config', () => {
  const editor = fs.readFileSync('src/app/admin/properties/new/page.tsx', 'utf8');
  const media = fs.readFileSync('src/lib/store/property-media.ts', 'utf8');
  const forgot = fs.readFileSync('src/app/forgot-password/page.tsx', 'utf8');
  const privacy = fs.readFileSync('src/app/privacy/page.tsx', 'utf8');
  const config = fs.readFileSync('src/config/site.ts', 'utf8');
  assert.match(editor, /uploadPropertyImages/);
  assert.match(editor, /ตั้งเป็นรูปปก/);
  assert.match(media, /property-images/);
  assert.match(forgot, /sendPasswordResetEmail/);
  assert.match(privacy, /นโยบายความเป็นส่วนตัว/);
  assert.match(config, /NEXT_PUBLIC_CONTACT_PHONE/);
});

test('visual cleanup removes hard-coded marketing metrics and stock listing fallbacks', () => {
  const sourceFiles = [
    'src/components/home/PropertyCategories.tsx',
    'src/components/home/LocationHighlights.tsx',
    'src/components/home/SellPropertyCTA.tsx',
    'src/app/about/page.tsx',
    'src/components/layout/Footer.tsx',
    'src/app/privacy/page.tsx',
  ].map(file => fs.readFileSync(file, 'utf8')).join('\n');
  const card = fs.readFileSync('src/components/properties/PropertyCard.tsx', 'utf8');
  const gallery = fs.readFileSync('src/components/properties/PropertyGallery.tsx', 'utf8');
  assert.doesNotMatch(sourceFiles, /98%|45 วัน|10\+ ปี|500\+ ล้าน|120 รายการ|85 รายการ|ควรให้ผู้รับผิดชอบด้านกฎหมาย/);
  assert.match(card, /ยังไม่มีรูปภาพ/);
  assert.match(gallery, /ยังไม่มีรูปภาพสำหรับประกาศนี้/);
  assert.doesNotMatch(card, /images\.unsplash\.com/);
  assert.doesNotMatch(gallery, /images\.unsplash\.com/);
});

test('hardening removes public base64 uploads and non-functional admin role controls', () => {
  const sell = fs.readFileSync('src/app/sell/page.tsx', 'utf8');
  const users = fs.readFileSync('src/app/admin/users/page.tsx', 'utf8');
  const rules = fs.readFileSync('firestore.rules', 'utf8');
  assert.doesNotMatch(sell, /FileReader|toDataURL|uploadedPhotos/);
  assert.match(sell, /ส่งรูปทาง LINE/);
  assert.doesNotMatch(users, /handleDeleteUser|showAddModal|เปลี่ยนระดับสิทธิ์/);
  assert.match(rules, /affectedKeys\(\)\.hasOnly\(\['full_name', 'phone', 'avatar_url'\]\)/);
  assert.match(rules, /data\.keys\(\)\.hasOnly/);
});

test('App Check and production URL safeguards are wired for deployment', () => {
  const firebase = fs.readFileSync('src/lib/firebase/client.ts', 'utf8');
  const env = fs.readFileSync('.env.example', 'utf8');
  const siteUrl = fs.readFileSync('src/config/site-url.ts', 'utf8');
  const workflow = fs.readFileSync('.github/workflows/pages.yml', 'utf8');
  assert.match(firebase, /ReCaptchaEnterpriseProvider/);
  assert.match(env, /NEXT_PUBLIC_FIREBASE_APPCHECK_SITE_KEY/);
  assert.match(workflow, /NEXT_PUBLIC_FIREBASE_APPCHECK_SITE_KEY/);
  assert.match(siteUrl, /benzttr12-sketch\.github\.io\/Chantakorn-Property-Production/);
});

test('location cards no longer imply stock photos are real local imagery', () => {
  const locations = fs.readFileSync('src/data/locations.ts', 'utf8');
  const component = fs.readFileSync('src/components/home/LocationHighlights.tsx', 'utf8');
  assert.doesNotMatch(locations, /images\.unsplash\.com|image:/);
  assert.doesNotMatch(component, /next\/image/);
});

test('agent identity changes are admin-only while property media remains staff-managed', () => {
  const firestore = fs.readFileSync('firestore.rules', 'utf8');
  const storage = fs.readFileSync('storage.rules', 'utf8');
  const layout = fs.readFileSync('src/app/admin/layout.tsx', 'utf8');
  assert.match(firestore, /match \/agents\/\{id\}[\s\S]*allow create, update, delete: if isAdmin\(\)/);
  assert.match(storage, /match \/agent-photos[\s\S]*allow create, update: if isAdmin\(\)/);
  assert.match(storage, /match \/property-images[\s\S]*allow create, update: if isOwnerAgentOrAdmin\(ownerUid\)/);
  assert.match(layout, /pathname\.startsWith\('\/admin\/agents'\)/);
});

test('registration recovers cleanly and member-only pages are not indexed', () => {
  const register = fs.readFileSync('src/app/register/page.tsx', 'utf8');
  const login = fs.readFileSync('src/app/login/page.tsx', 'utf8');
  const robots = fs.readFileSync('src/app/robots.ts', 'utf8');
  const loginLayout = fs.readFileSync('src/app/login/layout.tsx', 'utf8');
  const favoritesLayout = fs.readFileSync('src/app/favorites/layout.tsx', 'utf8');
  assert.match(register, /deleteUser\(credential\.user\)/);
  assert.match(login, /sendEmailVerification\(credential\.user, \{ url: `\$\{getSiteUrl\(\)\}\/login` \}\)/);
  assert.match(loginLayout, /index: false/);
  assert.match(favoritesLayout, /index: false/);
  assert.match(robots, /\/admin\//);
  assert.match(robots, /\/favorites\//);
});


test('v6 final hardens deployment workflow and release preflight', () => {
  const workflow = fs.readFileSync('.github/workflows/pages.yml', 'utf8');
  const preflight = fs.readFileSync('scripts/validate-production.mjs', 'utf8');
  const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  assert.match(workflow, /actions\/checkout@v7/);
  assert.match(workflow, /actions\/setup-node@v7/);
  assert.match(workflow, /actions\/configure-pages@v6/);
  assert.match(workflow, /actions\/upload-pages-artifact@v5/);
  assert.match(workflow, /actions\/deploy-pages@v5/);
  assert.match(workflow, /actions: read/);
  assert.match(preflight, /Firestore production rules must target/);
  assert.match(preflight, /Possible Firebase Admin credential/);
  assert.equal(pkg.version, '1.0.0');
  assert.equal(pkg.scripts.preflight, 'node scripts/validate-production.mjs');
});

test('v6 final ships clean app metadata and safer media ownership', () => {
  const manifest = fs.readFileSync('src/app/manifest.ts', 'utf8');
  const icon = fs.readFileSync('src/app/icon.svg', 'utf8');
  const storage = fs.readFileSync('storage.rules', 'utf8');
  const security = fs.readFileSync('SECURITY.md', 'utf8');
  assert.match(manifest, /CHANTAKORN PROPERTY/);
  assert.match(icon, /#0B1F3A/);
  assert.match(storage, /function isAgent\(\)[\s\S]*request\.auth\.token\.role == 'AGENT'[\s\S]*hasProfileRole\('AGENT'\)/);
  assert.match(storage, /isAgent\(\) && request\.auth\.uid == ownerUid/);
  assert.match(storage, /allow delete: if isOwnerAgentOrAdmin\(ownerUid\)/);
  assert.doesNotMatch(security, /Use this section to tell people/);
  assert.equal(fs.existsSync('metadata.json'), false);
});


test('v6.1 final review removes inferred property claims and tightens data integrity', () => {
  const detail = fs.readFileSync('src/components/properties/PropertyDetail.tsx', 'utf8');
  const specs = fs.readFileSync('src/components/properties/PropertySpecs.tsx', 'utf8');
  const map = fs.readFileSync('src/components/properties/PropertyMap.tsx', 'utf8');
  const store = fs.readFileSync('src/lib/store/properties-store.ts', 'utf8');
  const rules = fs.readFileSync('firestore.rules', 'utf8');
  const roles = fs.readFileSync('scripts/set-user-role.mjs', 'utf8');
  const agents = fs.readFileSync('src/lib/store/agents-store.ts', 'utf8');
  assert.doesNotMatch(detail, /พร้อมเข้าอยู่ \/ พร้อมโอนกรรมสิทธิ์/);
  assert.doesNotMatch(detail, /10-15 นาที|5 นาที|8 นาที/);
  assert.doesNotMatch(detail, /availability: 'https:\/\/schema\.org\/InStock'/);
  assert.doesNotMatch(specs, /โฉนดที่ดิน.*พร้อมโอน/);
  assert.match(map, /activePopupProp\.province/);
  assert.match(store, /serverTimestamp\(\)/);
  assert.match(store, /assertSlugAvailable/);
  assert.match(rules, /request\.auth\.token\.role == 'ADMIN'/);
  assert.match(rules, /hasProfileRole\('ADMIN'\)/);
  assert.match(rules, /validProperty\(request\.resource\.data, id\)/);
  assert.match(roles, /revokeRefreshTokens/);
  assert.match(roles, /profileSnap\.exists/);
  assert.match(roles, /await writeProfile\(\);\s*await writeClaim\(\);/s);
  assert.match(agents, /file\.size <= 0/);
});

test('fresh production project uses stable default Firestore only', () => {
  const client = fs.readFileSync('src/lib/firebase/client.ts', 'utf8');
  const firebaseJson = JSON.parse(fs.readFileSync('firebase.json', 'utf8'));
  const preflight = fs.readFileSync('scripts/validate-production.mjs', 'utf8');
  const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  assert.match(client, /db = getFirestore\(app\)/);
  assert.doesNotMatch(client, /getFirestore\(app,\s*firebaseDatabaseId\)/);
  assert.deepEqual(firebaseJson.firestore, [{ database: '(default)', rules: 'firestore.rules' }]);
  assert.match(preflight, /named-database getFirestore\(app, databaseId\) is not allowed in production/);
  assert.equal(pkg.version, '1.0.0');
  assert.equal(pkg.name, 'chantakorn-property-production');
  assert.equal(pkg.scripts['migrate:firestore-default'], undefined);
  assert.equal(fs.existsSync('firestore.legacy-deny.rules'), false);
  assert.equal(fs.existsSync('scripts/migrate-firestore-to-default.mjs'), false);
});

test('v6.2 privacy and property editing hardening avoids account enumeration and stale optional fields', () => {
  const forgot = fs.readFileSync('src/app/forgot-password/page.tsx', 'utf8');
  const store = fs.readFileSync('src/lib/store/properties-store.ts', 'utf8');
  assert.match(forgot, /auth\/user-not-found/);
  assert.match(forgot, /setSent\(true\)/);
  assert.match(store, /normalized\.year_built = deleteField\(\)/);
  assert.match(store, /normalized\.agent_id = deleteField\(\)/);
  assert.match(store, /normalized\.subdistrict = deleteField\(\)/);
});


test('v6.2 Storage authorization cross-checks profile role and role changes fail closed', () => {
  const storageRules = fs.readFileSync('storage.rules', 'utf8');
  const roleScript = fs.readFileSync('scripts/set-user-role.mjs', 'utf8');
  assert.match(storageRules, /firestore\.get\(\/databases\/\(default\)\/documents\/profiles\/\$\(request\.auth\.uid\)\)\.data\.role/);
  assert.match(storageRules, /request\.auth\.token\.role == 'ADMIN'/);
  assert.match(storageRules, /request\.auth\.token\.role == 'AGENT'/);
  assert.match(storageRules, /request\.auth\.token\.email_verified == true/);
  assert.match(roleScript, /role !== 'USER' && !user\.emailVerified/);
  assert.match(roleScript, /await writeProfile\(\);\s*await writeClaim\(\);/s);
  assert.doesNotMatch(roleScript, /const isPromotion/);
});


test('failed media uploads clean up partially-created Storage objects', () => {
  const propertyMedia = fs.readFileSync('src/lib/store/property-media.ts', 'utf8');
  const agentsStore = fs.readFileSync('src/lib/store/agents-store.ts', 'utf8');
  assert.match(propertyMedia, /uploadedRefs\.map\(objectRef => deleteObject\(objectRef\)/);
  assert.match(propertyMedia, /catch \(error\)[\s\S]*throw error/);
  assert.match(agentsStore, /catch \(error\)[\s\S]*deleteObject\(objectRef\)[\s\S]*throw error/);
});



