const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');

test('production source contains no demo authentication or sample property fallback', () => {
  const backend = fs.readFileSync('src/lib/backend.ts', 'utf8');
  const store = fs.readFileSync('src/lib/store/properties-store.ts', 'utf8');
  const login = fs.readFileSync('src/app/login/page.tsx', 'utf8');
  assert.doesNotMatch(backend, /ENABLE_DEMO|isDemoAuthEnabled|isDemoMode/);
  assert.doesNotMatch(store, /SAMPLE_PROPERTIES|demo-admin|demo-agent|demo-user/);
  assert.doesNotMatch(login, /Demo Mode|handleQuickDemoLogin|chantakorn_auth_user/);
});

test('property links always use the live detail loader', () => {
  const links = fs.readFileSync('src/components/properties/property-link.ts', 'utf8');
  assert.match(links, /\/properties\/detail\?slug=/);
  assert.doesNotMatch(links, /sample-properties|staticSlugs/);
});
