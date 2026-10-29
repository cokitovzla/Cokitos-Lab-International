import React from 'react';
import { Target, Compass, Code2, RefreshCw, FlaskConical, Binary, Lightbulb, Wrench, MessageSquareText, ShieldCheck } from 'lucide-react';

export const AboutLab: React.FC = () => {
  const pillars = [
    {
      label: 'Propósito (Why)',
      title: 'Hacemos que las ideas funcionen en el mundo real.',
      description: 'Creemos que cada negocio tiene un potencial mayor cuando cuenta con sistemas inteligentes, procesos claros y tecnología bien aplicada. Existimos para convertir ese potencial en resultados tangibles y medibles.',
      icon: Target,
      accent: 'text-[#00D9F5]',
      borderHover: 'hover:border-[#00D9F5]',
      bgBadge: 'bg-[#00D9F5]/10 text-[#00D9F5] border-[#00D9F5]/30',
    },
    {
      label: 'Visión',
      title: 'El estándar en ingeniería digital aplicada.',
      description: 'Ser el laboratorio de referencia en soluciones tecnológicas que impulsan empresas más eficientes, autónomas y escalables en cualquier sector industrial y comercial.',
      icon: Compass,
      accent: 'text-[#00E3B2]',
      borderHover: 'hover:border-[#00E3B2]',
      bgBadge: 'bg-[#00E3B2]/10 text-[#00E3B2] border-[#00E3B2]/30',
    },
    {
      label: 'Qué hacemos (What)',
      title: 'Diseñamos y desarrollamos soluciones a la medida.',
      description: 'Creamos sistemas, plataformas, CRMs y automatizaciones que optimizan operaciones, integran procesos fragmentados y erradican tareas manuales repetitivas.',
      icon: Code2,
      accent: 'text-[#00D9F5]',
      borderHover: 'hover:border-[#00D9F5]',
      bgBadge: 'bg-[#00D9F5]/10 text-[#00D9F5] border-[#00D9F5]/30',
    },
    {
      label: 'Cómo lo hacemos (How)',
      title: 'Analizamos. Diseñamos. Desarrollamos. Optimizamos.',
      description: 'Aplicamos un método estructurado que combina ciencia, estrategia de datos, diseño de interfaz y desarrollo robusto, enfocado en soluciones prácticas y listas para escalar.',
      icon: RefreshCw,
      accent: 'text-[#00E3B2]',
      borderHover: 'hover:border-[#00E3B2]',
      bgBadge: 'bg-[#00E3B2]/10 text-[#00E3B2] border-[#00E3B2]/30',
    },
  ];

  const personality = [
    { 
      name: 'Profesional', 
      tag: 'Rigor Técnico',
      desc: 'Aplicamos estándares estrictos de ingeniería de software y control de versiones. Diseñamos con código tipado, arquitectura tolerante a fallos y documentación transparente para que tu sistema opere sin interrupciones.', 
      icon: FlaskConical,
      color: 'text-[#00D9F5]',
      badgeColor: 'bg-[#00D9F5]/15 border-[#00D9F5]/40 text-[#00D9F5]'
    },
    { 
      name: 'Analíticos', 
      tag: 'Diagnóstico Previo',
      desc: 'Antes de escribir una línea de código, estudiamos los cuellos de botella del equipo, el flujo de datos y las restricciones del negocio para transformar la complejidad operativa en un sistema limpio y predecible.', 
      icon: Binary,
      color: 'text-[#00E3B2]',
      badgeColor: 'bg-[#00E3B2]/15 border-[#00E3B2]/40 text-[#00E3B2]'
    },
    { 
      name: 'Innovadores', 
      tag: 'Vanguardia Útil',
      desc: 'Implementamos arquitecturas modernas, APIs reactivas y automatizaciones en tiempo real que eliminan las tareas manuales propensas a error, posicionando tu empresa con ventaja tecnológica real.', 
      icon: Lightbulb,
      color: 'text-[#00D9F5]',
      badgeColor: 'bg-[#00D9F5]/15 border-[#00D9F5]/40 text-[#00D9F5]'
    },
    { 
      name: 'Resolutivos', 
      tag: 'Impacto Rápido',
      desc: 'Evitamos la burocracia y la sobre-ingeniería innecesaria. Priorizamos el despliegue de soluciones prácticas que resuelvan problemas hoy y generen un retorno inmediato en tiempo y ahorro de costos.', 
      icon: Wrench,
      color: 'text-[#00E3B2]',
      badgeColor: 'bg-[#00E3B2]/15 border-[#00E3B2]/40 text-[#00E3B2]'
    },
    { 
      name: 'Cercanos', 
      tag: 'Trato Directo',
      desc: 'Comunicación clara, transparente y directa de ingeniero a cliente, sin jerga confusa ni intermediarios. Nos involucramos como tu brazo tecnológico de confianza en cada fase del ciclo de vida.', 
      icon: MessageSquareText,
      color: 'text-[#00D9F5]',
      badgeColor: 'bg-[#00D9F5]/15 border-[#00D9F5]/40 text-[#00D9F5]'
    },
  ];

  return (
    <section id="laboratorio" className="py-12 bg-[#081722] border-t border-[#143247] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Compact Section Header */}
        <div className="max-w-3xl mb-8">
          <div className="inline-flex items-center gap-2 text-xs font-mono text-[#00D9F5] uppercase tracking-wider mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00E3B2]" />
            <span>01 · Identidad & Principios del Laboratorio</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#F5FBFF] tracking-tight mb-2">
            Una nueva forma de resolver problemas.
          </h2>

          <p className="text-sm sm:text-base text-[#F5FBFF]/80 leading-snug">
            En Cokito’s Lab combinamos análisis, creatividad y desarrollo tecnológico para transformar ideas, optimizar operaciones y construir soluciones digitales.
            <span className="text-[#00E3B2] font-semibold block sm:inline sm:ml-1.5">
              No empezamos por la tecnología. Empezamos por entender lo que necesitas.
            </span>
          </p>
        </div>

        {/* 4 Pillars Grid (Compact & High Contrast) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {pillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.label}
                className={`p-5 rounded-xl bg-[#0d2232] border border-[#1b3d56] ${pillar.borderHover} hover:bg-[#112d42] transition-all duration-200 group shadow-md hover:shadow-lg hover:shadow-[#00D9F5]/10`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className={`font-mono text-[10px] uppercase tracking-widest px-2.5 py-0.5 rounded border ${pillar.bgBadge}`}>
                    {pillar.label}
                  </span>
                  <div className="p-2 rounded-lg bg-[#081722] border border-[#1b3d56] group-hover:border-[#00D9F5]/60 transition-colors">
                    <Icon className={`w-4 h-4 ${pillar.accent}`} />
                  </div>
                </div>

                <h3 className="text-base font-bold text-[#F5FBFF] group-hover:text-[#00D9F5] transition-colors mb-2 leading-snug">
                  {pillar.title}
                </h3>

                <p className="text-xs sm:text-sm text-[#F5FBFF]/75 leading-relaxed">
                  {pillar.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Philosophy Callout Banner (Compact & High Contrast) */}
        <div className="p-5 sm:p-6 rounded-xl bg-gradient-to-r from-[#0d2232] via-[#102a3e] to-[#0d2232] border border-[#00D9F5]/40 hover:border-[#00D9F5] transition-all shadow-md mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="max-w-2xl">
            <span className="font-mono text-[11px] text-[#00D9F5] uppercase tracking-wider block mb-1">
              Nuestra Filosofía
            </span>
            <h4 className="text-xl sm:text-2xl font-bold text-[#F5FBFF] mb-1.5">
              "Porque las cosas pueden funcionar mejor."
            </h4>
            <p className="text-xs sm:text-sm text-[#F5FBFF]/80 leading-relaxed">
              No somos una agencia convencional de diseño web. Somos un laboratorio donde estudiamos problemas a fondo, identificamos oportunidades latentes y construimos tecnología a medida con código limpio, arquitectura duradera y cero adornos innecesarios.
            </p>
          </div>
          <div className="shrink-0 p-3 rounded-lg bg-[#081722] border border-[#00E3B2]/30 text-xs font-mono text-[#00E3B2] flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#00E3B2]" />
            <span>Ingeniería con Garantía</span>
          </div>
        </div>

        {/* Personality Section: Packed, Rich Text & Clear Layout */}
        <div>
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#143247]">
            <span className="text-xs font-mono text-[#00D9F5] uppercase tracking-wider font-semibold">
              Nuestra Personalidad en Cada Proyecto
            </span>
            <span className="text-[11px] font-mono text-[#00E3B2]">
              5 Pilares de Ejecución
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
            {personality.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.name}
                  className="p-4 rounded-xl bg-[#0d2232] border border-[#1b3d56] hover:border-[#00D9F5] hover:bg-[#112d42] hover:shadow-lg hover:shadow-[#00D9F5]/15 hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between group cursor-default"
                >
                  <div>
                    {/* Header Row: Icon + Name in the same line */}
                    <div className="flex items-center gap-2.5 mb-2.5">
                      <div className="p-2 rounded-lg bg-[#081722] border border-[#1b3d56] group-hover:border-[#00D9F5] group-hover:bg-[#00D9F5]/10 transition-colors shrink-0">
                        <Icon className={`w-4 h-4 ${item.color}`} />
                      </div>
                      <div className="min-w-0">
                        <h5 className="font-bold text-sm text-[#F5FBFF] group-hover:text-[#00D9F5] transition-colors leading-tight">
                          {item.name}
                        </h5>
                        <span className={`text-[10px] font-mono uppercase px-1.5 py-0.2 rounded border ${item.badgeColor} mt-0.5 inline-block`}>
                          {item.tag}
                        </span>
                      </div>
                    </div>

                    {/* Rich Descriptive Text */}
                    <p className="text-xs text-[#F5FBFF]/80 leading-relaxed pt-1 border-t border-[#143247]/60">
                      {item.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};
