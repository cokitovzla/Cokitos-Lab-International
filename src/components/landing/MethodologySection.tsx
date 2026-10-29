import React, { useState } from 'react';
import { Search, FileCode2, TerminalSquare, LineChart, ShieldCheck } from 'lucide-react';

export const MethodologySection: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      num: '01',
      code: 'OBSERVE',
      title: 'ANALIZAMOS',
      tagline: 'Entendemos el problema, el contexto y los objetivos.',
      description: 'No escribimos una sola línea de código sin entender la raíz del problema. Evaluamos la operación actual, los cuellos de botella manuales, el perfil del usuario y los objetivos comerciales prioritarios.',
      deliverable: 'Diagnóstico Operativo y Mapa de Requerimientos',
      criteria: ['Revisión de flujos actuales', 'Detección de puntos de fricción', 'Factibilidad técnica'],
      icon: Search,
    },
    {
      num: '02',
      code: 'DECODE',
      title: 'DISEÑAMOS',
      tagline: 'Definimos la solución y la arquitectura del sistema.',
      description: 'Modelamos la estructura de base de datos, los flujos de datos, la seguridad de acceso y la experiencia de usuario. Cada componente se proyecta pensando en escalabilidad y facilidad de adopción.',
      deliverable: 'Blueprint de Arquitectura y Prototipo Funcional',
      criteria: ['Esquema relacional de datos', 'Definición de APIs y endpoints', 'Diseño de interfaz ergonómica'],
      icon: FileCode2,
    },
    {
      num: '03',
      code: 'BUILD',
      title: 'DESARROLLAMOS',
      tagline: 'Construimos, integramos y probamos con rigor.',
      description: 'Desarrollamos la solución utilizando código tipado, arquitecturas modernas y validaciones estrictas. Conectamos bases de datos persistentes, APIs externas y aplicamos pruebas funcionales exhaustivas.',
      deliverable: 'Sistema Completo en Entorno de Staging & Producción',
      criteria: ['Control de versiones git', 'Validación de seguridad y roles', 'Pruebas de carga y estrés'],
      icon: TerminalSquare,
    },
    {
      num: '04',
      code: 'EVOLVE',
      title: 'OPTIMIZAMOS',
      tagline: 'Medimos resultados y mejoramos continuamente.',
      description: 'El despliegue no es el final. Medimos los tiempos de respuesta, las tasas de conversión y la estabilidad del sistema para realizar ajustes finos que aseguren un crecimiento sostenido sin fricción.',
      deliverable: 'Telemetría de Rendimiento y Plan de Evolución',
      criteria: ['Monitoreo de tiempos de respuesta', 'Feedback operativo real', 'Optimización de recursos'],
      icon: LineChart,
    },
  ];

  return (
    <section id="metodologia" className="py-12 bg-[#081722] border-t border-[#143247] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Compact Header */}
        <div className="max-w-3xl mb-8">
          <div className="inline-flex items-center gap-2 text-xs font-mono text-[#00D9F5] uppercase tracking-wider mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00E3B2]" />
            <span>03 · The Lab Method</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#F5FBFF] tracking-tight mb-2">
            Nuestra Metodología de Ejecución
          </h2>
          <p className="text-sm text-[#F5FBFF]/75 leading-relaxed">
            Un método estructurado que combina ciencia, ingeniería de software y sentido práctico para transformar ideas en sistemas funcionales sin improvisaciones.
          </p>
        </div>

        {/* Process Timeline Line (Compact) */}
        <div className="relative mb-6">
          {/* Subtle horizontal connecting line */}
          <div className="hidden lg:block absolute top-6 left-12 right-12 h-0.5 bg-gradient-to-r from-[#00D9F5]/30 via-[#00E3B2]/40 to-[#00D9F5]/30 -z-0" />

          {/* Stepper buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 relative z-10">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              const isActive = activeStep === idx;

              return (
                <button
                  key={step.num}
                  onClick={() => setActiveStep(idx)}
                  className={`p-4 rounded-xl text-left transition-all duration-200 cursor-pointer border ${
                    isActive
                      ? 'bg-[#0d2232] border-[#00D9F5] shadow-lg shadow-[#00D9F5]/15 -translate-y-0.5'
                      : 'bg-[#0d2232]/80 border-[#1b3d56] hover:border-[#00D9F5]/60 hover:bg-[#112d42]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className={`font-mono text-xs font-bold px-2 py-0.5 rounded ${
                        isActive
                          ? 'bg-[#00D9F5] text-[#0B1F2D]'
                          : 'bg-[#143247] text-[#00D9F5]'
                      }`}
                    >
                      {step.num}
                    </span>
                    <Icon
                      className={`w-4 h-4 ${
                        isActive ? 'text-[#00E3B2]' : 'text-[#F5FBFF]/40'
                      }`}
                    />
                  </div>

                  <span className="font-mono text-[10px] text-[#00D9F5] uppercase tracking-wider block mb-0.5">
                    {step.code}
                  </span>
                  <h3 className="text-base font-bold text-[#F5FBFF] mb-1">
                    {step.title}
                  </h3>
                  <p className="text-xs text-[#F5FBFF]/70 line-clamp-2 leading-relaxed">
                    {step.tagline}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Detailed Inspector Box for Active Stage */}
        <div className="p-5 sm:p-7 rounded-xl bg-[#0d2232] border border-[#00D9F5]/40 relative overflow-hidden shadow-lg">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-8">
              
              <div className="flex items-center gap-3 mb-2">
                <span className="font-mono text-xs font-bold text-[#00D9F5] bg-[#00D9F5]/10 px-2.5 py-0.5 rounded border border-[#00D9F5]/30">
                  ETAPA {steps[activeStep].num} · {steps[activeStep].code}
                </span>
                <span className="text-xs font-mono text-[#00E3B2] font-semibold">
                  Fase Ejecutiva
                </span>
              </div>

              <h4 className="text-xl sm:text-2xl font-extrabold text-[#F5FBFF] mb-2">
                {steps[activeStep].title}: {steps[activeStep].tagline}
              </h4>

              <p className="text-xs sm:text-sm text-[#F5FBFF]/80 leading-relaxed mb-4">
                {steps[activeStep].description}
              </p>

              {/* Lab Criteria Checklist */}
              <div>
                <span className="text-[11px] font-mono text-[#F5FBFF]/60 uppercase tracking-wider block mb-2">
                  Criterios de Validación Técnica:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {steps[activeStep].criteria.map((c) => (
                    <div
                      key={c}
                      className="p-2 rounded bg-[#081722] border border-[#1b3d56] text-xs text-[#F5FBFF]/85 font-mono flex items-center gap-2"
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-[#00E3B2] shrink-0" />
                      <span>{c}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Deliverable badge */}
            <div className="lg:col-span-4 p-4 rounded-xl bg-[#081722] border border-[#00E3B2]/40 flex flex-col justify-center">
              <span className="font-mono text-[10px] text-[#00E3B2] uppercase tracking-wider mb-1 font-bold">
                Entregable del Laboratorio
              </span>
              <p className="text-sm font-bold text-[#F5FBFF] leading-snug mb-2">
                {steps[activeStep].deliverable}
              </p>
              <div className="text-[10px] font-mono text-[#F5FBFF]/50 pt-2 border-t border-[#16364d]">
                Control de calidad verificado antes del pase a producción.
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
