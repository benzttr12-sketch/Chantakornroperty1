# Security Policy

## Supported version

Only the latest production release of this repository is supported. The current release line is **v6.1.x**.

## Reporting a vulnerability

Please do not open a public GitHub issue for vulnerabilities that could expose customer information, authentication data, Firebase rules bypasses, or administrative access.

Report security concerns privately to the contact email configured for CHANTAKORN PROPERTY. Include:

- the affected page or Firebase resource;
- steps to reproduce the issue;
- the impact you observed;
- screenshots or logs with personal data removed.

Do not include Firebase Admin service-account credentials, private keys, passwords, session tokens, or customer personal data in the report.

## Credential handling

Firebase Web configuration (`NEXT_PUBLIC_FIREBASE_*`) is client configuration and is protected by Authentication, App Check, Firestore Rules, and Storage Rules. Administrative Firestore access requires both the Firebase Auth role claim and the matching profile role. Firebase Admin service-account files and private keys must never be committed to this repository or exposed through `NEXT_PUBLIC_*` variables.
