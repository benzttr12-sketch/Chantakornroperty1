# Chantakorn Property — Fresh Production Project

เว็บไซต์อสังหาริมทรัพย์สำหรับหาดใหญ่–สงขลา พัฒนาด้วย Next.js, TypeScript, Tailwind CSS และ Firebase โดยใช้ Firebase Authentication, Cloud Firestore `(default)` และ Firebase Storage ไม่มี Demo Login หรือ fallback ไปข้อมูลประกาศตัวอย่าง

## Production baseline

- ประกาศใหม่เริ่มเป็นฉบับร่างและต้องมีรูปจริง พิกัดจริง ราคา และรายละเอียดขั้นต่ำก่อนบันทึก
- หน้าแสดงทรัพย์ไม่สมมติสถานะพร้อมโอน/พร้อมเข้าอยู่ เอกสารสิทธิ์ หรือเวลาเดินทางหากไม่มีข้อมูลจริง
- Firestore Rules ตรวจโครงสร้าง property/inquiry/profile และใช้ server timestamp สำหรับข้อมูลที่สร้างใหม่
- ลิงก์ยืนยันอีเมลและรีเซ็ตรหัสผ่านกลับมายังหน้า `/login`
- ใช้ Firestore `(default)` ตั้งแต่วันแรก ไม่มี legacy named database หรือ migration path ในโปรเจกต์นี้
- Storage ตรวจ role ซ้ำจาก `profiles` และบังคับ staff ต้องยืนยันอีเมล
- การอัปโหลดรูปที่ล้มเหลวกลางทาง cleanup ไฟล์ที่สร้างค้างใน Storage
- รองรับ Firebase App Check, GitHub Pages, production preflight และ role hardening

## เริ่มต้น

ต้องใช้ Node.js 22 ขึ้นไป

```bash
npm install
cp .env.example .env.local
npm run dev
```

หลัง `npm install` สำเร็จครั้งแรก ให้ commit `package-lock.json` เพื่อให้ CI ใช้ `npm ci` และติดตั้ง dependency ชุดเดิมทุกครั้ง

## Firebase

ตั้งค่าฝั่งเว็บผ่าน `.env.local` หรือระบบ deploy:

```env
NEXT_PUBLIC_SITE_URL=https://your-domain.example
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
NEXT_PUBLIC_FIREBASE_APPCHECK_SITE_KEY=...
```

Environment variables มีลำดับความสำคัญสูงกว่า `firebase-applet-config.json` ซึ่งเก็บเฉพาะ Firebase Web configuration ที่ใช้ใน client เท่านั้น ห้ามใส่ Service Account หรือ private key ในไฟล์นั้นหรือในตัวแปร `NEXT_PUBLIC_*`

## เปิดบริการใน Firebase Console

1. เปิด **Authentication > Sign-in method > Email/Password**
2. สร้าง Cloud Firestore **`(default)` database**
3. เปิด Firebase Storage
4. เพิ่มโดเมนเว็บจริงและโดเมน GitHub Pages ใน **Authentication > Settings > Authorized domains**
5. Deploy rules:

```bash
npm install -g firebase-tools
firebase login
firebase deploy --only firestore:rules,storage
```

## Firebase App Check

ระบบรองรับ reCAPTCHA Enterprise ผ่าน `NEXT_PUBLIC_FIREBASE_APPCHECK_SITE_KEY`

1. สร้าง score-based reCAPTCHA Enterprise key สำหรับโดเมนจริง
2. ลงทะเบียน Web app ใน **Firebase Console > App Check**
3. ใส่ site key ใน environment
4. Deploy และตรวจ metrics ก่อน
5. เปิด **Enforce** สำหรับ Firestore/Storage หลังยืนยันว่า traffic จริงได้รับ token แล้ว

อย่าเปิด enforcement ก่อน key ถูก deploy เพราะผู้ใช้จริงอาจถูกปฏิเสธการเชื่อมต่อ

