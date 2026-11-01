import React, { useState } from 'react';
import { LabLogo } from '../common/LabLogo.tsx';
import { LegalModal } from './LegalModal.tsx';
import { Language, translations } from '../../lib/i18n.ts';
import { trackSectionNavigation } from '../../lib/analytics.ts';
import { 
  Mail, 
  ArrowUp, 
  Globe, 
  MessageSquare, 
  ShieldCheck,
  LayoutDashboard
} from 'lucide-react';

interface FooterProps {
  onOpenAdmin: () => void;
  onNavigateToSection: (sectionId: string, slug: string) => void;
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
  contactEmail?: string;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenAdmin,
  onNavigateToSection,
  currentLang,
  onLanguageChange,
  contactEmail = 'cokito.int@gmail.com',
}) => {
  const [legalModalType, setLegalModalType] = useState<'privacy' | 'terms' | null>(null);

  const t = translations[currentLang].footer;
  const navT = translations[currentLang].nav;
  const currentYear = new Date().getFullYear();

  const languages: { code: Language; label: string }[] = [
    { code: 'es', label: 'ES' },
    { code: 'en', label: 'EN' },
    { code: 'fr', label: 'FR' },
  ];

  const handleLinkClick = (id: string, slug: string) => {
    trackSectionNavigation(slug, 'footer_nav_click');
    onNavigateToSection(id, slug);
  };

  return (
    <>
      <footer className="bg-white border-t border-[#D0EBF7] pt-10 pb-8 text-[#1E3A52]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          {/* Main Footer Row */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-8 border-b border-[#E2E8F0]">
            
            {/* Left: Brand Identity & Positioning */}
            <div className="md:col-span-6 space-y-3">
              <LabLogo variant="horizontal" size="md" showDescriptor={true} />
              
              <p className="text-xs text-[#475569] leading-relaxed max-w-md font-sans">
                {t.desc}
              </p>

              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="text-[11px] font-mono text-[#00897B] bg-[#E8F8F5] border border-[#A7F3D0] px-2.5 py-1 rounded-md font-bold">
                  {t.slogan}
                </span>
                <span className="text-[11px] font-mono text-[#64748B] bg-[#F1F5F9] px-2.5 py-1 rounded-md">
                  Laboratorio Tecnológico
                </span>
              </div>
            </div>

            {/* Middle: Navigation Links */}
            <div className="md:col-span-3 space-y-2">
              <span className="font-mono text-xs uppercase tracking-wider text-[#0B1F2D] block font-bold">
                {t.navTitle}
              </span>
              <ul className="space-y-1.5 text-xs">
                {[
                  { label: navT.why, id: 'laboratorio', slug: '/why-purpose' },
                  { label: navT.what, id: 'servicios', slug: '/what-services' },
                  { label: navT.how, id: 'metodologia', slug: '/how-method' },
                  { label: navT.projects, id: 'proyectos', slug: '/projects' },
                  { label: navT.contact, id: 'contacto', slug: '/contact' },
                ].map((item) => (
                  <li key={item.slug}>
                    <button
                      onClick={() => handleLinkClick(item.id, item.slug)}
                      className="text-[#64748B] hover:text-[#009bb3] transition-colors cursor-pointer"
                    >
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right: Central Direct Contact & Language */}
            <div className="md:col-span-3 space-y-3">
              <span className="font-mono text-xs uppercase tracking-wider text-[#0B1F2D] block font-bold">
                Canales Oficiales
              </span>

              <div className="space-y-2 text-xs font-mono">
                <div className="flex items-center gap-2 text-[#0B1F2D]">
                  <Mail className="w-3.5 h-3.5 text-[#009bb3] shrink-0" />
                  <a href={`mailto:${contactEmail}`} className="hover:text-[#009bb3] transition-colors">
                    {contactEmail}
                  </a>
                </div>

                <a
                  href="https://wa.me/584224612534"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#EAF6FD] hover:bg-[#00D9F5] text-[#00897B] hover:text-[#0B1F2D] font-mono text-xs font-bold transition-all border border-[#BCE4F7]"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>WhatsApp: +58 422 461 2534</span>
                </a>
              </div>

              {/* Language Selector */}
              <div className="flex items-center gap-1 pt-1">
                <Globe className="w-3.5 h-3.5 text-[#64748B] mr-1" />
                {languages.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => onLanguageChange(l.code)}
                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold transition-all cursor-pointer ${
                      currentLang === l.code
                        ? 'bg-[#00D9F5] text-[#0B1F2D]'
                        : 'text-[#64748B] hover:bg-[#F1F5F9]'
                    }`}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Sub-footer Line: Copyright, Legal & Subtle Discreet Admin Icon */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-[#64748B]">
            <div>
              © {currentYear} <span className="font-bold text-[#0B1F2D]">COKITO’S LAB</span>. {t.rights}
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => setLegalModalType('privacy')}
                className="hover:text-[#009bb3] cursor-pointer"
              >
                {t.privacy}
              </button>
              <span>·</span>
              <button
                onClick={() => setLegalModalType('terms')}
                className="hover:text-[#009bb3] cursor-pointer"
              >
                {t.terms}
              </button>

              {/* Discreet internal Control Center icon box */}
              <button
                onClick={onOpenAdmin}
                className="w-7 h-7 rounded-lg bg-[#F1F5F9] hover:bg-[#00D9F5]/20 text-[#64748B] hover:text-[#009bb3] border border-[#CBD5E1] hover:border-[#00D9F5] flex items-center justify-center transition-all cursor-pointer ml-2"
                title="Centro de Control"
                aria-label="Centro de Control"
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="w-7 h-7 rounded-lg bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#64748B] flex items-center justify-center transition-all cursor-pointer"
                title="Volver arriba"
                aria-label="Volver arriba"
              >
                <ArrowUp className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>
      </footer>

      {/* Legal Dialog */}
      <LegalModal
        type={legalModalType}
        onClose={() => setLegalModalType(null)}
      />
    </>
  );
};
