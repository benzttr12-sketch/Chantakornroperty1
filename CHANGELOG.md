# Changelog

## 1.0.0 — Fresh production baseline

- Created a clean project from the audited production application code.
- Uses Firestore `(default)` only; legacy named-database migration code and deny rules were removed.
- Keeps Firebase Authentication, Firestore, Storage, App Check support, role hardening, media cleanup, SEO, GitHub Pages workflow, and production preflight checks.
- New listings start as drafts and require real listing data before publishing.
- Staff access requires verified email plus matching Auth custom claim and Firestore profile role.
- Password reset avoids account enumeration.
- Deployment checks scan for accidental Firebase Admin credentials and invalid production configuration.
