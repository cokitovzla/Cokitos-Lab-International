import React, { useState } from 'react';
import { ArrowRight, Cpu, Network, CheckCircle2, ChevronRight } from 'lucide-react';
import { Language, translations } from '../../lib/i18n.ts';
import { trackSectionNavigation } from '../../lib/analytics.ts';

interface HeroProps {
  onNavigateToSection: (sectionId: string, slug: string) => void;
  currentLang: Language;
}

export const Hero: React.FC<HeroProps> = ({ onNavigateToSection, currentLang }) => {
  const [activeStage, setActiveStage] = useState<0 | 1 | 2>(0);
  const t = translations[currentLang].hero;

  const architectureFlows = [
    {
      step: '01',
      title: t.step1,
      category: currentLang === 'en' ? 'Intake & Diagnostics' : currentLang === 'fr' ? 'Collecte & Diagnostic' : 'Entrada y Diagnóstico',
      desc: currentLang === 'en' 
        ? 'We decode the actual operational bottleneck, data dependencies, and required system architecture.'
        : currentLang === 'fr'
        ? 'Nous décodons le goulot d\'étranglement opérationnel, les dépendances de données et l\'architecture requise.'
        : 'Decodificamos el problema operativo real, los cuellos de botella y la arquitectura de datos requerida.',
      nodes: currentLang === 'en'
        ? ['Requirement Intake', 'Constraint Validation', 'Workflow Mapping']
        : currentLang === 'fr'
        ? ['Collecte du besoin', 'Validation des contraintes', 'Cartographie des flux']
        : ['Recepción de Requerimiento', 'Validación de Restricciones', 'Mapeo de Flujo'],
      output: currentLang === 'en' ? 'Technical Specification & Blueprint' : currentLang === 'fr' ? 'Spécification Technique & Blueprint' : 'Especificación Técnica & Blueprint',
    },
    {
      step: '02',
      title: t.step2,
      category: currentLang === 'en' ? 'Engineering & Automation' : currentLang === 'fr' ? 'Ingénierie & Automatisation' : 'Ingeniería y Automatización',
      desc: currentLang === 'en'
        ? 'We engineer rock-solid systems, reactive portals, custom CRMs, and continuous integration pipelines.'
        : currentLang === 'fr'
        ? 'Nous concevons des systèmes robustes, des portails réactifs, des CRM sur mesure et des flux d\'intégration.'
        : 'Construimos sistemas robustos, portales reactivos, CRMs a medida y pipelines de integración continua.',
      nodes: currentLang === 'en'
        ? ['Database Engine', 'Secure APIs & Connectors', 'Control Dashboard']
        : currentLang === 'fr'
        ? ['Moteur de Base de Données', 'APIs Sécurisées', 'Tableau de Bord']
        : ['Motor de Base de Datos', 'APIs & Conectores Seguros', 'Interfaz de Control'],
      output: currentLang === 'en' ? 'Production Scalable Platform' : currentLang === 'fr' ? 'Plateforme Scalable en Production' : 'Plataforma Escalable en Producción',
    },
    {
      step: '03',
      title: t.step3,
      category: currentLang === 'en' ? 'Impact & Autonomy' : currentLang === 'fr' ? 'Impact & Autonomie' : 'Impacto y Autonomía',
      desc: currentLang === 'en'
        ? 'We eliminate manual chaos, accelerate turnaround times, and prepare your business to scale seamlessly.'
        : currentLang === 'fr'
        ? 'Nous éliminons le chaos manuel, accélérons les délais de traitement et préparons votre croissance sans friction.'
        : 'Eliminamos el caos manual, aceleramos el tiempo de respuesta y preparamos tu operación para escalar sin fricción.',
      nodes: currentLang === 'en'
        ? ['Autonomous Operation', 'Live Telemetry', 'Cost Reduction']
        : currentLang === 'fr'
        ? ['Opération Autonome', 'Télémétrie en Direct', 'Réduction des Coûts']
        : ['Operación Autónoma', 'Telemetría en Vivo', 'Reducción de Costos'],
      output: currentLang === 'en' ? 'Measurable ROI & Full Control' : currentLang === 'fr' ? 'ROI Mesurable & Contrôle Total' : 'Retorno Medible & Control Total',
    },
  ];

  return (
    <section id="inicio" className="relative pt-24 pb-12 lg:pt-28 lg:pb-16 overflow-hidden bg-tech-grid-light">
      {/* Radiant ambient glow on light canvas */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[360px] bg-gradient-to-tr from-[#00D9F5]/25 via-[#00E3B2]/20 to-transparent blur-[100px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Core Value Proposition */}
          <div className="lg:col-span-7 flex flex-col items-start">
            
            {/* Laboratory Subheader / Slogan */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-white border border-[#00D9F5]/50 text-xs font-mono text-[#0B1F2D] mb-4 shadow-xs hover:border-[#00D9F5] transition-colors">
              <span className="w-2 h-2 rounded-full bg-[#00E3B2] animate-pulse" />
              <span className="font-bold tracking-wide">{t.badge}</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#0B1F2D] leading-[1.15] mb-4 text-balance">
              {t.titleStart}{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0096AF] via-[#00A381] to-[#0096AF]">
                {t.titleHighlight}
              </span>{' '}
              {t.titleEnd}
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base text-[#1E3A52] max-w-2xl leading-relaxed mb-6 font-sans">
              {t.subtitle}
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto mb-8">
              <button
                onClick={() => {
                  trackSectionNavigation('/contacto', 'hero_cta_primary');
                  onNavigateToSection('contacto', '/contacto');
                }}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-bold text-[#0B1F2D] bg-[#00D9F5] hover:bg-[#00E3B2] hover:shadow-[0_0_20px_rgba(0,217,245,0.5)] transition-all rounded-md cursor-pointer whitespace-nowrap shadow-sm shadow-[#00D9F5]/30 hover:-translate-y-0.5"
              >
                <span>{t.ctaPrimary}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  trackSectionNavigation('/why-purpose', 'hero_cta_secondary');
                  onNavigateToSection('laboratorio', '/why-purpose');
                }}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold text-[#0B1F2D] hover:text-[#0096AF] bg-white hover:bg-[#F0F8FC] border border-[#BDE8F7] hover:border-[#00D9F5] transition-all rounded-md cursor-pointer whitespace-nowrap shadow-xs hover:-translate-y-0.5"
              >
                <span>{t.ctaSecondary}</span>
                <ChevronRight className="w-4 h-4 text-[#0096AF]" />
              </button>
            </div>

            {/* Laboratory Trust Proof Strip (Clean, white tiles with cyan borders) */}
            <div className="pt-4 border-t border-[#D0EBF7] w-full grid grid-cols-3 gap-3 text-left">
              <div className="p-3 rounded-lg bg-white border border-[#BDE8F7] hover:border-[#00D9F5] transition-colors shadow-xs">
                <span className="block font-mono text-xl sm:text-2xl font-bold text-[#0096AF] tabular-nums">{t.metric1Val}</span>
                <span className="text-[11px] text-[#50728C] font-semibold">{t.metric1Label}</span>
              </div>
              <div className="p-3 rounded-lg bg-white border border-[#BDE8F7] hover:border-[#00A381] transition-colors shadow-xs">
                <span className="block font-mono text-xl sm:text-2xl font-bold text-[#00A381] tabular-nums">{t.metric2Val}</span>
                <span className="text-[11px] text-[#50728C] font-semibold">{t.metric2Label}</span>
              </div>
              <div className="p-3 rounded-lg bg-white border border-[#BDE8F7] hover:border-[#00D9F5] transition-colors shadow-xs">
                <span className="block font-mono text-xl sm:text-2xl font-bold text-[#0B1F2D] tabular-nums">{t.metric3Val}</span>
                <span className="text-[11px] text-[#50728C] font-semibold">{t.metric3Label}</span>
              </div>
            </div>

          </div>

          {/* Right Column: Interactive Systems Simulator (Crisp White Card with Cyan Borders) */}
          <div className="lg:col-span-5 w-full">
            <div className="lab-card-clean rounded-2xl p-5 sm:p-6 relative overflow-hidden">
              
              {/* Header of instrument */}
              <div className="flex items-center justify-between pb-3 border-b border-[#D8F0FA] mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#00D9F5] shadow-xs shadow-[#00D9F5]" />
                  <span className="font-mono text-xs text-[#0B1F2D] font-bold uppercase tracking-wider">
                    {t.engineTitle}
                  </span>
                </div>
                <span className="font-mono text-[10px] text-[#0096AF] font-bold bg-[#E6F9FD] border border-[#00D9F5]/40 px-2 py-0.5 rounded">
                  {t.engineVer}
                </span>
              </div>

              {/* Stage selector tabs */}
              <div className="grid grid-cols-3 gap-1.5 p-1 bg-[#F0F8FC] rounded-lg border border-[#D0EBF7] mb-4">
                {architectureFlows.map((flow, idx) => (
                  <button
                    key={flow.step}
                    onClick={() => setActiveStage(idx as 0 | 1 | 2)}
                    className={`py-1.5 px-2 text-center rounded-md transition-all font-mono text-xs cursor-pointer ${
                      activeStage === idx
                        ? 'bg-[#00D9F5] text-[#0B1F2D] font-bold shadow-xs'
                        : 'text-[#50728C] hover:text-[#0B1F2D] hover:bg-white'
                    }`}
                  >
                    <span className="block text-[9px] opacity-75">{flow.step}</span>
                    <span className="font-bold">{flow.title}</span>
                  </button>
                ))}
              </div>

              {/* Active Stage Details */}
              <div className="min-h-[190px] flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px] font-mono font-bold text-[#00A381] uppercase tracking-wider">
                      {architectureFlows[activeStage].category}
                    </span>
                    <span className="text-[11px] text-[#50728C] font-mono">
                      {t.phase} {activeStage + 1} / 3
                    </span>
                  </div>

                  <p className="text-xs text-[#1E3A52] leading-relaxed mb-3">
                    {architectureFlows[activeStage].desc}
                  </p>

                  {/* Flow nodes */}
                  <div className="space-y-1.5 mb-3">
                    {architectureFlows[activeStage].nodes.map((node, i) => (
                      <div
                        key={node}
                        className="flex items-center gap-2.5 p-2 rounded bg-[#F8FCFF] border border-[#D8F0FA] text-xs text-[#0B1F2D] hover:border-[#00D9F5] transition-colors shadow-2xs"
                      >
                        <span className="w-4 h-4 rounded flex items-center justify-center font-mono text-[9px] font-bold bg-[#E0F8FC] text-[#0096AF]">
                          0{i + 1}
                        </span>
                        <span className="font-mono text-[#0B1F2D] font-medium text-[11px] flex-1">{node}</span>
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#00A381]" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Output indicator */}
                <div className="pt-2.5 border-t border-[#D8F0FA] flex items-center justify-between text-xs font-mono">
                  <span className="text-[#50728C] text-[11px]">{t.deliverable}</span>
                  <span className="text-[#00A381] font-bold text-[11px] flex items-center gap-1.5">
                    <Cpu className="w-3.5 h-3.5 text-[#00A381]" />
                    {architectureFlows[activeStage].output}
                  </span>
                </div>
              </div>

              {/* Bottom live indicator */}
              <div className="mt-3 pt-2.5 border-t border-[#D8F0FA] flex items-center justify-between text-[10px] font-mono text-[#50728C]">
                <span className="flex items-center gap-1.5">
                  <Network className="w-3 h-3 text-[#0096AF]" />
                  Cokito's Lab Reactive Matrix
                </span>
                <span className="text-[#0096AF] font-bold">{t.matrixStatus}</span>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
