import React, { useState, useEffect } from 'react';
import { User, ProjectType, Lead } from './types/index.ts';
import { api } from './lib/api.ts';

// Landing Page Components
import { Header } from './components/landing/Header.tsx';
import { Hero } from './components/landing/Hero.tsx';
import { AboutLab } from './components/landing/AboutLab.tsx';
import { ServicesSection } from './components/landing/ServicesSection.tsx';
import { MethodologySection } from './components/landing/MethodologySection.tsx';
import { ProjectsSection } from './components/landing/ProjectsSection.tsx';
import { LeadCaptureSection } from './components/landing/LeadCaptureSection.tsx';
import { Footer } from './components/landing/Footer.tsx';

// CRM Components
import { CrmLayout } from './components/crm/CrmLayout.tsx';
import { AuthModal } from './components/crm/AuthModal.tsx';

export default function App() {
  const [currentView, setCurrentView] = useState<'landing' | 'crm'>('landing');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [preselectedService, setPreselectedService] = useState<ProjectType | null>(null);

  // Check auth session on startup
  useEffect(() => {
    const storedUser = api.getStoredUser();
    if (storedUser && api.getToken()) {
      setCurrentUser(storedUser);
      // Validate with server
      api.checkMe()
        .then((res) => {
          setCurrentUser(res.user);
        })
        .catch(() => {
          // Token expired or server restarted session
          api.setToken(null);
          setCurrentUser(null);
        });
    }

    // Check URL hash for direct admin routing (e.g. #admin)
    const checkHash = () => {
      if (window.location.hash === '#admin') {
        const token = api.getToken();
        if (token && storedUser) {
          setCurrentView('crm');
        } else {
          setIsAuthModalOpen(true);
        }
      }
    };

    checkHash();
    window.addEventListener('hashchange', checkHash);
    return () => window.removeEventListener('hashchange', checkHash);
  }, []);

  const handleOpenAdmin = () => {
    if (currentUser) {
      setCurrentView('crm');
      window.location.hash = 'admin';
    } else {
      setIsAuthModalOpen(true);
    }
  };

  const handleAuthSuccess = (user: User) => {
    setCurrentUser(user);
    setCurrentView('crm');
    window.location.hash = 'admin';
  };

  const handleLogout = async () => {
    await api.logout();
    setCurrentUser(null);
    setCurrentView('landing');
    window.location.hash = '';
  };

  const handleBackToLanding = () => {
    setCurrentView('landing');
    window.location.hash = '';
  };

  const scrollToSection = (sectionId: string) => {
    if (currentView !== 'landing') {
      setCurrentView('landing');
      window.location.hash = '';
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
    scrollToSection('contacto');
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
    <div className="min-h-screen bg-[#0B1F2D] text-[#F5FBFF] selection:bg-[#00D9F5]/20 selection:text-[#00D9F5]">
      
      {/* Sticky Header */}
      <Header
        onOpenAdmin={handleOpenAdmin}
        onNavigateToSection={scrollToSection}
        isAdminAuthenticated={!!currentUser}
      />

      {/* Main Landing Page Content */}
      <main>
        <Hero onNavigateToSection={scrollToSection} />
        <AboutLab />
        <ServicesSection onSelectService={handleSelectServiceFromCard} />
        <MethodologySection />
        <ProjectsSection />
        <LeadCaptureSection preselectedServiceType={preselectedService} />
      </main>

      {/* Footer */}
      <Footer
        onOpenAdmin={handleOpenAdmin}
        onNavigateToSection={scrollToSection}
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
