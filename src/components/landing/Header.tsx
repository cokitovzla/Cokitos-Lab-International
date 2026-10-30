import React, { useState, useEffect } from 'react';
import { LabLogo } from '../common/LabLogo.tsx';
import { Language, translations } from '../../lib/i18n.ts';
import { trackSectionNavigation } from '../../lib/analytics.ts';
import { ArrowUpRight, Lock, Menu, X, ShieldCheck, Globe } from 'lucide-react';

interface HeaderProps {
  onOpenAdmin: () => void;
  onNavigateToSection: (sectionId: string, slug: string) => void;
  isAdminAuthenticated: boolean;
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenAdmin,
  onNavigateToSection,
  isAdminAuthenticated,
  currentLang,
  onLanguageChange,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const t = translations[currentLang].nav;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: t.why, id: 'laboratorio', slug: '/why-purpose' },
    { label: t.what, id: 'servicios', slug: '/what-services' },
    { label: t.how, id: 'metodologia', slug: '/how-method' },
    { label: t.projects, id: 'proyectos', slug: '/projects' },
    { label: t.contact, id: 'contacto', slug: '/contact' },
  ];

  const handleNavClick = (id: string, slug: string) => {
    trackSectionNavigation(slug, 'header_nav');
    onNavigateToSection(id, slug);
  };

  const languages: { code: Language; label: string }[] = [
    { code: 'es', label: 'ES' },
    { code: 'en', label: 'EN' },
    { code: 'fr', label: 'FR' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#F5FBFF]/95 backdrop-blur-md border-b border-[#00D9F5]/30 py-2.5 shadow-sm shadow-[#0B1F2D]/5'
          : 'bg-[#F5FBFF]/80 backdrop-blur-sm py-3.5 border-b border-[#00D9F5]/20'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-6">
          
          {/* Zone 1: Brand Wordmark */}
          <button
            onClick={() => {
              trackSectionNavigation('/inicio', 'header_logo');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center text-left focus:outline-none group cursor-pointer shrink-0"
            aria-label="Cokito's Lab"
          >
            <LabLogo variant="horizontal" size="sm" showDescriptor={false} />
          </button>

          {/* Zone 2: Navigation Links (Why, What, How, Projects, Contact) */}
          <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold uppercase tracking-wider text-[#0B1F2D]/80">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id, link.slug)}
                className="hover:text-[#00D9F5] transition-colors whitespace-nowrap cursor-pointer hover:underline underline-offset-8 decoration-[#00D9F5] flex items-center gap-1 font-mono"
              >
                <span className="text-[#00D9F5] font-bold text-[11px]">/</span>
                <span>{link.label}</span>
              </button>
            ))}
          </nav>

          {/* Zone 3: Language Selector + Primary Actions */}
          <div className="hidden sm:flex items-center gap-3 shrink-0">
            
            {/* Language Switcher Pill (ES | EN | FR) */}
            <div className="flex items-center p-0.5 rounded-md bg-white border border-[#BDE8F7] text-xs font-mono shadow-xs">
              <Globe className="w-3.5 h-3.5 text-[#00D9F5] ml-1.5 mr-1" />
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => onLanguageChange(lang.code)}
                  className={`px-2 py-1 rounded transition-colors text-[11px] font-bold cursor-pointer ${
                    currentLang === lang.code
                      ? 'bg-[#00D9F5] text-[#0B1F2D] shadow-xs'
                      : 'text-[#0B1F2D]/70 hover:text-[#00D9F5] hover:bg-[#EBF7FD]'
                  }`}
                  title={`Cambiar idioma a ${lang.label}`}
                >
                  {lang.label}
                </button>
              ))}
            </div>

            {/* CRM Admin Access */}
            <button
              onClick={() => {
                trackSectionNavigation('/admin', 'header_admin_btn');
                onOpenAdmin();
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono rounded-md border transition-all cursor-pointer whitespace-nowrap ${
                isAdminAuthenticated
                  ? 'border-[#00E3B2] bg-[#00E3B2]/15 text-[#068063] hover:bg-[#00E3B2]/25 shadow-xs'
                  : 'border-[#00D9F5]/40 bg-white text-[#0B1F2D] hover:text-[#00D9F5] hover:border-[#00D9F5] shadow-xs'
              }`}
              title="Acceso al Control Center CRM"
            >
              {isAdminAuthenticated ? (
                <>
                  <ShieldCheck className="w-3.5 h-3.5 text-[#00E3B2]" />
                  <span className="font-bold">Control Center</span>
                </>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5 text-[#00D9F5]" />
                  <span>{t.crmAdmin}</span>
                </>
              )}
            </button>

            {/* Primary Action Button */}
            <button
              onClick={() => handleNavClick('contacto', '/contacto')}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold tracking-wide text-[#0B1F2D] bg-[#00D9F5] hover:bg-[#00E3B2] hover:shadow-[0_0_15px_rgba(0,217,245,0.4)] transition-all rounded-md cursor-pointer whitespace-nowrap shadow-sm shadow-[#00D9F5]/20 hover:-translate-y-0.5"
            >
              <span>{t.startProject}</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Mobile hamburger button + mobile lang indicator */}
          <div className="flex lg:hidden items-center gap-2">
            <div className="flex items-center p-0.5 rounded bg-white border border-[#BDE8F7] text-[10px] font-mono">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => onLanguageChange(lang.code)}
                  className={`px-1.5 py-0.5 rounded ${
                    currentLang === lang.code
                      ? 'bg-[#00D9F5] text-[#0B1F2D] font-bold'
                      : 'text-[#0B1F2D]/70'
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>

            <button
              onClick={() => {
                trackSectionNavigation('/admin', 'mobile_admin_btn');
                onOpenAdmin();
              }}
              className="p-1.5 text-[#00D9F5] hover:bg-[#00D9F5]/10 rounded"
              aria-label="Acceso CRM"
            >
              <Lock className="w-4 h-4" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 text-[#0B1F2D] hover:text-[#00D9F5] rounded"
              aria-label="Abrir menú"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white/98 border-b border-[#00D9F5]/30 px-5 py-4 shadow-xl animate-in slide-in-from-top-2">
          <nav className="flex flex-col gap-3 text-sm">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleNavClick(link.id, link.slug);
                }}
                className="text-left text-[#0B1F2D] hover:text-[#00D9F5] py-1 border-b border-slate-100 flex items-center justify-between font-mono"
              >
                <span>{link.label}</span>
                <span className="text-[10px] text-[#00D9F5]">{link.slug}</span>
              </button>
            ))}
            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleNavClick('contacto', '/contacto');
                }}
                className="w-full text-center py-2.5 bg-[#00D9F5] text-[#0B1F2D] font-bold rounded-md text-xs shadow-sm"
              >
                {t.startProject}
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  trackSectionNavigation('/admin', 'mobile_drawer_crm');
                  onOpenAdmin();
                }}
                className="w-full flex items-center justify-center gap-2 py-2 border border-[#00D9F5] text-[#0B1F2D] text-xs font-mono rounded-md bg-[#F0F9FD]"
              >
                <Lock className="w-3.5 h-3.5 text-[#00D9F5]" />
                <span>Control Center (CRM)</span>
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
