import React, { useState } from 'react';
import { LabLogo } from '../common/LabLogo.tsx';
import { LegalModal } from './LegalModal.tsx';
import { Lock, Mail, Phone, MapPin, ArrowUp } from 'lucide-react';

interface FooterProps {
  onOpenAdmin: () => void;
  onNavigateToSection: (sectionId: string) => void;
  contactEmail?: string;
  contactPhone?: string;
  location?: string;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenAdmin,
  onNavigateToSection,
  contactEmail = 'contacto@cokitoslab.com',
  contactPhone = '+58 412 000 0000',
  location = 'Laboratorio Virtual & Operaciones Remotas',
}) => {
  const [legalModalType, setLegalModalType] = useState<'privacy' | 'terms' | null>(null);

  const currentYear = new Date().getFullYear();

  return (
    <>
      <footer className="bg-[#081722] border-t border-[#143247] pt-8 pb-6 text-[#F5FBFF]/75">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 pb-6 border-b border-[#143247]">
            
            {/* Brand Block */}
            <div className="lg:col-span-5 flex flex-col items-start">
              <LabLogo variant="horizontal" size="sm" showDescriptor={true} className="mb-2" />
              <p className="text-xs text-[#F5FBFF]/70 leading-relaxed max-w-sm mb-3">
                Laboratorio de innovación y tecnología aplicada. Analizamos problemas reales y construimos sistemas digitales a medida, eficientes y preparados para escalar.
              </p>
              <div className="text-[11px] font-mono text-[#00E3B2] border border-[#00E3B2]/30 bg-[#00E3B2]/5 px-2.5 py-1 rounded">
                Menos caos. Automatiza. Escala.
              </div>
            </div>

            {/* Quick Navigation */}
            <div className="lg:col-span-3">
              <span className="font-mono text-xs uppercase tracking-wider text-[#00D9F5] block mb-2 font-bold">
                Navegación
              </span>
              <ul className="space-y-1.5 text-xs font-medium">
                {[
                  { label: 'El Laboratorio', id: 'laboratorio' },
                  { label: 'Servicios de Ingeniería', id: 'servicios' },
                  { label: 'The Lab Method (Metodología)', id: 'metodologia' },
                  { label: 'Proyectos y Sistemas', id: 'proyectos' },
                  { label: 'Contacto y Diagnóstico', id: 'contacto' },
                ].map((item) => (
                  <li key={item.id}>
                    <button
                      onClick={() => onNavigateToSection(item.id)}
                      className="hover:text-[#00D9F5] transition-colors cursor-pointer text-left"
                    >
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Configurable Contact Information */}
            <div className="lg:col-span-4">
              <span className="font-mono text-xs uppercase tracking-wider text-[#00D9F5] block mb-2 font-bold">
                Información del Laboratorio
              </span>
              <ul className="space-y-2 text-xs">
                <li className="flex items-center gap-2.5 text-[#F5FBFF]/80">
                  <Mail className="w-3.5 h-3.5 text-[#00D9F5] shrink-0" />
                  <a href={`mailto:${contactEmail}`} className="hover:text-[#00D9F5] transition-colors font-mono">
                    {contactEmail}
                  </a>
                </li>
                <li className="flex items-center gap-2.5 text-[#F5FBFF]/80 font-mono">
                  <Phone className="w-3.5 h-3.5 text-[#00E3B2] shrink-0" />
                  <span>{contactPhone}</span>
                </li>
                <li className="flex items-center gap-2.5 text-[#F5FBFF]/80 font-mono">
                  <MapPin className="w-3.5 h-3.5 text-[#00D9F5] shrink-0" />
                  <span>{location}</span>
                </li>
              </ul>

              <div className="mt-3 pt-2 border-t border-[#143247]/60">
                <button
                  onClick={onOpenAdmin}
                  className="inline-flex items-center gap-1.5 text-xs font-mono text-[#00D9F5] hover:text-[#00E3B2] transition-colors cursor-pointer"
                >
                  <Lock className="w-3 h-3" />
                  <span>Acceso a Cokito's Lab Control Center (CRM)</span>
                </button>
              </div>
            </div>

          </div>

          {/* Sub-footer: Legal & Dynamic Copyright */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] font-mono text-[#F5FBFF]/50">
            <div>
              © {currentYear} COKITO’S LAB. Todos los derechos reservados.
            </div>

            <div className="flex items-center gap-5">
              <button
                onClick={() => setLegalModalType('privacy')}
                className="hover:text-[#00D9F5] transition-colors cursor-pointer"
              >
                Política de Privacidad
              </button>
              <button
                onClick={() => setLegalModalType('terms')}
                className="hover:text-[#00D9F5] transition-colors cursor-pointer"
              >
                Términos de Uso
              </button>
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="p-1 rounded bg-[#0B1F2D] hover:bg-[#143247] text-[#00D9F5] transition-colors"
                title="Volver arriba"
                aria-label="Volver arriba"
              >
                <ArrowUp className="w-3 h-3" />
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
