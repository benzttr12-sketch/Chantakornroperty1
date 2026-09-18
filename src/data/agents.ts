import { SITE_CONFIG } from '@/config/site';
import { Agent } from '@/lib/types';

// Fallback contact shown only when a property has no assigned agent in Firestore.
// Keep this entry limited to business-level contact details; real agents belong in the Firestore agents collection.
export const DEFAULT_AGENT: Agent = {
  id: 'chantakorn-property',
  name: 'CHANTAKORN PROPERTY',
  title: 'ทีมที่ปรึกษาอสังหาริมทรัพย์ หาดใหญ่–สงขลา',
  phone: SITE_CONFIG.phoneDisplay,
  line_id: SITE_CONFIG.lineLabel,
  facebook: SITE_CONFIG.facebookUrl,
  email: SITE_CONFIG.email,
  photo_url: '',
  bio: 'ติดต่อทีมงานเพื่อสอบถามข้อมูล นัดชมทรัพย์ หรือฝากขายอสังหาริมทรัพย์',
};

