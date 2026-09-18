'use client';

import { MessageCircle } from 'lucide-react';
import { SITE_CONFIG } from '@/config/site';

export default function FloatingLineButton() {
  return (
    <aside aria-label="ช่องทางติดต่อ LINE" className="fixed bottom-20 right-5 z-40 md:bottom-8">
      <a
        href={SITE_CONFIG.lineUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex h-12 w-12 items-center justify-center rounded-full bg-[#06C755] text-white shadow-lg transition-transform hover:-translate-y-0.5"
        title="แชทคุยกับเราใน LINE Official Account"
        aria-label="คุยกับ Chantakorn Property ทาง LINE"
      >
        <MessageCircle className="h-5 w-5 fill-current" />
      </a>
    </aside>
  );
}
