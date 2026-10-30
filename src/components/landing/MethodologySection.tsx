import React, { useState } from 'react';
import { Search, FileCode2, TerminalSquare, LineChart, ShieldCheck } from 'lucide-react';
import { Language, translations } from '../../lib/i18n.ts';
import { trackSectionNavigation } from '../../lib/analytics.ts';

interface MethodologySectionProps {
  currentLang: Language;
}

export const MethodologySection: React.FC<MethodologySectionProps> = ({ currentLang }) => {
  const [activeStep, setActiveStep] = useState(0);
  const t = translations[currentLang].methodology;

  const steps = [
    {
      num: '01',
      code: t.stages.s1Code,
      title: t.stages.s1Title,
      tagline: t.stages.s1Tagline,
      description: t.stages.s1Desc,
      deliverable: t.stages.s1Deliverable,
      criteria: currentLang === 'en' 
        ? ['Legacy workflow review', 'Friction bottleneck analysis', 'Technical feasibility']
        : currentLang === 'fr'
        ? ['Audit des flux existants', 'Détection des blocages', 'Faisabilité technique']
        : ['Revisión de flujos actuales', 'Detección de puntos de fricción', 'Factibilidad técnica'],
      icon: Search,
    },
    {
      num: '02',
      code: t.stages.s2Code,
      title: t.stages.s2Title,
      tagline: t.stages.s2Tagline,
      description: t.stages.s2Desc,
      deliverable: t.stages.s2Deliverable,
      criteria: currentLang === 'en'
        ? ['Relational database schema', 'API endpoint contracts', 'UI ergonomics design']
        : currentLang === 'fr'
        ? ['Schéma relationnel des données', 'Contrats d\'APIs et endpoints', 'Ergonomie de l\'interface']
        : ['Esquema relacional de datos', 'Definición de APIs y endpoints', 'Diseño de interfaz ergonómica'],
      icon: FileCode2,
    },
    {
      num: '03',
      code: t.stages.s3Code,
      title: t.stages.s3Title,
      tagline: t.stages.s3Tagline,
      description: t.stages.s3Desc,
      deliverable: t.stages.s3Deliverable,
      criteria: currentLang === 'en'
        ? ['Git version control', 'Role security & authentication', 'Functional load tests']
        : currentLang === 'fr'
        ? ['Contrôle de versions Git', 'Sécurité des rôles & auth', 'Tests de charge fonctionnels']
        : ['Control de versiones git', 'Validación de seguridad y roles', 'Pruebas de carga y estrés'],
      icon: TerminalSquare,
    },
    {
      num: '04',
      code: t.stages.s4Code,
      title: t.stages.s4Title,
      tagline: t.stages.s4Tagline,
      description: t.stages.s4Desc,
      deliverable: t.stages.s4Deliverable,
      criteria: currentLang === 'en'
        ? ['Latency monitoring', 'Real user telemetry', 'Resource & cost tuning']
        : currentLang === 'fr'
        ? ['Suivi des temps de réponse', 'Télémétrie en temps réel', 'Optimisation des ressources']
        : ['Monitoreo de tiempos de respuesta', 'Feedback operativo real', 'Optimización de recursos'],
      icon: LineChart,
    },
  ];

  const handleStepClick = (idx: number, code: string) => {
    setActiveStep(idx);
    trackSectionNavigation(`/how-method#${code.toLowerCase()}`, 'methodology_step_click');
  };

  return (
    <section id="metodologia" className="py-12 bg-[#F5FBFF] border-t border-[#E0F2FE] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Compact Header */}
        <div className="max-w-3xl mb-8">
          <div className="inline-flex items-center gap-2 text-xs font-mono text-[#009bb3] uppercase tracking-wider mb-2 font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00b38c]" />
            <span>{t.tag}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B1F2D] tracking-tight mb-2">
            {t.title}
          </h2>
          <p className="text-sm text-[#1E3A52] leading-relaxed">
            {t.subtitle}
          </p>
        </div>

        {/* Process Timeline Line (Compact) */}
        <div className="relative mb-6">
          <div className="hidden lg:block absolute top-6 left-12 right-12 h-0.5 bg-gradient-to-r from-[#00D9F5]/30 via-[#00E3B2]/50 to-[#00D9F5]/30 -z-0" />

          {/* Stepper buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 relative z-10">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              const isActive = activeStep === idx;

              return (
                <button
                  key={step.num}
                  onClick={() => handleStepClick(idx, step.code)}
                  className={`p-4 rounded-xl text-left transition-all duration-200 cursor-pointer border ${
                    isActive
                      ? 'bg-white border-[#00D9F5] shadow-md shadow-[#00D9F5]/20 -translate-y-0.5 ring-2 ring-[#00D9F5]/20'
                      : 'bg-white/80 border-[#D0EBF7] hover:border-[#00D9F5]/70 hover:bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className={`font-mono text-xs font-bold px-2 py-0.5 rounded ${
                        isActive
                          ? 'bg-[#00D9F5] text-[#0B1F2D]'
                          : 'bg-[#EAF6FD] text-[#009bb3] border border-[#BCE4F7]'
                      }`}
                    >
                      {step.num}
                    </span>
                    <Icon
                      className={`w-4 h-4 ${
                        isActive ? 'text-[#00897B]' : 'text-[#64748B]'
                      }`}
                    />
                  </div>

                  <span className="font-mono text-[10px] text-[#009bb3] uppercase tracking-wider block mb-0.5 font-bold">
                    {step.code}
                  </span>
                  <h3 className="text-base font-bold text-[#0B1F2D] mb-1">
                    {step.title}
                  </h3>
                  <p className="text-xs text-[#1E3A52] line-clamp-2 leading-relaxed">
                    {step.tagline}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Detailed Inspector Box for Active Stage */}
        <div className="p-5 sm:p-7 rounded-xl lab-card-clean bg-white border border-[#BCE4F7] relative overflow-hidden shadow-md">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-8">
              
              <div className="flex items-center gap-3 mb-2">
                <span className="font-mono text-xs font-bold text-[#00897B] bg-[#00D9F5]/15 px-2.5 py-0.5 rounded border border-[#00D9F5]/40">
                  {steps[activeStep].num} · {steps[activeStep].code}
                </span>
                <span className="text-xs font-mono text-[#00897B] font-semibold">
                  Lab Pipeline Phase
                </span>
              </div>

              <h4 className="text-xl sm:text-2xl font-extrabold text-[#0B1F2D] mb-2">
                {steps[activeStep].title}: {steps[activeStep].tagline}
              </h4>

              <p className="text-xs sm:text-sm text-[#1E3A52] leading-relaxed mb-4">
                {steps[activeStep].description}
              </p>

              {/* Lab Criteria Checklist */}
              <div>
                <span className="text-[11px] font-mono text-[#64748B] uppercase tracking-wider block mb-2 font-bold">
                  {t.validationCriteria}
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {steps[activeStep].criteria.map((c) => (
                    <div
                      key={c}
                      className="p-2 rounded bg-[#F0F9FF] border border-[#CDE9F7] text-xs text-[#1E3A52] font-mono flex items-center gap-2"
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-[#00897B] shrink-0" />
                      <span>{c}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Deliverable badge */}
            <div className="lg:col-span-4 p-4 rounded-xl bg-[#EAF6FD] border border-[#00D9F5]/50 flex flex-col justify-center shadow-xs">
              <span className="font-mono text-[10px] text-[#00897B] uppercase tracking-wider mb-1 font-bold">
                {t.labDeliverable}
              </span>
              <p className="text-sm font-bold text-[#0B1F2D] leading-snug mb-2">
                {steps[activeStep].deliverable}
              </p>
              <div className="text-[10px] font-mono text-[#64748B] pt-2 border-t border-[#BCE4F7]">
                {t.qualityBadge}
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
