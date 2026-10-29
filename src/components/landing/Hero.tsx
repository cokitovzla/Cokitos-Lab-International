import React, { useState } from 'react';
import { ArrowRight, Terminal, Cpu, Database, Network, CheckCircle2, ChevronRight, Zap } from 'lucide-react';

interface HeroProps {
  onNavigateToSection: (sectionId: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ onNavigateToSection }) => {
  const [activeStage, setActiveStage] = useState<0 | 1 | 2>(0);

  const architectureFlows = [
    {
      step: '01',
      title: 'IDEAS',
      category: 'Entrada y Diagnóstico',
      desc: 'Decodificamos el problema operativo real, los cuellos de botella y la arquitectura de datos requerida.',
      nodes: ['Recepción de Requerimiento', 'Validación de Restricciones', 'Mapeo de Flujo'],
      output: 'Especificación Técnica & Blueprint',
    },
    {
      step: '02',
      title: 'SISTEMAS',
      category: 'Ingeniería y Automatización',
      desc: 'Construimos sistemas robustos, portales reactivos, CRMs a medida y pipelines de integración continua.',
      nodes: ['Motor de Base de Datos', 'APIs & Conectores Seguros', 'Interfaz de Control'],
      output: 'Plataforma Escalable en Producción',
    },
    {
      step: '03',
      title: 'RESULTADOS',
      category: 'Impacto y Autonomía',
      desc: 'Eliminamos el caos manual, aceleramos el tiempo de respuesta y preparamos tu operación para escalar sin fricción.',
      nodes: ['Operación Autónoma', 'Telemetría en Vivo', 'Reducción de Costos'],
      output: 'Retorno Medible & Control Total',
    },
  ];

  return (
    <section className="relative pt-24 pb-10 lg:pt-28 lg:pb-14 overflow-hidden bg-tech-grid">
      {/* Background radiant ambient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[300px] bg-gradient-to-tr from-[#00D9F5]/15 via-[#00E3B2]/10 to-transparent blur-[100px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Core Value Proposition */}
          <div className="lg:col-span-7 flex flex-col items-start">
            
            {/* Laboratory Subheader / Slogan */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#0d2232] border border-[#00D9F5]/40 text-xs font-mono text-[#00D9F5] mb-4 shadow-sm hover:border-[#00D9F5] transition-colors">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00E3B2] animate-pulse" />
              <span className="font-semibold tracking-wide">Menos caos. Automatiza. Escala.</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#F5FBFF] leading-[1.15] mb-4 text-balance">
              Transformamos{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00D9F5] via-[#00E3B2] to-[#00D9F5]">
                ideas en sistemas
              </span>{' '}
              que funcionan.
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base text-[#F5FBFF]/80 max-w-2xl leading-relaxed mb-6">
              Analizamos tus necesidades, diseñamos soluciones inteligentes y desarrollamos tecnología a medida para llevar tu operación al siguiente nivel. No vendemos plantillas: creamos ingeniería digital para negocios reales.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto mb-8">
              <button
                onClick={() => onNavigateToSection('contacto')}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-bold text-[#0B1F2D] bg-[#00D9F5] hover:bg-[#00E3B2] hover:shadow-[0_0_20px_rgba(0,217,245,0.4)] transition-all rounded-md cursor-pointer whitespace-nowrap shadow-md shadow-[#00D9F5]/20 hover:-translate-y-0.5"
              >
                <span>Hablemos de tu proyecto</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onNavigateToSection('laboratorio')}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold text-[#F5FBFF] hover:text-[#00D9F5] bg-[#0d2232] hover:bg-[#112d42] border border-[#1b3d56] hover:border-[#00D9F5] transition-all rounded-md cursor-pointer whitespace-nowrap hover:-translate-y-0.5"
              >
                <span>Explora el laboratorio</span>
                <ChevronRight className="w-4 h-4 text-[#00D9F5]" />
              </button>
            </div>

            {/* Laboratory Trust Proof Strip (Dense, high-contrast) */}
            <div className="pt-4 border-t border-[#16364d] w-full grid grid-cols-3 gap-4 text-left">
              <div className="p-2.5 rounded-lg bg-[#0d2232] border border-[#1a3d56] hover:border-[#00D9F5]/50 transition-colors">
                <span className="block font-mono text-xl sm:text-2xl font-bold text-[#00D9F5] tabular-nums">100%</span>
                <span className="text-[11px] text-[#F5FBFF]/70 font-medium">Software a la medida</span>
              </div>
              <div className="p-2.5 rounded-lg bg-[#0d2232] border border-[#1a3d56] hover:border-[#00E3B2]/50 transition-colors">
                <span className="block font-mono text-xl sm:text-2xl font-bold text-[#00E3B2] tabular-nums">&lt;24h</span>
                <span className="text-[11px] text-[#F5FBFF]/70 font-medium">Diagnóstico de viabilidad</span>
              </div>
              <div className="p-2.5 rounded-lg bg-[#0d2232] border border-[#1a3d56] hover:border-[#00D9F5]/50 transition-colors">
                <span className="block font-mono text-xl sm:text-2xl font-bold text-[#F5FBFF] tabular-nums">0</span>
                <span className="text-[11px] text-[#F5FBFF]/70 font-medium">Código desechable</span>
              </div>
            </div>

          </div>

          {/* Right Column: Interactive Technological Systems Diagram */}
          <div className="lg:col-span-5 w-full">
            <div className="rounded-xl border border-[#00D9F5]/40 hover:border-[#00D9F5] transition-colors bg-[#081722]/95 backdrop-blur-md p-4 sm:p-5 shadow-xl relative overflow-hidden">
              
              {/* Header of instrument */}
              <div className="flex items-center justify-between pb-3 border-b border-[#143247] mb-3.5">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#00D9F5] shadow-sm shadow-[#00D9F5]" />
                  <span className="font-mono text-xs text-[#F5FBFF] font-semibold uppercase tracking-wider">
                    The Lab Method Engine
                  </span>
                </div>
                <span className="font-mono text-[10px] text-[#00D9F5] font-bold bg-[#00D9F5]/10 border border-[#00D9F5]/30 px-2 py-0.5 rounded">
                  ARQ. v1.0
                </span>
              </div>

              {/* Stage selector tabs */}
              <div className="grid grid-cols-3 gap-1.5 p-1 bg-[#0b1f2d] rounded-lg border border-[#16364d] mb-4">
                {architectureFlows.map((flow, idx) => (
                  <button
                    key={flow.step}
                    onClick={() => setActiveStage(idx as 0 | 1 | 2)}
                    className={`py-1.5 px-2 text-center rounded-md transition-all font-mono text-xs cursor-pointer ${
                      activeStage === idx
                        ? 'bg-[#00D9F5] text-[#0B1F2D] font-bold shadow-sm'
                        : 'text-[#F5FBFF]/70 hover:text-[#00D9F5] hover:bg-[#122e43]'
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
                    <span className="text-[11px] font-mono font-bold text-[#00E3B2] uppercase tracking-wider">
                      {architectureFlows[activeStage].category}
                    </span>
                    <span className="text-[11px] text-[#F5FBFF]/50 font-mono">
                      Fase {activeStage + 1} de 3
                    </span>
                  </div>

                  <p className="text-xs text-[#F5FBFF]/80 leading-relaxed mb-3">
                    {architectureFlows[activeStage].desc}
                  </p>

                  {/* Flow nodes */}
                  <div className="space-y-1.5 mb-3">
                    {architectureFlows[activeStage].nodes.map((node, i) => (
                      <div
                        key={node}
                        className="flex items-center gap-2.5 p-2 rounded bg-[#0d2232] border border-[#1b3d56] text-xs text-[#F5FBFF] hover:border-[#00D9F5]/40 transition-colors"
                      >
                        <span className="w-4 h-4 rounded flex items-center justify-center font-mono text-[9px] font-bold bg-[#00D9F5]/20 text-[#00D9F5]">
                          0{i + 1}
                        </span>
                        <span className="font-mono text-[#F5FBFF]/90 text-[11px] flex-1">{node}</span>
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#00E3B2]" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Output indicator */}
                <div className="pt-2.5 border-t border-[#143247] flex items-center justify-between text-xs font-mono">
                  <span className="text-[#F5FBFF]/60 text-[11px]">Entregable clave:</span>
                  <span className="text-[#00E3B2] font-semibold text-[11px] flex items-center gap-1.5">
                    <Cpu className="w-3.5 h-3.5 text-[#00E3B2]" />
                    {architectureFlows[activeStage].output}
                  </span>
                </div>
              </div>

              {/* Bottom live indicator */}
              <div className="mt-3 pt-2.5 border-t border-[#143247]/60 flex items-center justify-between text-[10px] font-mono text-[#F5FBFF]/50">
                <span className="flex items-center gap-1.5">
                  <Network className="w-3 h-3 text-[#00D9F5]" />
                  Cokito's Lab Reactive Matrix
                </span>
                <span className="text-[#00D9F5] font-semibold">Persistencia Activa</span>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
