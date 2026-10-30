import React from 'react';
import { Home, Target, Cpu, GitBranch, FolderKanban, Send, Lock, ShieldCheck } from 'lucide-react';
import { Language, translations } from '../../lib/i18n.ts';
import { trackSectionNavigation } from '../../lib/analytics.ts';

interface MobileBottomBarProps {
  onNavigateToSection: (sectionId: string, slug: string) => void;
  onOpenAdmin: () => void;
  isAdminAuthenticated: boolean;
  currentLang: Language;
}

export const MobileBottomBar: React.FC<MobileBottomBarProps> = ({
  onNavigateToSection,
  onOpenAdmin,
  isAdminAuthenticated,
  currentLang,
}) => {
  const t = translations[currentLang].nav;

  const handleNav = (sectionId: string, slug: string, eventName: string) => {
    trackSectionNavigation(slug, eventName);
    if (sectionId === 'inicio') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      onNavigateToSection(sectionId, slug);
    }
  };

  const navItems = [
    {
      id: 'inicio',
      slug: '/inicio',
      label: t.home,
      icon: Home,
      eventName: 'mobile_dock_home',
      isHighlight: false,
    },
    {
      id: 'laboratorio',
      slug: '/why-purpose',
      label: 'Why',
      icon: Target,
      eventName: 'mobile_dock_why',
      isHighlight: false,
    },
    {
      id: 'servicios',
      slug: '/what-services',
      label: 'What',
      icon: Cpu,
      eventName: 'mobile_dock_what',
      isHighlight: false,
    },
    {
      id: 'metodologia',
      slug: '/how-method',
      label: 'How',
      icon: GitBranch,
      eventName: 'mobile_dock_how',
      isHighlight: false,
    },
    {
      id: 'proyectos',
      slug: '/projects',
      label: currentLang === 'en' ? 'Projects' : currentLang === 'fr' ? 'Projets' : 'Proyectos',
      icon: FolderKanban,
      eventName: 'mobile_dock_projects',
      isHighlight: false,
    },
  ];

  return (
    <nav
      aria-label="Navegación Móvil Inferior"
      className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#0B1F2D]/95 backdrop-blur-md border-t border-[#00D9F5]/35 shadow-[0_-8px_30px_rgba(11,31,45,0.4)] px-2 py-1.5 safe-bottom"
    >
      <div className="max-w-md mx-auto flex items-center justify-between gap-1">
        
        {/* Navigation Section Buttons: Home, Why, What, How, Projects */}
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => handleNav(item.id, item.slug, item.eventName)}
              className="flex-1 flex flex-col items-center justify-center py-1 px-0.5 rounded-lg text-[#D0E6F5] hover:text-[#00D9F5] active:bg-[#133045] transition-all cursor-pointer group"
            >
              <div className="p-1 rounded-md group-hover:bg-[#00D9F5]/15 transition-colors">
                <Icon className="w-4 h-4 text-[#7E9EB5] group-hover:text-[#00D9F5] transition-colors" />
              </div>
              <span className="text-[9px] font-mono font-bold tracking-tight mt-0.5 truncate max-w-[48px]">
                {item.label}
              </span>
            </button>
          );
        })}

        {/* Contact / Iniciar Proyecto (Prominent CTA Button) */}
        <button
          onClick={() => handleNav('contacto', '/contacto', 'mobile_dock_contact_cta')}
          className="flex flex-col items-center justify-center py-1 px-2 rounded-xl bg-gradient-to-r from-[#00D9F5] to-[#00E3B2] text-[#0B1F2D] shadow-md shadow-[#00D9F5]/30 active:scale-95 transition-all cursor-pointer shrink-0"
          title={t.startProject}
        >
          <Send className="w-4 h-4 text-[#0B1F2D]" />
          <span className="text-[9px] font-mono font-extrabold tracking-tight mt-0.5 whitespace-nowrap">
            {currentLang === 'en' ? 'Start' : currentLang === 'fr' ? 'Projet' : 'Iniciar'}
          </span>
        </button>

        {/* CRM Admin Access Button */}
        <button
          onClick={() => {
            trackSectionNavigation('/admin', 'mobile_dock_crm');
            onOpenAdmin();
          }}
          className={`flex-1 flex flex-col items-center justify-center py-1 px-0.5 rounded-lg transition-all cursor-pointer group ${
            isAdminAuthenticated
              ? 'text-[#00E3B2] hover:text-[#00E3B2]'
              : 'text-[#D0E6F5] hover:text-[#00D9F5]'
          }`}
          title={isAdminAuthenticated ? 'Control Center' : 'CRM Admin'}
        >
          <div className="p-1 rounded-md group-hover:bg-[#00D9F5]/15 transition-colors">
            {isAdminAuthenticated ? (
              <ShieldCheck className="w-4 h-4 text-[#00E3B2]" />
            ) : (
              <Lock className="w-4 h-4 text-[#7E9EB5] group-hover:text-[#00D9F5] transition-colors" />
            )}
          </div>
          <span className="text-[9px] font-mono font-bold tracking-tight mt-0.5 truncate">
            CRM
          </span>
        </button>

      </div>
    </nav>
  );
};
