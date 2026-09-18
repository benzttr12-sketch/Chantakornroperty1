# Production Deployment Checklist — Fresh Project

Use this checklist before publishing production.

## Firebase

- [ ] Authentication > Email/Password is enabled.
- [ ] Firestore `(default)` database exists and `firebase.json` targets `(default)` only.
- [ ] Firebase Storage is enabled.
- [ ] Authorized domains include the live website domain and GitHub Pages domain if Pages is used.
- [ ] `firebase deploy --only firestore:rules,storage` completes successfully.
- [ ] The owner/admin Firebase Authentication email is verified before assigning a staff role.
- [ ] The owner/admin account has the `ADMIN` custom claim (`npm run set-role -- email@example.com ADMIN`).
- [ ] After any role change, the affected user signs out and signs in again.
- [ ] App Check is registered for the live domain; enforcement is enabled only after valid-token traffic is confirmed.

## GitHub repository settings

- [ ] Repository name and `src/config/site-url.ts` fallback match the intended GitHub Pages URL.
- [ ] Pages source is **GitHub Actions**.
- [ ] `NEXT_PUBLIC_FIREBASE_API_KEY` is configured as a repository secret, or the checked-in public web config is intentionally used.
- [ ] Firebase public configuration values are configured as repository variables when overriding `firebase-applet-config.json`.
- [ ] No Service Account JSON, private key, `.env.local`, or customer export is committed.

## Website content

- [ ] Phone, email, LINE, Facebook, address, and business hours are correct.
- [ ] Privacy Policy reflects the actual business process and contact information.
- [ ] At least one real agent record exists in Firestore before advertising the team page.
- [ ] New properties are reviewed as drafts before publishing; published properties use real photos, accurate coordinates, prices, and details.
- [ ] Test inquiries appear in Admin and can be moved through their statuses.
- [ ] Registration, email verification, login, password reset, and logout work on the live domain.

## Release verification

Run on a machine with npm registry access:

```bash
npm install
npm run preflight
npm run verify
npm run build:pages
npm run preview:pages
```

After the first successful `npm install`, commit `package-lock.json`. The workflow automatically switches to `npm ci` when the lockfile exists.
