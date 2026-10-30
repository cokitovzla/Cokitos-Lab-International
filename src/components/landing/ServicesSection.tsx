import React from 'react';
import { Monitor, RefreshCcw, Database, Gauge, Lightbulb, ArrowUpRight, Check } from 'lucide-react';
import { ProjectType } from '../../types/index.ts';
import { Language, translations } from '../../lib/i18n.ts';
import { trackSectionNavigation } from '../../lib/analytics.ts';

interface ServicesSectionProps {
  onSelectService: (serviceType: ProjectType) => void;
  currentLang: Language;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({ onSelectService, currentLang }) => {
  const t = translations[currentLang].services;

  const services = [
    {
      id: 'software' as ProjectType,
      number: '01',
      title: t.items.softwareTitle,
      tagline: t.items.softwareTag,
      description: t.items.softwareDesc,
      deliverables: currentLang === 'en' ? [
        'Reactive modular architecture',
        'Persistent relational database engines',
        'Granular role-based admin panels',
        'Sub-second page & API speed'
      ] : currentLang === 'fr' ? [
        'Architecture réactive modulaire',
        'Bases de données relationnelles persistantes',
        'Panneaux d\'administration avec rôles granulaires',
        'Vitesse sub-seconde pour les APIs et pages'
      ] : [
        'Arquitectura reactiva y modular',
        'Bases de datos relacionales persistentes',
        'Paneles de administración con roles granulares',
        'Interfaces con velocidad sub-segundo'
      ],
      icon: Monitor,
      badge: currentLang === 'en' ? 'Core Development' : currentLang === 'fr' ? 'Développement Central' : 'Desarrollo Central',
      accentColor: 'text-[#00D9F5]',
      badgeColor: 'bg-[#00D9F5]/10 text-[#00D9F5] border-[#00D9F5]/30',
    },
    {
      id: 'crm' as ProjectType,
      number: '02',
      title: t.items.crmTitle,
      tagline: t.items.crmTag,
      description: t.items.crmDesc,
      deliverables: currentLang === 'en' ? [
        'Sales pipeline Kanban boards',
        'Full customer records & audit trails',
        'Automated task tracking & alerts',
        'Exportable analytics & conversion reports'
      ] : currentLang === 'fr' ? [
        'Tableaux Kanban de pipeline commercial',
        'Fiches clients complètes et traçabilité',
        'Attribution automatique de tâches et alertes',
        'Rapports d\'analyse et export de données'
      ] : [
        'Tableros Kanban de embudo comercial',
        'Fichas integrales de contacto y trazabilidad',
        'Asignación automatizada de tareas y alertas',
        'Exportación y reportes de conversión'
      ],
      icon: Database,
      badge: currentLang === 'en' ? 'Commercial Control' : currentLang === 'fr' ? 'Contrôle Commercial' : 'Control Comercial',
      accentColor: 'text-[#00E3B2]',
      badgeColor: 'bg-[#00E3B2]/10 text-[#00E3B2] border-[#00E3B2]/30',
    },
    {
      id: 'automation' as ProjectType,
      number: '03',
      title: t.items.automationTitle,
      tagline: t.items.automationTag,
      description: t.items.automationDesc,
      deliverables: currentLang === 'en' ? [
        'Secure API & webhook orchestrations',
        'Two-way data synchronizations',
        'Automated invoicing & customer alerts',
        'Fault tolerance & automated retries'
      ] : currentLang === 'fr' ? [
        'Orchestration sécurisée d\'APIs et webhooks',
        'Synchronisation bidirectionnelle des données',
        'Facturation automatique et alertes clients',
        'Tolérance aux pannes et tentatives automatiques'
      ] : [
        'Integración de APIs y webhooks seguros',
        'Sincronización bidireccional de datos',
        'Generación automática de comprobantes y alertas',
        'Tolerancia a fallos y reintentos automatizados'
      ],
      icon: RefreshCcw,
      badge: currentLang === 'en' ? 'Efficiency' : currentLang === 'fr' ? 'Efficience' : 'Eficiencia',
      accentColor: 'text-[#00D9F5]',
      badgeColor: 'bg-[#00D9F5]/10 text-[#00D9F5] border-[#00D9F5]/30',
    },
    {
      id: 'optimization' as ProjectType,
      number: '04',
      title: t.items.optimizationTitle,
      tagline: t.items.optimizationTag,
      description: t.items.optimizationDesc,
      deliverables: currentLang === 'en' ? [
        'Performance & security code audits',
        'Database & schema refactoring',
        'Efficient cloud migration & scaling',
        'Hosting & infrastructure cost reductions'
      ] : currentLang === 'fr' ? [
        'Audits de performance et sécurité du code',
        'Refonte de bases de données et schémas',
        'Migration et mise à l\'échelle dans le cloud',
        'Réduction des coûts d\'hébergement et d\'infrastructure'
      ] : [
        'Auditoría de rendimiento y seguridad',
        'Refactorización de código y bases de datos',
        'Migración a entornos cloud eficientes',
        'Reducción de costos de infraestructura'
      ],
      icon: Gauge,
      badge: currentLang === 'en' ? 'Modernization' : currentLang === 'fr' ? 'Modernisation' : 'Modernización',
      accentColor: 'text-[#00E3B2]',
      badgeColor: 'bg-[#00E3B2]/10 text-[#00E3B2] border-[#00E3B2]/30',
    },
    {
      id: 'consulting' as ProjectType,
      number: '05',
      title: t.items.consultingTitle,
      tagline: t.items.consultingTag,
      description: t.items.consultingDesc,
      deliverables: currentLang === 'en' ? [
        'System architecture blueprinting',
        'Objective timeline & cost projections',
        'Technical Product Requirements (PRD)',
        'Engineering adoption roadmap'
      ] : currentLang === 'fr' ? [
        'Conception de l\'architecture logicielle',
        'Estimations objectives des coûts et délais',
        'Cahier des charges techniques précis (PRD)',
        'Feuille de route pour l\'adoption technologique'
      ] : [
        'Diseño de arquitectura de software',
        'Estimación objetiva de costos y tiempos',
        'Definición de especificaciones técnicas (PRD)',
        'Estrategia de adopción tecnológica'
      ],
      icon: Lightbulb,
      badge: currentLang === 'en' ? 'Strategy' : currentLang === 'fr' ? 'Stratégie' : 'Estrategia',
      accentColor: 'text-[#00D9F5]',
      badgeColor: 'bg-[#00D9F5]/10 text-[#00D9F5] border-[#00D9F5]/30',
    },
  ];

  const handleServiceClick = (serviceId: ProjectType) => {
    trackSectionNavigation(`/what-services#${serviceId}`, 'service_card_quote');
    onSelectService(serviceId);
  };

  return (
    <section id="servicios" className="py-12 bg-white relative bg-tech-grid-light border-t border-[#E0F2FE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Compact Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div className="max-w-2xl">
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

          <div className="shrink-0">
            <span className="font-mono text-xs text-[#00897B] bg-[#00E3B2]/15 border border-[#00E3B2]/40 px-3 py-1 rounded font-bold">
              {t.badge}
            </span>
          </div>
        </div>

        {/* High-Contrast Bento-Grid (Clean, Light Cards) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((service, index) => {
            const Icon = service.icon;
            const isLarge = index === 0;

            return (
              <div
                key={service.id}
                className={`p-5 sm:p-6 rounded-xl lab-card-clean bg-[#F8FCFE] hover:bg-white border-[#CDE9F7] hover:border-[#00D9F5] hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between group ${
                  isLarge ? 'md:col-span-2 lg:col-span-2' : 'col-span-1'
                }`}
              >
                <div>
                  {/* Top line: Number, Badge, Icon */}
                  <div className="flex items-center justify-between mb-3.5">
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono text-sm font-bold text-[#00897B] bg-[#00D9F5]/15 px-2 py-0.5 rounded border border-[#00D9F5]/40">
                        {service.number}
                      </span>
                      <span className={`font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 rounded border ${service.badgeColor} font-bold`}>
                        {service.badge}
                      </span>
                    </div>

                    <div className="p-2 rounded-lg bg-[#EAF6FD] border border-[#BCE4F7] group-hover:border-[#00D9F5] group-hover:bg-[#E0F8FF] transition-colors">
                      <Icon className={`w-5 h-5 ${service.accentColor}`} />
                    </div>
                  </div>

                  {/* Title & Tagline */}
                  <h3 className="text-lg font-bold text-[#0B1F2D] group-hover:text-[#009bb3] transition-colors mb-1">
                    {service.title}
                  </h3>
                  <p className="text-xs font-mono text-[#00897B] font-semibold mb-3">
                    {service.tagline}
                  </p>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-[#1E3A52] leading-relaxed mb-4">
                    {service.description}
                  </p>

                  {/* Deliverables Checklist */}
                  <div className="space-y-1.5 mb-6">
                    {service.deliverables.map((item) => (
                      <div key={item} className="flex items-center gap-2 text-xs text-[#1E3A52] font-mono">
                        <Check className="w-3.5 h-3.5 text-[#00897B] shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Action Button */}
                <div className="pt-3 border-t border-[#E0F2FE]">
                  <button
                    onClick={() => handleServiceClick(service.id)}
                    className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-md bg-[#EAF6FD] group-hover:bg-[#00D9F5] border border-[#BCE4F7] group-hover:border-[#00D9F5] text-[#0B1F2D] text-xs font-bold tracking-wide transition-all cursor-pointer shadow-xs"
                  >
                    <span>{t.quoteBtn} {service.title.split(' ')[0]}</span>
                    <ArrowUpRight className="w-4 h-4 text-[#00897B] group-hover:text-[#0B1F2D] transition-colors" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
