import React from 'react';
import { Globe2, MessageSquare } from 'lucide-react';
import { Language } from '../../lib/i18n.ts';

interface InternationalHubsSectionProps {
  currentLang: Language;
}

export const InternationalHubsSection: React.FC<InternationalHubsSectionProps> = ({ currentLang }) => {
  return (
    <section id="hubs" className="py-12 bg-gradient-to-b from-[#F5FBFF] to-[#EBF5FA] border-t border-[#D0EBF7] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 text-xs font-mono text-[#009bb3] uppercase tracking-wider font-bold mb-2">
            <Globe2 className="w-4 h-4 text-[#00897B]" />
            <span>Presencia Global Directa</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B1F2D] tracking-tight mb-2">
            Hubs Internacionales & Sedes Oficiales
          </h2>
          <p className="text-xs sm:text-sm text-[#475569] leading-relaxed">
            Coordinación operativa y atención regionalizada sin intermediarios entre Suramérica, Europa y Norteamérica.
          </p>
        </div>

        {/* 3 Country Hubs Grid: 1. Venezuela, 2. Francia, 3. Estados Unidos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* 1. HUB VENEZUELA (SURAMÉRICA - SEDE PRINCIPAL) */}
          <div className="group relative rounded-2xl bg-white border border-[#D0EBF7] hover:border-[#F59E0B] transition-all duration-300 p-6 shadow-xs hover:shadow-xl hover:-translate-y-1 flex flex-col justify-between overflow-hidden">
            {/* Venezuelan Tricolor Accent */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#FCD116] via-[#003893] to-[#CE1126]" />

            <div className="space-y-4 pt-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="text-3xl" role="img" aria-label="Venezuela">🇻🇪</span>
                  <div>
                    <h3 className="text-base font-extrabold text-[#0B1F2D] group-hover:text-[#D97706] transition-colors">
                      Hub Venezuela
                    </h3>
                    <span className="text-[11px] font-mono text-[#64748B] block">
                      Suramérica · Caracas
                    </span>
                  </div>
                </div>
                <span className="text-[10px] font-mono px-2.5 py-0.5 rounded font-extrabold bg-[#F59E0B]/15 text-[#B45309] border border-[#F59E0B]/30 uppercase">
                  Sede Principal
                </span>
              </div>

              <p className="text-xs text-[#334155] leading-relaxed">
                Captación regional de proyectos, coordinación del ecosistema EdTech Güakytopia, desarrollo multicomercio y soporte operativo.
              </p>

              <div className="pt-3 border-t border-[#F1F5F9] space-y-1.5 text-xs font-mono">
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
                  <a href="mailto:cokito.vzla@gmail.com" className="text-[#334155] hover:text-[#D97706]">
                    cokito.vzla@gmail.com
                  </a>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-[#E2E8F0] flex items-center justify-between">
              <a
                href="https://wa.me/584224612534"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#F59E0B]/15 hover:bg-[#D97706] text-[#B45309] hover:text-white font-mono text-xs font-bold transition-all shadow-2xs"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>WhatsApp ↗</span>
              </a>
              <span className="text-[10px] font-mono text-[#64748B]">
                UTC-4 / VET
              </span>
            </div>
          </div>

          {/* 2. HUB FRANCIA (EUROPA) */}
          <div className="group relative rounded-2xl bg-white border border-[#D0EBF7] hover:border-[#0055A4] transition-all duration-300 p-6 shadow-xs hover:shadow-xl hover:-translate-y-1 flex flex-col justify-between overflow-hidden">
            {/* French Tricolor Accent */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#0055A4] via-[#FFFFFF] to-[#EF4135]" />
            
            <div className="space-y-4 pt-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="text-3xl" role="img" aria-label="Francia">🇫🇷</span>
                  <div>
                    <h3 className="text-base font-extrabold text-[#0B1F2D] group-hover:text-[#0055A4] transition-colors">
                      Hub Francia
                    </h3>
                    <span className="text-[11px] font-mono text-[#64748B] block">
                      Europa · París / Occitania
                    </span>
                  </div>
                </div>
                <span className="text-[10px] font-mono px-2.5 py-0.5 rounded font-bold bg-[#0055A4]/10 text-[#0055A4] border border-[#0055A4]/20 uppercase">
                  UE Hub
                </span>
              </div>

              <p className="text-xs text-[#334155] leading-relaxed">
                Operaciones en territorio europeo, desarrollo SaaS comunitario, iniciativas solidarias y despliegue LegalTech multilingüe.
              </p>

              <div className="pt-3 border-t border-[#F1F5F9] space-y-1.5 text-xs font-mono">
                <div className="flex items-center justify-between">
                  <span className="text-[#64748B] text-[11px]">Responsable:</span>
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
                  <a href="mailto:cokito.int@gmail.com" className="text-[#334155] hover:text-[#0055A4]">
                    cokito.int@gmail.com
                  </a>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-[#E2E8F0] flex items-center justify-between">
              <a
                href="https://wa.me/33774853604"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0055A4]/10 hover:bg-[#0055A4] text-[#0055A4] hover:text-white font-mono text-xs font-bold transition-all shadow-2xs"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>WhatsApp ↗</span>
              </a>
              <span className="text-[10px] font-mono text-[#64748B]">
                UTC+1 / CET
              </span>
            </div>
          </div>

          {/* 3. HUB USA (NORTEAMÉRICA) */}
          <div className="group relative rounded-2xl bg-white border border-[#D0EBF7] hover:border-[#0A3161] transition-all duration-300 p-6 shadow-xs hover:shadow-xl hover:-translate-y-1 flex flex-col justify-between overflow-hidden">
            {/* USA Flag Accent */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#0A3161] via-[#B31942] to-[#0A3161]" />

            <div className="space-y-4 pt-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="text-3xl" role="img" aria-label="USA">🇺🇸</span>
                  <div>
                    <h3 className="text-base font-extrabold text-[#0B1F2D] group-hover:text-[#0A3161] transition-colors">
                      Hub USA
                    </h3>
                    <span className="text-[11px] font-mono text-[#64748B] block">
                      Norteamérica · Los Ángeles / Remoto
                    </span>
                  </div>
                </div>
                <span className="text-[10px] font-mono px-2.5 py-0.5 rounded font-bold bg-[#0A3161]/10 text-[#0A3161] border border-[#0A3161]/20 uppercase">
                  US Hub
                </span>
              </div>

              <p className="text-xs text-[#334155] leading-relaxed">
                Expansión estratégica internacional, soluciones de alto rendimiento deportivo (SportsTech) y consultoría de automatización avanzada.
              </p>

              <div className="pt-3 border-t border-[#F1F5F9] space-y-1.5 text-xs font-mono">
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
                  <a href="mailto:cokito.int@gmail.com" className="text-[#334155] hover:text-[#0A3161]">
                    cokito.int@gmail.com
                  </a>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-[#E2E8F0] flex items-center justify-between">
              <a
                href="https://wa.me/14243462359"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0A3161]/10 hover:bg-[#0A3161] text-[#0A3161] hover:text-white font-mono text-xs font-bold transition-all shadow-2xs"
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
    </section>
  );
};
