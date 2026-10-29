import React, { useState, useEffect } from 'react';
import { LabLogo } from '../common/LabLogo.tsx';
import { ArrowUpRight, Lock, Menu, X, ShieldCheck } from 'lucide-react';

interface HeaderProps {
  onOpenAdmin: () => void;
  onNavigateToSection: (sectionId: string) => void;
  isAdminAuthenticated: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenAdmin,
  onNavigateToSection,
  isAdminAuthenticated,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'El Laboratorio', id: 'laboratorio' },
    { label: 'Servicios', id: 'servicios' },
    { label: 'Metodología', id: 'metodologia' },
    { label: 'Proyectos', id: 'proyectos' },
    { label: 'Contacto', id: 'contacto' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#0B1F2D]/90 backdrop-blur-md border-b border-[#00D9F5]/20 py-3 shadow-lg shadow-[#0B1F2D]/50'
          : 'bg-transparent py-5 border-b border-[#00D9F5]/10'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8">
          {/* Zone 1: Brand Wordmark */}
          <button
            onClick={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center text-left focus:outline-none group cursor-pointer"
            aria-label="Cokito's Lab Inicio"
          >
            <LabLogo variant="horizontal" size="sm" showDescriptor={false} />
          </button>

          {/* Zone 2: Navigation Links (Single-Line, no pills) */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-[#F5FBFF]/75">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => onNavigateToSection(link.id)}
                className="hover:text-[#00D9F5] transition-colors whitespace-nowrap cursor-pointer hover:underline underline-offset-8 decoration-[#00D9F5]/50"
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Zone 3: Primary Action & Admin CRM Access */}
          <div className="hidden sm:flex items-center gap-3 shrink-0">
            <button
              onClick={onOpenAdmin}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs font-mono rounded-md border transition-all cursor-pointer whitespace-nowrap ${
                isAdminAuthenticated
                  ? 'border-[#00E3B2]/40 bg-[#00E3B2]/10 text-[#00E3B2] hover:bg-[#00E3B2]/20'
                  : 'border-[#00D9F5]/25 bg-[#0e2637]/80 text-[#F5FBFF]/80 hover:text-[#00D9F5] hover:border-[#00D9F5]/50'
              }`}
              title="Acceso al CRM interno del laboratorio"
            >
              {isAdminAuthenticated ? (
                <>
                  <ShieldCheck className="w-3.5 h-3.5 text-[#00E3B2]" />
                  <span>Control Center</span>
                </>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5 text-[#00D9F5]" />
                  <span>CRM Admin</span>
                </>
              )}
            </button>

            <button
              onClick={() => onNavigateToSection('contacto')}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold tracking-wide text-[#0B1F2D] bg-[#00D9F5] hover:bg-[#00E3B2] transition-colors rounded-md cursor-pointer whitespace-nowrap shadow-sm shadow-[#00D9F5]/20"
            >
              <span>Iniciar un proyecto</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Mobile hamburger button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={onOpenAdmin}
              className="p-2 text-[#00D9F5] hover:bg-[#00D9F5]/10 rounded-md"
              aria-label="Acceso CRM"
            >
              <Lock className="w-4 h-4" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#F5FBFF] hover:text-[#00D9F5] rounded-md"
              aria-label="Abrir menú"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0B1F2D]/98 border-b border-[#00D9F5]/20 px-6 py-5 shadow-2xl animate-in slide-in-from-top-2">
          <nav className="flex flex-col gap-4 text-base">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => {
                  setMobileMenuOpen(false);
                  onNavigateToSection(link.id);
                }}
                className="text-left text-[#F5FBFF]/80 hover:text-[#00D9F5] py-1 border-b border-[#143247]"
              >
                {link.label}
              </button>
            ))}
            <div className="pt-3 flex flex-col gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onNavigateToSection('contacto');
                }}
                className="w-full text-center py-2.5 bg-[#00D9F5] text-[#0B1F2D] font-bold rounded-md text-sm"
              >
                Iniciar un proyecto
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAdmin();
                }}
                className="w-full flex items-center justify-center gap-2 py-2 border border-[#00D9F5]/30 text-[#00D9F5] text-xs font-mono rounded-md"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Acceder a Cokito's Control Center (CRM)</span>
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
