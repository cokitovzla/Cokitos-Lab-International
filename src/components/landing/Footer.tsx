import React, { useState } from 'react';
import { LabLogo } from '../common/LabLogo.tsx';
import { LegalModal } from './LegalModal.tsx';
import { Language, translations } from '../../lib/i18n.ts';
import { trackSectionNavigation } from '../../lib/analytics.ts';
import { Lock, Mail, Phone, MapPin, ArrowUp, Globe } from 'lucide-react';

interface FooterProps {
  onOpenAdmin: () => void;
  onNavigateToSection: (sectionId: string, slug: string) => void;
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
  contactEmail?: string;
  contactPhone?: string;
  location?: string;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenAdmin,
  onNavigateToSection,
  currentLang,
  onLanguageChange,
  contactEmail = 'contacto@cokitoslab.com',
  contactPhone = '+58 412 000 0000',
  location = 'Laboratorio Virtual & Operaciones Remotas',
}) => {
  const [legalModalType, setLegalModalType] = useState<'privacy' | 'terms' | null>(null);

  const t = translations[currentLang].footer;
  const navT = translations[currentLang].nav;
  const currentYear = new Date().getFullYear();

  const languages: { code: Language; label: string }[] = [
    { code: 'es', label: 'Español (ES)' },
    { code: 'en', label: 'English (EN)' },
    { code: 'fr', label: 'Français (FR)' },
  ];

  const handleLinkClick = (id: string, slug: string) => {
    trackSectionNavigation(slug, 'footer_nav_click');
    onNavigateToSection(id, slug);
  };

  return (
    <>
      <footer className="bg-[#EAF6FD] border-t border-[#CCE8F6] pt-8 pb-6 text-[#1E3A52]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 pb-6 border-b border-[#CCE8F6]">
            
            {/* Brand Block */}
            <div className="lg:col-span-5 flex flex-col items-start">
              <LabLogo variant="horizontal" size="sm" showDescriptor={true} className="mb-2" />
              <p className="text-xs text-[#1E3A52] leading-relaxed max-w-sm mb-3">
                {t.desc}
              </p>
              <div className="text-[11px] font-mono text-[#00897B] border border-[#00E3B2] bg-white px-2.5 py-1 rounded font-bold shadow-2xs">
                {t.slogan}
              </div>

              {/* Multilanguage Selector in Footer (as requested) */}
              <div className="mt-4 flex items-center gap-1.5 p-1 rounded-md bg-white border border-[#BCE4F7] text-xs font-mono shadow-2xs">
                <Globe className="w-3.5 h-3.5 text-[#009bb3] ml-1.5 mr-1" />
                {languages.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => {
                      trackSectionNavigation(`/lang/${l.code}`, 'footer_lang_switch');
                      onLanguageChange(l.code);
                    }}
                    className={`px-2 py-0.5 rounded text-[11px] font-bold transition-colors cursor-pointer ${
                      currentLang === l.code
                        ? 'bg-[#00D9F5] text-[#0B1F2D] shadow-xs'
                        : 'text-[#1E3A52] hover:text-[#009bb3] hover:bg-[#F0F9FF]'
                    }`}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Navigation with slash paths */}
            <div className="lg:col-span-3">
              <span className="font-mono text-xs uppercase tracking-wider text-[#0B1F2D] block mb-2 font-bold">
                {t.navTitle}
              </span>
              <ul className="space-y-1.5 text-xs font-medium">
                {[
                  { label: navT.why, id: 'laboratorio', slug: '/why-purpose' },
                  { label: navT.what, id: 'servicios', slug: '/what-services' },
                  { label: navT.how, id: 'metodologia', slug: '/how-method' },
                  { label: navT.projects, id: 'proyectos', slug: '/projects' },
                  { label: navT.contact, id: 'contacto', slug: '/contact' },
                ].map((item) => (
                  <li key={item.id}>
                    <button
                      onClick={() => handleLinkClick(item.id, item.slug)}
                      className="hover:text-[#009bb3] text-[#1E3A52] transition-colors cursor-pointer text-left flex items-center gap-1"
                    >
                      <span className="text-[#009bb3] font-bold text-[10px]">/</span>
                      <span>{item.label}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Configurable Contact Information */}
            <div className="lg:col-span-4">
              <span className="font-mono text-xs uppercase tracking-wider text-[#0B1F2D] block mb-2 font-bold">
                {t.contactTitle}
              </span>
              <ul className="space-y-2 text-xs">
                <li className="flex items-center gap-2.5 text-[#1E3A52]">
                  <Mail className="w-3.5 h-3.5 text-[#009bb3] shrink-0" />
                  <a href={`mailto:${contactEmail}`} className="hover:text-[#009bb3] transition-colors font-mono font-medium">
                    {contactEmail}
                  </a>
                </li>
                <li className="flex items-center gap-2.5 text-[#1E3A52] font-mono">
                  <Phone className="w-3.5 h-3.5 text-[#00897B] shrink-0" />
                  <span>{contactPhone}</span>
                </li>
                <li className="flex items-center gap-2.5 text-[#1E3A52] font-mono">
                  <MapPin className="w-3.5 h-3.5 text-[#009bb3] shrink-0" />
                  <span>{location}</span>
                </li>
              </ul>

              <div className="mt-3 pt-2 border-t border-[#CCE8F6]">
                <button
                  onClick={() => {
                    trackSectionNavigation('/admin', 'footer_admin_link');
                    onOpenAdmin();
                  }}
                  className="inline-flex items-center gap-1.5 text-xs font-mono text-[#009bb3] hover:text-[#00897B] font-bold transition-colors cursor-pointer"
                >
                  <Lock className="w-3 h-3" />
                  <span>{t.crmLink}</span>
                </button>
              </div>
            </div>

          </div>

          {/* Sub-footer: Legal & Dynamic Copyright */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] font-mono text-[#64748B]">
            <div>
              © {currentYear} COKITO’S LAB. {t.rights}
            </div>

            <div className="flex items-center gap-5">
              <button
                onClick={() => {
                  trackSectionNavigation('/legal/privacy', 'privacy_modal');
                  setLegalModalType('privacy');
                }}
                className="hover:text-[#009bb3] transition-colors cursor-pointer font-medium"
              >
                {t.privacy}
              </button>
              <button
                onClick={() => {
                  trackSectionNavigation('/legal/terms', 'terms_modal');
                  setLegalModalType('terms');
                }}
                className="hover:text-[#009bb3] transition-colors cursor-pointer font-medium"
              >
                {t.terms}
              </button>
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="p-1.5 rounded bg-white hover:bg-[#D0EBF7] text-[#009bb3] transition-colors border border-[#BCE4F7] cursor-pointer shadow-2xs"
                title="Top"
                aria-label="Top"
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