## สิทธิ์ ADMIN / AGENT

Firestore และ Storage ตรวจสิทธิ์เจ้าหน้าที่จากทั้ง Firebase Auth Custom Claim, อีเมลที่ยืนยันแล้ว และ `profiles.role` ใน Firestore `(default)` ให้ตรงกัน

เก็บ Service Account ไว้นอก repository แล้วรัน:

```bash
export GOOGLE_APPLICATION_CREDENTIALS="/absolute/path/to/service-account.json"
export FIREBASE_PROJECT_ID="your-firebase-project-id"
export FIREBASE_DATABASE_ID="(default)"

npm run set-role -- admin@example.com ADMIN
npm run set-role -- agent@example.com AGENT
npm run set-role -- customer@example.com USER
```

หลังเปลี่ยน role สคริปต์จะ revoke refresh tokens และผู้ใช้ต้องออกจากระบบแล้วเข้าสู่ระบบใหม่

## Collections

- `properties` — ประกาศทรัพย์
- `agents` — นายหน้า/ผู้ดูแลทรัพย์
- `inquiries` — คำถาม นัดชม และคำขอฝากขาย
- `profiles` — โปรไฟล์สมาชิกและ role ที่แสดงในระบบ

ผู้สมัครผ่าน `/register` เริ่มต้นเป็น `USER` เท่านั้น ผู้ใช้แก้ role ของตัวเองจาก client ไม่ได้

## Storage

- รูปนายหน้า: `agent-photos/{agentId}/...` — แก้ไขได้เฉพาะ `ADMIN`
- รูปทรัพย์: `property-images/{staffUid}/{folder}/...` — `AGENT` จัดการได้เฉพาะ path ของ UID ตัวเอง ส่วน `ADMIN` จัดการได้ทั้งหมด

หน้าเพิ่ม/แก้ทรัพย์รองรับ JPG/PNG/WebP รูปละไม่เกิน 10 MB สูงสุด 20 รูป พร้อมตั้งรูปปกและเรียงลำดับ

## สมาชิก

- `/register` สมัคร Firebase Auth จริงและส่งอีเมลยืนยัน
- `/login` ตรวจ email verification
- `/forgot-password` ใช้ Firebase Password Reset
- `/favorites` เก็บรายการโปรดใน browser เครื่องนั้น
- `/admin` ต้องมี Custom Claim `ADMIN` หรือ `AGENT` ตามหน้าที่

## GitHub Pages

โปรเจกต์นี้เตรียมไว้สำหรับ repo ชื่อ `Chantakorn-Property-Production` ภายใต้บัญชี `benzttr12-sketch` ค่า fallback จึงเป็น:

```text
https://benzttr12-sketch.github.io/Chantakorn-Property-Production
```

Workflow `.github/workflows/pages.yml` ทำ lint → typecheck → test/preflight → static build/deploy และใช้ URL/Base Path ที่ GitHub Pages รายงานให้อัตโนมัติ

## Production preflight

ก่อน deploy ให้รัน:

```bash
NEXT_PUBLIC_SITE_URL=https://your-live-site.example npm run preflight
```

จากนั้นตรวจ release:

```bash
npm install
NEXT_PUBLIC_SITE_URL=https://your-live-site.example npm run preflight
npm run verify
npm run build:pages
npm run preview:pages
```

ดูขั้นตอนเปิดจริงแบบทีละข้อใน [`DEPLOYMENT_CHECKLIST.md`](DEPLOYMENT_CHECKLIST.md)

## ข้อมูลติดต่อ

ค่ากลางอยู่ใน `src/config/site.ts` และ override ได้ผ่าน environment variables ใน `.env.example`

ก่อนประชาสัมพันธ์เว็บในวงกว้าง ให้ตรวจ Privacy Policy, ข้อมูลติดต่อ, รูป/รายละเอียดทรัพย์, App Check และสิทธิ์เจ้าหน้าที่ให้ตรงกับการดำเนินงานจริง
