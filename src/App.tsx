import React, { useState, useEffect } from 'react';
import { User, ProjectType } from './types/index.ts';
import { api } from './lib/api.ts';
import { Language } from './lib/i18n.ts';
import { trackSectionNavigation } from './lib/analytics.ts';

// Landing Page Components
import { Header } from './components/landing/Header.tsx';
import { Hero } from './components/landing/Hero.tsx';
import { AboutLab } from './components/landing/AboutLab.tsx';
import { ServicesSection } from './components/landing/ServicesSection.tsx';
import { MethodologySection } from './components/landing/MethodologySection.tsx';
import { ProjectsSection } from './components/landing/ProjectsSection.tsx';
import { LeadCaptureSection } from './components/landing/LeadCaptureSection.tsx';
import { Footer } from './components/landing/Footer.tsx';
import { MobileBottomBar } from './components/landing/MobileBottomBar.tsx';

// CRM Components
import { CrmLayout } from './components/crm/CrmLayout.tsx';
import { AuthModal } from './components/crm/AuthModal.tsx';

const LANG_STORAGE_KEY = 'cokitos_lab_user_lang';

export default function App() {
  const [currentView, setCurrentView] = useState<'landing' | 'crm'>('landing');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [preselectedService, setPreselectedService] = useState<ProjectType | null>(null);

  // Multilanguage state (ES, EN, FR)
  const [currentLang, setCurrentLang] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(LANG_STORAGE_KEY);
      if (saved === 'es' || saved === 'en' || saved === 'fr') return saved;
      const browserLang = navigator.language.slice(0, 2);
      if (browserLang === 'en') return 'en';
      if (browserLang === 'fr') return 'fr';
    }
    return 'es';
  });

  const handleLanguageChange = (lang: Language) => {
    setCurrentLang(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem(LANG_STORAGE_KEY, lang);
    }
  };

  // Check auth session on startup & hash routing
  useEffect(() => {
    const storedUser = api.getStoredUser();
    if (storedUser && api.getToken()) {
      setCurrentUser(storedUser);
      api.checkMe()
        .then((res) => {
          setCurrentUser(res.user);
        })
        .catch(() => {
          api.setToken(null);
          setCurrentUser(null);
        });
    }

    // Process section routing from URL hash, e.g. #/servicios, #/admin
    const parseHashRoute = () => {
      const hash = window.location.hash;
      if (hash === '#/admin' || hash === '#admin') {
        const token = api.getToken();
        if (token && storedUser) {
          setCurrentView('crm');
        } else {
          setIsAuthModalOpen(true);
        }
      } else if (hash.startsWith('#/')) {
        const sectionSlug = hash.replace('#/', '');
        const sectionMap: Record<string, string> = {
          'inicio': 'inicio',
          'home': 'inicio',
          'why-purpose': 'laboratorio',
          'el-laboratorio': 'laboratorio',
          'about': 'laboratorio',
          'what-services': 'servicios',
          'servicios': 'servicios',
          'services': 'servicios',
          'how-method': 'metodologia',
          'metodologia': 'metodologia',
          'methodology': 'metodologia',
          'proyectos': 'proyectos',
          'projects': 'proyectos',
          'contacto': 'contacto',
          'contact': 'contacto',
        };
        const targetId = sectionMap[sectionSlug];
        if (targetId) {
          setTimeout(() => {
            const el = document.getElementById(targetId);
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }, 150);
        }
      }
    };

    parseHashRoute();
    window.addEventListener('hashchange', parseHashRoute);
    return () => window.removeEventListener('hashchange', parseHashRoute);
  }, []);

  const handleOpenAdmin = () => {
    if (currentUser) {
      setCurrentView('crm');
      window.location.hash = '#/admin';
    } else {
      setIsAuthModalOpen(true);
    }
  };

  const handleAuthSuccess = (user: User) => {
    setCurrentUser(user);
    setCurrentView('crm');
    window.location.hash = '#/admin';
    trackSectionNavigation('/admin', 'login_success');
  };

  const handleLogout = async () => {
    await api.logout();
    setCurrentUser(null);
    setCurrentView('landing');
    window.location.hash = '#/inicio';
    trackSectionNavigation('/inicio', 'logout');
  };

  const handleBackToLanding = () => {
    setCurrentView('landing');
    window.location.hash = '#/inicio';
    trackSectionNavigation('/inicio', 'crm_back_to_landing');
  };

  const scrollToSection = (sectionId: string, slug: string) => {
    trackSectionNavigation(slug, 'scroll_to_section');
    if (currentView !== 'landing') {
      setCurrentView('landing');
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
      return;
    }

    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectServiceFromCard = (serviceType: ProjectType) => {
    setPreselectedService(serviceType);
    scrollToSection('contacto', '/contacto');
  };

  if (currentView === 'crm' && currentUser) {
    return (
      <CrmLayout
        currentUser={currentUser}
        onLogout={handleLogout}
        onBackToLanding={handleBackToLanding}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#F5FBFF] text-[#0B1F2D] selection:bg-[#00D9F5]/30 selection:text-[#0B1F2D]">
      
      {/* Sticky Header with Language Switcher and Section Links */}
      <Header
        onOpenAdmin={handleOpenAdmin}
        onNavigateToSection={scrollToSection}
        isAdminAuthenticated={!!currentUser}
        currentLang={currentLang}
        onLanguageChange={handleLanguageChange}
      />

      {/* Main Landing Page Content */}
      <main className="pb-16 lg:pb-0">
        <Hero
          onNavigateToSection={scrollToSection}
          currentLang={currentLang}
        />
        <AboutLab
          currentLang={currentLang}
        />
        <ServicesSection
          onSelectService={handleSelectServiceFromCard}
          currentLang={currentLang}
        />
        <MethodologySection
          currentLang={currentLang}
        />
        <ProjectsSection
          currentLang={currentLang}
        />
        <LeadCaptureSection
          preselectedServiceType={preselectedService}
          currentLang={currentLang}
        />
      </main>

      {/* Footer with Multilanguage Switcher and URL analytics */}
      <Footer
        onOpenAdmin={handleOpenAdmin}
        onNavigateToSection={scrollToSection}
        currentLang={currentLang}
        onLanguageChange={handleLanguageChange}
      />

      {/* Floating Mobile Bottom Navigation Dock */}
      <MobileBottomBar
        onNavigateToSection={scrollToSection}
        onOpenAdmin={handleOpenAdmin}
        isAdminAuthenticated={!!currentUser}
        currentLang={currentLang}
      />

      {/* Admin Login Dialog */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
      />

    </div>
  );
}
