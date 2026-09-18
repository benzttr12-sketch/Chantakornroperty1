'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { 
  Building2, 
  ShieldCheck, 
  HeartHandshake, 
  CheckCircle2, 
  Award, 
  Phone, 
} from 'lucide-react';
import { DEFAULT_AGENT } from '@/data/agents';
import { fetchAgents } from '@/lib/store/properties-store';
import { Agent } from '@/lib/types';

export default function AboutPage() {
  const [agents, setAgents] = useState<Agent[]>([DEFAULT_AGENT]);

  useEffect(() => {
    fetchAgents().then(list => { if (list.length) setAgents(list); }).catch(() => {});
  }, []);

  const coreValues = [
    {
      title: 'ความจริงใจ (Sincerity)',
      description: 'เราให้ความสำคัญกับข้อมูลที่ชัดเจน ตรงไปตรงมา และการสื่อสารเงื่อนไขที่เกี่ยวข้อง เพื่อช่วยให้ลูกค้าพิจารณาทางเลือกได้อย่างรอบคอบ',
      icon: HeartHandshake,
    },
    {
      title: 'ความโปร่งใส (Transparency)',
      description: 'ช่วยรวบรวมและประสานข้อมูลเอกสารสิทธิ์ ภาระผูกพัน ราคา และค่าใช้จ่ายที่เกี่ยวข้อง เพื่อให้คู่สัญญาตรวจสอบข้อมูลก่อนตัดสินใจ',
      icon: ShieldCheck,
    },
    {
      title: 'การทำงานเป็นระบบ (Structured Service)',
      description: 'ทีมงานมุ่งดูแลการนำเสนอทรัพย์ การประสานนัดหมาย การสื่อสารระหว่างคู่สัญญา และขั้นตอนที่เกี่ยวข้องกับการซื้อขาย',
      icon: Award,
    },
    {
      title: 'ประสานงานตามขอบเขตบริการ',
      description: 'เราช่วยประสานงานตั้งแต่การนัดชม การเจรจา การรวบรวมข้อมูล ไปจนถึงการนัดหมายขั้นตอนสุดท้ายตามขอบเขตบริการที่ตกลงกัน',
      icon: CheckCircle2,
    },
  ];

  return (
    <div className="bg-surface-bg min-h-screen pb-24">
      {/* Banner */}
      <div className="bg-navy-950 text-white py-16 lg:py-24 border-b border-navy-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#C9A227_1px,transparent_1px)] [background-size:24px_24px] opacity-10" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-navy-900 border border-gold-500/30 text-gold-400 text-xs font-semibold mb-4">
            <Building2 className="w-3.5 h-3.5 text-gold-400" />
            <span>เกี่ยวกับเรา</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
            Chantakorn Property
          </h1>

          <p className="text-xl sm:text-2xl text-gold-400 font-semibold mb-4">
            นายหน้าอสังหาริมทรัพย์ หาดใหญ่ – สงขลา
          </p>

          <p className="text-base sm:text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed font-light">
            &ldquo;บ้าน • ที่ดิน • คอนโด • อสังหาริมทรัพย์ในหาดใหญ่–สงขลา พร้อมข้อมูลและช่องทางติดต่อที่ชัดเจน&rdquo;
          </p>
        </div>
      </div>

      {/* Brand Story Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-5">
            <span className="text-xs font-bold text-gold-600 uppercase tracking-widest bg-gold-50 px-3.5 py-1 rounded-full border border-gold-200">
              เรื่องราวของเรา
            </span>
            <h2 className="text-3xl font-extrabold text-navy-950 leading-tight">
              บริการอสังหาริมทรัพย์ในหาดใหญ่–สงขลา
            </h2>
            <p className="text-sm text-gray-700 leading-relaxed">
              <strong>CHANTAKORN PROPERTY (ฉันทากร พร็อพเพอร์ตี้)</strong> ให้บริการด้านอสังหาริมทรัพย์ในหาดใหญ่และสงขลา โดยเน้นการสื่อสารข้อมูลให้ชัดเจน การประสานงานระหว่างผู้ซื้อ ผู้ขาย และผู้เช่า และการดูแลตามขอบเขตบริการที่ตกลงกัน
            </p>
            <p className="text-sm text-gray-700 leading-relaxed">
              การซื้อ ขาย หรือเช่าอสังหาริมทรัพย์มีรายละเอียดหลายด้าน เราจึงช่วยรวบรวมข้อมูลทรัพย์ นัดหมาย ประสานการเจรจา และชี้ประเด็นเอกสารหรือค่าใช้จ่ายที่ควรตรวจสอบก่อนตัดสินใจ โดยผู้ใช้บริการยังควรตรวจสอบข้อมูลสำคัญกับหน่วยงานหรือผู้เชี่ยวชาญที่เกี่ยวข้องเมื่อจำเป็น
            </p>
          </div>
        </div>

        {/* Core Values (4 Pillars) */}
        <div className="mt-24">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-gold-600 uppercase tracking-widest bg-gold-50 px-3.5 py-1 rounded-full border border-gold-200">
              ค่านิยมหลัก
            </span>
            <h2 className="text-3xl font-extrabold text-navy-950 mt-2">
              4 เสาหลักในการบริการของเรา
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {coreValues.map((v) => {
              const Icon = v.icon;
              return (
                <div
                  key={v.title}
                  className="bg-white rounded-2xl p-6 border border-surface-border shadow-card flex flex-col justify-between hover:shadow-card-hover transition-all"
                >
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-gold-50 text-gold-600 border border-gold-200 flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold text-navy-950 mb-2">
                      {v.title}
                    </h3>
                    <p className="text-xs text-gray-700 leading-relaxed">
                      {v.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Team Members Section */}
        <div className="mt-24">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-gold-600 uppercase tracking-widest bg-gold-50 px-3.5 py-1 rounded-full border border-gold-200">
              ทีมงานของเรา
            </span>
            <h2 className="text-3xl font-extrabold text-navy-950 mt-2">
              พบกับทีมงาน Chantakorn Property
            </h2>
            <p className="text-xs sm:text-sm text-brand-muted mt-1">
              พร้อมดูแลและตอบทุกคำถามด้านอสังหาริมทรัพย์ในหาดใหญ่และสงขลา
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {agents.map((agent) => (
              <div
                key={agent.id}
                className="bg-white rounded-2xl p-6 border border-surface-border shadow-card flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-5"
              >
                <div className="relative w-28 h-28 rounded-2xl overflow-hidden border-2 border-gold-400 flex-shrink-0 shadow-md">
                  {agent.photo_url ? (
                    <Image
                      src={agent.photo_url}
                      alt={agent.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-navy-950 text-gold-400">
                      <Building2 className="h-10 w-10" />
                    </div>
                  )}
                </div>

                <div className="flex-grow text-center sm:text-left">
                  <h3 className="text-lg font-bold text-navy-950">{agent.name}</h3>
                  <p className="text-xs font-semibold text-gold-700 mt-0.5">{agent.title}</p>
                  <p className="text-xs text-gray-600 mt-2 leading-relaxed line-clamp-3">
                    {agent.bio}
                  </p>

                  <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-center sm:justify-start space-x-3 text-xs">
                    <a
                      href={`tel:${agent.phone}`}
                      className="font-bold text-navy-950 hover:text-gold-600 flex items-center space-x-1"
                    >
                      <Phone className="w-3.5 h-3.5 text-gold-600" />
                      <span>{agent.phone}</span>
                    </a>
                    <span className="text-gray-300">•</span>
                    <span className="text-gray-500">LINE: <strong className="text-emerald-600">{agent.line_id}</strong></span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
