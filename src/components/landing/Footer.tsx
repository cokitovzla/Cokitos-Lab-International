import React, { useState } from 'react';
import { LabLogo } from '../common/LabLogo.tsx';
import { LegalModal } from './LegalModal.tsx';
import { Language, translations } from '../../lib/i18n.ts';
import { trackSectionNavigation } from '../../lib/analytics.ts';
import { 
  Lock, 
  Mail, 
  Phone, 
  MapPin, 
  ArrowUp, 
  Globe, 
  MessageSquare, 
  ExternalLink,
  ShieldCheck,
  Building2,
  Sparkles
} from 'lucide-react';

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
  contactEmail = 'cokito.int@gmail.com',
  contactPhone = '+58 422 461 2534',
  location = 'Francia 🇫🇷 • Venezuela 🇻🇪 • USA 🇺🇸',
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
      <footer className="bg-gradient-to-b from-[#F2F9FD] to-[#E5F3FB] border-t border-[#CCE8F6] pt-12 pb-8 text-[#1E3A52]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          {/* LEVEL 1: Main Brand, Central Coordinates & Quick Navigation */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-10 border-b border-[#CCE8F6]/80">
            
            {/* Left: Brand Identity & Positioning */}
            <div className="lg:col-span-7 flex flex-col items-start space-y-4">
              <LabLogo variant="horizontal" size="md" showDescriptor={true} className="mb-1" />
              
              <p className="text-sm text-[#1E3A52] leading-relaxed max-w-xl font-sans">
                {t.desc}
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-1">
                <div className="text-xs font-mono text-[#00897B] border border-[#00E3B2] bg-white px-3 py-1.5 rounded-lg font-bold shadow-xs flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-[#00D9F5]" />
                  <span>{t.slogan}</span>
                </div>

                <div className="text-xs font-mono text-[#1E3A52] bg-white/80 border border-[#BCE4F7] px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#00897B]" />
                  <span>Laboratorio Tecnológico · Casa Matriz</span>
                </div>
              </div>

              {/* Central Coordinates Box */}
              <div className="w-full max-w-xl p-3.5 rounded-xl bg-white/90 border border-[#BCE4F7] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs mt-2">
                <div className="space-y-1">
                  <span className="font-mono text-[10px] uppercase font-bold text-[#00897B] tracking-wider block">
                    Coordinación Global Central
                  </span>
                  <div className="flex items-center gap-2 text-[#0B1F2D] font-mono font-medium">
                    <Mail className="w-3.5 h-3.5 text-[#009bb3] shrink-0" />
                    <a href={`mailto:${contactEmail}`} className="hover:text-[#009bb3] transition-colors font-bold">
                      {contactEmail}
                    </a>
                  </div>
                </div>

                <a
                  href="https://wa.me/584224612534"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-lg bg-[#00897B] hover:bg-[#007063] text-white font-mono text-xs font-bold transition-all shadow-xs shrink-0 cursor-pointer hover:shadow-md"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-[#00E3B2]" />
                  <span>WhatsApp Global: +58 422 461 2534</span>
                </a>
              </div>

              {/* Language Switcher */}
              <div className="flex items-center gap-2 p-1 rounded-lg bg-white border border-[#BCE4F7] text-xs font-mono shadow-2xs">
                <Globe className="w-3.5 h-3.5 text-[#009bb3] ml-2 mr-0.5" />
                <span className="text-[11px] text-[#64748B] font-medium pr-1">Idioma:</span>
                {languages.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => {
                      trackSectionNavigation(`/lang/${l.code}`, 'footer_lang_switch');
                      onLanguageChange(l.code);
                    }}
                    className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all cursor-pointer ${
                      currentLang === l.code
                        ? 'bg-[#00D9F5] text-[#0B1F2D] shadow-xs scale-102'
                        : 'text-[#1E3A52] hover:text-[#009bb3] hover:bg-[#F0F9FF]'
                    }`}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Right: Quick Navigation & Internal CRM Portal */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
              <div>
                <span className="font-mono text-xs uppercase tracking-wider text-[#0B1F2D] block mb-3 font-bold flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#00D9F5]" />
                  <span>{t.navTitle}</span>
                </span>
                
                <ul className="grid grid-cols-2 gap-2 text-xs font-medium">
                  {[
                    { label: navT.why, id: 'laboratorio', slug: '/why-purpose' },
                    { label: navT.what, id: 'servicios', slug: '/what-services' },
                    { label: navT.how, id: 'metodologia', slug: '/how-method' },
                    { label: navT.projects, id: 'proyectos', slug: '/projects' },
                    { label: navT.contact, id: 'contacto', slug: '/contact' },
                    { label: 'LegalTech Suite', id: 'proyectos', slug: '/projects?category=LegalTech' },
                  ].map((item) => (
                    <li key={item.slug}>
                      <button
                        onClick={() => handleLinkClick(item.id, item.slug)}
                        className="w-full text-left p-2 rounded-md hover:bg-white text-[#1E3A52] hover:text-[#009bb3] transition-all cursor-pointer flex items-center gap-1.5 border border-transparent hover:border-[#BCE4F7]"
                      >
                        <span className="text-[#009bb3] font-bold text-xs">/</span>
                        <span className="font-sans font-medium">{item.label}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Private CRM Center Card */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-white to-[#EAF6FD] border border-[#BCE4F7] shadow-xs flex items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-mono text-[#00897B] uppercase font-bold tracking-wider block">
                    Acceso Restringido
                  </span>
                  <p className="text-xs font-bold text-[#0B1F2D]">
                    Control Center & CRM Operativo
                  </p>
                  <p className="text-[11px] text-[#64748B]">
                    Gestión interna de prospectos y sistemas
                  </p>
                </div>
                <button
                  onClick={() => {
                    trackSectionNavigation('/admin', 'footer_admin_link');
                    onOpenAdmin();
                  }}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#0B1F2D] hover:bg-[#143247] text-[#00D9F5] text-xs font-mono font-bold transition-all shadow-xs cursor-pointer hover:shadow-md shrink-0"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>{t.crmLink}</span>
                </button>
              </div>

            </div>

          </div>

          {/* LEVEL 2: DEDICATED INTERNATIONAL HUBS (Spacious 3-Column Layout with National Colors & Flags) */}
          <div className="space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
              <div>
                <div className="inline-flex items-center gap-2 text-xs font-mono text-[#009bb3] uppercase tracking-wider font-bold mb-1">
                  <Building2 className="w-4 h-4 text-[#00897B]" />
                  <span>Sedes & Hubs Internacionales</span>
                </div>
                <h3 className="text-lg font-extrabold text-[#0B1F2D] tracking-tight">
                  Presencia Directa y Representaciones Oficiales de Cokito’s Lab
                </h3>
              </div>
              <p className="text-xs font-mono text-[#64748B]">
                Atención regionalizada · Sin intermediarios
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* HUB FRANCIA (EUROPA) - French Flag Palette (Bleu, Blanc, Rouge) */}
              <div className="group relative rounded-2xl bg-white border border-[#CDE9F7] hover:border-[#0055A4] transition-all duration-300 p-5 shadow-xs hover:shadow-xl hover:-translate-y-1 flex flex-col justify-between overflow-hidden">
                {/* French Tricolor Bar Accent */}
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#0055A4] via-[#FFFFFF] to-[#EF4135] opacity-90 group-hover:h-2 transition-all" />
                
                {/* Subtle National Color Glow on Hover */}
                <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-[#0055A4]/5 blur-2xl pointer-events-none group-hover:bg-[#0055A4]/15 transition-all" />

                <div className="space-y-3 pt-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl filter drop-shadow-xs" role="img" aria-label="France">🇫🇷</span>
                      <div>
                        <h4 className="text-sm font-extrabold text-[#0B1F2D] group-hover:text-[#0055A4] transition-colors">
                          Hub Francia
                        </h4>
                        <span className="text-[10px] font-mono text-[#64748B] block">
                          Europa · París / Occitania
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded font-bold bg-[#0055A4]/10 text-[#0055A4] border border-[#0055A4]/20">
                      UE Hub
                    </span>
                  </div>

                  <p className="text-xs text-[#1E3A52] leading-relaxed">
                    Operaciones en territorio europeo, desarrollo SaaS comunitario, iniciativas solidarias y despliegue LegalTech multilingüe.
                  </p>

                  <div className="pt-2 border-t border-[#F0F7FB] space-y-1 text-xs font-mono">
                    <div className="flex items-center justify-between">
                      <span className="text-[#64748B] text-[11px]">Director:</span>
                      <span className="font-bold text-[#0B1F2D]">Morice Mojica</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[#64748B] text-[11px]">Teléfono:</span>
                      <a href="tel:+33774853604" className="text-[#0055A4] font-semibold hover:underline">
                        +33 (77) 4853604
                      </a>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[#64748B] text-[11px]">Email:</span>
                      <a href="mailto:cokito.int@gmail.com" className="text-[#1E3A52] hover:text-[#0055A4]">
                        cokito.int@gmail.com
                      </a>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-[#CCE8F6] flex items-center justify-between">
                  <a
                    href="https://wa.me/33774853604"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0055A4]/10 hover:bg-[#0055A4] text-[#0055A4] hover:text-white font-mono text-xs font-bold transition-all cursor-pointer shadow-2xs"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>WhatsApp ↗</span>
                  </a>
                  <span className="text-[10px] font-mono text-[#64748B]">
                    UTC+1 / CET
                  </span>
                </div>
              </div>

              {/* HUB VENEZUELA (AMÉRICA DEL SUR) - Venezuelan Tricolor Palette (Amarillo, Azul, Rojo) */}
              <div className="group relative rounded-2xl bg-white border border-[#CDE9F7] hover:border-[#F59E0B] transition-all duration-300 p-5 shadow-xs hover:shadow-xl hover:-translate-y-1 flex flex-col justify-between overflow-hidden">
                {/* Venezuelan Tricolor Bar Accent */}
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#FCD116] via-[#003893] to-[#CE1126] opacity-90 group-hover:h-2 transition-all" />
                
                {/* Subtle National Color Glow on Hover */}
                <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-[#F59E0B]/5 blur-2xl pointer-events-none group-hover:bg-[#F59E0B]/20 transition-all" />

                <div className="space-y-3 pt-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl filter drop-shadow-xs" role="img" aria-label="Venezuela">🇻🇪</span>
                      <div>
                        <h4 className="text-sm font-extrabold text-[#0B1F2D] group-hover:text-[#D97706] transition-colors">
                          Hub Venezuela
                        </h4>
                        <span className="text-[10px] font-mono text-[#64748B] block">
                          América del Sur · Caracas
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded font-extrabold bg-[#F59E0B]/15 text-[#B45309] border border-[#F59E0B]/30">
                      Sede Principal
                    </span>
                  </div>

                  <p className="text-xs text-[#1E3A52] leading-relaxed">
                    Captación regional de proyectos, coordinación del ecosistema EdTech Güakytopia, desarrollo multicomercio y soporte operativo.
                  </p>

                  <div className="pt-2 border-t border-[#F0F7FB] space-y-1 text-xs font-mono">
                    <div className="flex items-center justify-between">
                      <span className="text-[#64748B] text-[11px]">Directora:</span>
                      <span className="font-bold text-[#0B1F2D]">Ana Teresa Sandoval</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[#64748B] text-[11px]">Teléfono:</span>
                      <a href="tel:+584224612534" className="text-[#D97706] font-semibold hover:underline">
                        +58 (422) 4612534
                      </a>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[#64748B] text-[11px]">Email:</span>
                      <a href="mailto:cokito.vzla@gmail.com" className="text-[#1E3A52] hover:text-[#D97706]">
                        cokito.vzla@gmail.com
                      </a>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-[#CCE8F6] flex items-center justify-between">
                  <a
                    href="https://wa.me/584224612534"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#F59E0B]/15 hover:bg-[#D97706] text-[#B45309] hover:text-white font-mono text-xs font-bold transition-all cursor-pointer shadow-2xs"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>WhatsApp ↗</span>
                  </a>
                  <span className="text-[10px] font-mono text-[#64748B]">
                    UTC-4 / VET
                  </span>
                </div>
              </div>

              {/* HUB USA (AMÉRICA DEL NORTE) - USA Flag Palette (Navy, White, Red) */}
              <div className="group relative rounded-2xl bg-white border border-[#CDE9F7] hover:border-[#0A3161] transition-all duration-300 p-5 shadow-xs hover:shadow-xl hover:-translate-y-1 flex flex-col justify-between overflow-hidden">
                {/* USA Flag Bar Accent */}
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#0A3161] via-[#B31942] to-[#0A3161] opacity-90 group-hover:h-2 transition-all" />
                
                {/* Subtle National Color Glow on Hover */}
                <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-[#0A3161]/5 blur-2xl pointer-events-none group-hover:bg-[#0A3161]/15 transition-all" />

                <div className="space-y-3 pt-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl filter drop-shadow-xs" role="img" aria-label="USA">🇺🇸</span>
                      <div>
                        <h4 className="text-sm font-extrabold text-[#0B1F2D] group-hover:text-[#0A3161] transition-colors">
                          Hub USA
                        </h4>
                        <span className="text-[10px] font-mono text-[#64748B] block">
                          América del Norte · Los Ángeles / Remoto
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded font-bold bg-[#0A3161]/10 text-[#0A3161] border border-[#0A3161]/20">
                      US Hub
                    </span>
                  </div>

                  <p className="text-xs text-[#1E3A52] leading-relaxed">
                    Expansión estratégica internacional, soluciones de alto rendimiento deportivo (SportsTech) y consultoría de automatización avanzada.
                  </p>

                  <div className="pt-2 border-t border-[#F0F7FB] space-y-1 text-xs font-mono">
                    <div className="flex items-center justify-between">
                      <span className="text-[#64748B] text-[11px]">Director:</span>
                      <span className="font-bold text-[#0B1F2D]">Antonio Fuentes</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[#64748B] text-[11px]">Teléfono:</span>
                      <a href="tel:+14243462359" className="text-[#0A3161] font-semibold hover:underline">
                        +1 (424) 3462359
                      </a>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[#64748B] text-[11px]">Email:</span>
                      <a href="mailto:cokito.int@gmail.com" className="text-[#1E3A52] hover:text-[#0A3161]">
                        cokito.int@gmail.com
                      </a>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-[#CCE8F6] flex items-center justify-between">
                  <a
                    href="https://wa.me/14243462359"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0A3161]/10 hover:bg-[#0A3161] text-[#0A3161] hover:text-white font-mono text-xs font-bold transition-all cursor-pointer shadow-2xs"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>WhatsApp ↗</span>
                  </a>
                  <span className="text-[10px] font-mono text-[#64748B]">
                    UTC-8 / PST
                  </span>
                </div>
              </div>

            </div>
          </div>

          {/* LEVEL 3: Sub-footer: Legal, Clean Hover Links & Dynamic Copyright */}
          <div className="pt-6 border-t border-[#CCE8F6] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-[#64748B]">
            <div>
              © {currentYear} <span className="font-bold text-[#0B1F2D]">COKITO’S LAB</span>. {t.rights}
            </div>

            <div className="flex items-center gap-6">
              <button
                onClick={() => {
                  trackSectionNavigation('/legal/privacy', 'privacy_modal');
                  setLegalModalType('privacy');
                }}
                className="hover:text-[#009bb3] px-2 py-1 rounded hover:bg-white transition-all cursor-pointer font-medium"
              >
                {t.privacy}
              </button>
              <button
                onClick={() => {
                  trackSectionNavigation('/legal/terms', 'terms_modal');
                  setLegalModalType('terms');
                }}
                className="hover:text-[#009bb3] px-2 py-1 rounded hover:bg-white transition-all cursor-pointer font-medium"
              >
                {t.terms}
              </button>
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="p-2 rounded-lg bg-white hover:bg-[#00D9F5] text-[#009bb3] hover:text-[#0B1F2D] transition-all border border-[#BCE4F7] cursor-pointer shadow-2xs hover:shadow-sm"
                title="Volver arriba"
                aria-label="Volver arriba"
              >
                <ArrowUp className="w-4 h-4" />
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
