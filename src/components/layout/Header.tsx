'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { 
  Menu, 
  X, 
  PlusCircle, 
  User, 
  Heart, 
  Building2, 
  ChevronRight,
} from 'lucide-react';
import { getFavoriteIds } from '@/lib/store/properties-store';
import { SITE_CONFIG } from '@/config/site';
import { auth } from '@/lib/firebase/client';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [favCount, setFavCount] = useState(0);
  const [accountHref, setAccountHref] = useState('/login');
  const [accountLabel, setAccountLabel] = useState('เข้าสู่ระบบ');
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const updateFavs = () => {
      setFavCount(getFavoriteIds().length);
    };
    updateFavs();
    window.addEventListener('favorites-updated', updateFavs);
    window.addEventListener('storage', updateFavs);
    return () => { window.removeEventListener('favorites-updated', updateFavs); window.removeEventListener('storage', updateFavs); };
  }, []);


  useEffect(() => {
    if (!auth) return;
    let active = true;
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!active) return;
      if (!user) {
        setAccountHref('/login');
        setAccountLabel('เข้าสู่ระบบ');
        return;
      }
      try {
        const token = await user.getIdTokenResult();
        const role = token.claims.role;
        if (!active) return;
        if (role === 'ADMIN' || role === 'AGENT') {
          setAccountHref('/admin');
          setAccountLabel('หลังบ้าน');
        } else {
          setAccountHref('/favorites');
          setAccountLabel('บัญชีของฉัน');
        }
      } catch {
        if (active) {
          setAccountHref('/favorites');
          setAccountLabel('บัญชีของฉัน');
        }
      }
    });
    return () => { active = false; unsubscribe(); };
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const navLinks = [
    { name: 'หน้าแรก', href: '/' },
    { name: 'ซื้อ', href: '/buy' },
    { name: 'เช่า', href: '/rent' },
    { name: 'ฝากขาย', href: '/sell' },
    { name: 'ทรัพย์ทั้งหมด', href: '/properties' },
    { name: 'บริการ', href: '/services' },
    { name: 'เกี่ยวกับเรา', href: '/about' },
  ];

  return (
    <>
      {/* Main Sticky Header */}
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          isScrolled
            ? 'bg-navy-950/95 backdrop-blur-md shadow-lg border-b border-navy-800/80 py-2.5'
            : 'bg-navy-950 border-b border-navy-800 py-3.5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center text-navy-950 font-bold shadow-md group-hover:scale-105 transition-transform">
              <Building2 className="w-6 h-6 text-navy-950" />
            </div>
            <div className="flex flex-col">
              <span className="text-white font-bold text-lg tracking-wider leading-none">
                CHANTAKORN
              </span>
              <span className="text-gold-400 text-xs font-semibold tracking-widest leading-tight">
                PROPERTY
              </span>
            </div>
          </Link>

          {/* Center Navigation Links (Desktop) */}
          <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                    isActive
                      ? 'text-gold-400 bg-navy-800 font-semibold'
                      : 'text-gray-200 hover:text-gold-400 hover:bg-navy-900/80'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Right Actions */}
          <div className="hidden lg:flex items-center space-x-3">
            <Link
              href="/favorites"
              className="relative p-2 text-gray-300 hover:text-gold-400 hover:bg-navy-900 rounded-lg transition-colors"
              title="ทรัพย์ที่บันทึกไว้"
            >
              <Heart className="w-5 h-5" />
              {favCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {favCount}
                </span>
              )}
            </Link>

            <Link
              href={accountHref}
              className="flex items-center space-x-1.5 text-gray-200 hover:text-gold-400 px-3 py-1.5 text-sm font-medium transition-colors"
            >
              <User className="w-4 h-4" />
              <span>{accountLabel}</span>
            </Link>

            <Link
              href="/sell"
              className="flex items-center space-x-1 px-3.5 py-1.5 text-xs font-semibold text-gold-300 border border-gold-500/40 hover:border-gold-400 hover:bg-gold-500/10 rounded-lg transition-all"
            >
              <PlusCircle className="w-3.5 h-3.5 text-gold-400" />
              <span>ลงประกาศ</span>
            </Link>

            <Link
              href="/contact"
              className="px-4 py-2 text-xs font-bold text-navy-950 bg-gradient-to-r from-gold-400 to-gold-500 hover:from-gold-300 hover:to-gold-400 rounded-lg shadow-sm hover:shadow-gold-500/20 transition-all transform hover:-translate-y-0.5"
            >
              ติดต่อเรา
            </Link>
          </div>

          {/* Mobile Right Icons & Hamburger */}
          <div className="flex items-center space-x-2 lg:hidden">
            <Link
              href="/favorites"
              className="relative p-2 text-gray-300 hover:text-gold-400 rounded-lg"
            >
              <Heart className="w-5 h-5" />
              {favCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {favCount}
                </span>
              )}
            </Link>

            <button type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-gray-200 hover:text-gold-400 hover:bg-navy-900 rounded-lg focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Slide-down Navigation Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-[60px] bottom-0 z-30 bg-navy-950/98 backdrop-blur-xl border-t border-navy-800 flex flex-col p-6 overflow-y-auto animate-fadeIn">
          <div className="flex flex-col space-y-2 mb-6">
            <div className="text-xs font-semibold text-gold-400 uppercase tracking-wider mb-1 px-2">
              เมนูหลัก
            </div>
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-base font-medium transition-colors ${
                    isActive
                      ? 'bg-navy-800 text-gold-400 font-semibold'
                      : 'text-gray-200 hover:bg-navy-900 hover:text-white'
                  }`}
                >
                  <span>{link.name}</span>
                  <ChevronRight className="w-4 h-4 text-gray-500" />
                </Link>
              );
            })}
          </div>

          <div className="border-t border-navy-800/80 pt-5 flex flex-col space-y-3 pb-20">
            <Link
              href="/sell"
              className="w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-xl border border-gold-400/50 text-gold-400 font-medium hover:bg-gold-400/10"
            >
              <PlusCircle className="w-4 h-4" />
              <span>ลงประกาศ / ฝากขายทรัพย์</span>
            </Link>

            <Link
              href={accountHref}
              className="w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-xl bg-navy-800 text-white font-medium hover:bg-navy-700"
            >
              <User className="w-4 h-4" />
              <span>{accountLabel === 'เข้าสู่ระบบ' ? 'เข้าสู่ระบบ / ลงทะเบียน' : accountLabel}</span>
            </Link>

            <Link
              href="/contact"
              className="w-full flex items-center justify-center py-3 px-4 rounded-xl bg-gradient-to-r from-gold-400 to-gold-500 text-navy-950 font-bold shadow-md"
            >
              ติดต่อ Chantakorn Property
            </Link>

            <div className="mt-4 pt-4 border-t border-navy-900 text-center text-xs text-gray-400 space-y-1.5">
              <div>โทร: <a href={SITE_CONFIG.phoneHref} className="text-gold-400 font-semibold">{SITE_CONFIG.phoneDisplay}</a></div>
              <div>
                <a
                  href={SITE_CONFIG.facebookUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-400 hover:underline"
                >
                  Facebook: Chantakorn Property
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
