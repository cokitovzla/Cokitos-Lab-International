import React from 'react';
import { Monitor, RefreshCcw, Database, Gauge, Lightbulb, ArrowUpRight, Check } from 'lucide-react';
import { ProjectType } from '../../types/index.ts';

interface ServicesSectionProps {
  onSelectService: (serviceType: ProjectType) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({ onSelectService }) => {
  const services = [
    {
      id: 'software' as ProjectType,
      number: '01',
      title: 'Sistemas y Software a Medida',
      tagline: 'Plataformas, portales y aplicaciones empresariales',
      description: 'Desarrollamos aplicaciones web de alto rendimiento, portales de clientes y plataformas internas diseñadas exactamente para las reglas y lógica de tu negocio.',
      deliverables: [
        'Arquitectura reactiva y modular',
        'Bases de datos relacionales persistentes',
        'Paneles de administración con roles granulares',
        'Interfaces con velocidad sub-segundo'
      ],
      icon: Monitor,
      badge: 'Desarrollo Central',
      accentColor: 'text-[#00D9F5]',
      badgeColor: 'bg-[#00D9F5]/10 text-[#00D9F5] border-[#00D9F5]/30',
    },
    {
      id: 'crm' as ProjectType,
      number: '02',
      title: 'CRM y Gestión Operativa',
      tagline: 'Organización y control en tiempo real',
      description: 'Sistemas a medida para captar leads, administrar pipelines comerciales, dar seguimiento a tareas y convertir oportunidades en proyectos sin fuga de datos.',
      deliverables: [
        'Tableros Kanban de embudo comercial',
        'Fichas integrales de contacto y trazabilidad',
        'Asignación automatizada de tareas y alertas',
        'Exportación y reportes de conversión'
      ],
      icon: Database,
      badge: 'Control Comercial',
      accentColor: 'text-[#00E3B2]',
      badgeColor: 'bg-[#00E3B2]/10 text-[#00E3B2] border-[#00E3B2]/30',
    },
    {
      id: 'automation' as ProjectType,
      number: '03',
      title: 'Automatización de Procesos',
      tagline: 'Flujos inteligentes e integraciones',
      description: 'Reducimos drásticamente las horas dedicadas a tareas repetitivas conectando tus herramientas, pasarelas de pago, correos y sistemas contables.',
      deliverables: [
        'Integración de APIs y webhooks seguros',
        'Sincronización bidireccional de datos',
        'Generación automática de comprobantes y alertas',
        'Tolerancia a fallos y reintentos automatizados'
      ],
      icon: RefreshCcw,
      badge: 'Eficiencia',
      accentColor: 'text-[#00D9F5]',
      badgeColor: 'bg-[#00D9F5]/10 text-[#00D9F5] border-[#00D9F5]/30',
    },
    {
      id: 'optimization' as ProjectType,
      number: '04',
      title: 'Optimización de Sistemas Existentes',
      tagline: 'Análisis, mejora y escalabilidad',
      description: 'Diagnosticamos y modernizamos herramientas tecnológicas lentas, obsoletas o fragmentadas para devolverles velocidad, seguridad y estabilidad.',
      deliverables: [
        'Auditoría de rendimiento y seguridad',
        'Refactorización de código y bases de datos',
        'Migración a entornos cloud eficientes',
        'Reducción de costos de infraestructura'
      ],
      icon: Gauge,
      badge: 'Modernización',
      accentColor: 'text-[#00E3B2]',
      badgeColor: 'bg-[#00E3B2]/10 text-[#00E3B2] border-[#00E3B2]/30',
    },
    {
      id: 'consulting' as ProjectType,
      number: '05',
      title: 'Consultoría Tecnológica',
      tagline: 'Estrategia y acompañamiento',
      description: 'Evaluamos la viabilidad técnica de nuevas ideas, definimos la arquitectura correcta antes de gastar en desarrollo y guiamos la toma de decisiones tecnológicas.',
      deliverables: [
        'Diseño de arquitectura de software',
        'Estimación objetiva de costos y tiempos',
        'Definición de especificaciones técnicas (PRD)',
        'Estrategia de adopción tecnológica'
      ],
      icon: Lightbulb,
      badge: 'Estrategia',
      accentColor: 'text-[#00D9F5]',
      badgeColor: 'bg-[#00D9F5]/10 text-[#00D9F5] border-[#00D9F5]/30',
    },
  ];

  return (
    <section id="servicios" className="py-12 bg-[#0B1F2D] relative bg-tech-grid border-t border-[#143247]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Compact Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 text-xs font-mono text-[#00D9F5] uppercase tracking-wider mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00D9F5]" />
              <span>02 · Capacidades del Laboratorio</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#F5FBFF] tracking-tight mb-2">
              Nuestros Servicios de Ingeniería
            </h2>
            <p className="text-sm text-[#F5FBFF]/75 leading-relaxed">
              Soluciones estructuradas con ingeniería precisa, código limpio y rendimiento operativo sub-segundo.
            </p>
          </div>

          <div className="shrink-0">
            <span className="font-mono text-xs text-[#00E3B2] bg-[#00E3B2]/10 border border-[#00E3B2]/30 px-3 py-1 rounded">
              Tecnología sin obsolescencia
            </span>
          </div>
        </div>

        {/* High-Contrast Bento-Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((service, index) => {
            const Icon = service.icon;
            const isLarge = index === 0;

            return (
              <div
                key={service.id}
                className={`p-5 sm:p-6 rounded-xl bg-[#0d2232] border border-[#1b3d56] hover:border-[#00D9F5] hover:bg-[#112d42] hover:shadow-xl hover:shadow-[#00D9F5]/15 hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between group ${
                  isLarge ? 'md:col-span-2 lg:col-span-2' : 'col-span-1'
                }`}
              >
                <div>
                  {/* Top line: Number, Badge, Icon */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono text-sm font-bold text-[#00D9F5] bg-[#00D9F5]/10 px-2 py-0.5 rounded border border-[#00D9F5]/30">
                        {service.number}
                      </span>
                      <span className={`font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 rounded border ${service.badgeColor}`}>
                        {service.badge}
                      </span>
                    </div>

                    <div className="p-2 rounded-lg bg-[#081722] border border-[#1b3d56] group-hover:border-[#00D9F5] group-hover:bg-[#00D9F5]/10 transition-colors">
                      <Icon className={`w-5 h-5 ${service.accentColor}`} />
                    </div>
                  </div>

                  {/* Title & Tagline */}
                  <h3 className="text-lg font-bold text-[#F5FBFF] group-hover:text-[#00D9F5] transition-colors mb-1">
                    {service.title}
                  </h3>
                  <p className="text-xs font-mono text-[#00E3B2] mb-3">
                    {service.tagline}
                  </p>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-[#F5FBFF]/75 leading-relaxed mb-4">
                    {service.description}
                  </p>

                  {/* Deliverables Checklist */}
                  <div className="space-y-1.5 mb-6">
                    {service.deliverables.map((item) => (
                      <div key={item} className="flex items-center gap-2 text-xs text-[#F5FBFF]/85 font-mono">
                        <Check className="w-3.5 h-3.5 text-[#00E3B2] shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Action Button */}
                <div className="pt-3 border-t border-[#143247]">
                  <button
                    onClick={() => onSelectService(service.id)}
                    className="w-full flex items-center justify-between px-3.5 py-2 rounded-md bg-[#081722] group-hover:bg-[#00D9F5] border border-[#1b3d56] group-hover:border-[#00D9F5] text-[#F5FBFF] group-hover:text-[#0B1F2D] text-xs font-bold tracking-wide transition-all cursor-pointer"
                  >
                    <span>Cotizar {service.title.split(' ')[0]}</span>
                    <ArrowUpRight className="w-4 h-4 text-[#00D9F5] group-hover:text-[#0B1F2D] transition-colors" />
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
