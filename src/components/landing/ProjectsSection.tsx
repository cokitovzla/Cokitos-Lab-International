import React, { useState, useEffect } from 'react';
import { Project } from '../../types/index.ts';
import { api } from '../../lib/api.ts';
import { CheckCircle2, Clock, Sparkles, FolderGit2 } from 'lucide-react';

export const ProjectsSection: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');

  useEffect(() => {
    async function loadProjects() {
      try {
        const res = await api.getPublicProjects();
        setProjects(res.projects);
      } catch (e) {
        console.error('Error fetching public projects:', e);
      } finally {
        setLoading(false);
      }
    }
    loadProjects();
  }, []);

  const categories = ['all', ...Array.from(new Set(projects.map(p => p.category)))];

  const filteredProjects = activeCategory === 'all'
    ? projects
    : projects.filter(p => p.category === activeCategory);

  const statusLabels: Record<string, { label: string; color: string }> = {
    planificacion: { label: 'En Planificación', color: 'text-amber-400 bg-amber-400/10 border-amber-400/30' },
    en_desarrollo: { label: 'En Desarrollo', color: 'text-[#00D9F5] bg-[#00D9F5]/10 border-[#00D9F5]/30' },
    pruebas: { label: 'Fase de Pruebas', color: 'text-indigo-400 bg-indigo-400/10 border-indigo-400/30' },
    entregado: { label: 'Completado & Operativo', color: 'text-[#00E3B2] bg-[#00E3B2]/10 border-[#00E3B2]/30' },
    mantenimiento: { label: 'Soporte Continuo', color: 'text-purple-400 bg-purple-400/10 border-purple-400/30' },
  };

  return (
    <section id="proyectos" className="py-12 bg-[#0B1F2D] border-t border-[#143247] relative bg-tech-grid">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Compact Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 text-xs font-mono text-[#00D9F5] uppercase tracking-wider mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00D9F5]" />
              <span>04 · Soluciones & Sistemas</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#F5FBFF] tracking-tight mb-2">
              Proyectos del Laboratorio
            </h2>
            <p className="text-sm text-[#F5FBFF]/75 leading-relaxed">
              Muestra verificada de arquitecturas, CRMs y automatizaciones desarrolladas por Cokito's Lab. Sincronizado en tiempo real con el CRM administrativo.
            </p>
          </div>

          {/* Interactive filter segmented control */}
          {categories.length > 2 && (
            <div className="flex flex-wrap items-center gap-1.5 p-1 bg-[#081722] rounded-lg border border-[#16364d]">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1 text-xs font-mono rounded-md transition-colors cursor-pointer ${
                    activeCategory === cat
                      ? 'bg-[#00D9F5] text-[#0B1F2D] font-bold'
                      : 'text-[#F5FBFF]/70 hover:text-[#00D9F5] hover:bg-[#122e43]'
                  }`}
                >
                  {cat === 'all' ? 'Todos los Sistemas' : cat}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Projects Cards List (Dense & High Contrast) */}
        {loading ? (
          <div className="py-10 text-center text-[#F5FBFF]/60 font-mono text-xs">
            Cargando proyectos desde la base de datos...
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="p-6 rounded-xl bg-[#0d2232] border border-[#1b3d56] text-center max-w-xl mx-auto">
            <FolderGit2 className="w-8 h-8 text-[#00D9F5] mx-auto mb-2" />
            <p className="text-xs text-[#F5FBFF]/70">
              Aún no hay proyectos marcados para visualización pública en esta categoría. Puedes activarlos en cualquier momento desde el CRM administrativo.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {filteredProjects.map((project) => {
              const statusInfo = statusLabels[project.status] || {
                label: project.status,
                color: 'text-neutral-400 bg-neutral-400/10 border-neutral-400/20',
              };

              const completedMilestones = project.milestones.filter(m => m.done).length;
              const totalMilestones = project.milestones.length;

              return (
                <div
                  key={project.id}
                  className="p-5 rounded-xl bg-[#0d2232] border border-[#1b3d56] hover:border-[#00D9F5] hover:bg-[#112d42] hover:shadow-xl hover:shadow-[#00D9F5]/15 hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between group"
                >
                  <div>
                    {/* Header: Category & Status */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="text-xs font-mono text-[#00D9F5] font-semibold">
                        {project.category}
                      </span>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${statusInfo.color}`}>
                        {statusInfo.label}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-base font-bold text-[#F5FBFF] group-hover:text-[#00D9F5] transition-colors mb-1 leading-snug">
                      {project.name}
                    </h3>

                    {/* Client / Context note */}
                    <p className="text-[11px] font-mono text-[#00E3B2] mb-3">
                      Contexto: {project.company || project.clientName}
                    </p>

                    {/* Description */}
                    <p className="text-xs text-[#F5FBFF]/80 leading-relaxed mb-4 line-clamp-3">
                      {project.description}
                    </p>

                    {/* Impact metric if available */}
                    {project.outcomeMetric && (
                      <div className="p-2.5 rounded-lg bg-[#081722] border border-[#00E3B2]/40 mb-4 flex items-center gap-2">
                        <Sparkles className="w-3.5 h-3.5 text-[#00E3B2] shrink-0" />
                        <span className="text-xs font-mono text-[#00E3B2] font-semibold">
                          {project.outcomeMetric}
                        </span>
                      </div>
                    )}

                    {/* Milestones Progress */}
                    {totalMilestones > 0 && (
                      <div className="mb-4">
                        <div className="flex items-center justify-between text-[11px] font-mono text-[#F5FBFF]/60 mb-1.5">
                          <span>Hitos Técnicos</span>
                          <span className="tabular-nums font-bold text-[#00D9F5]">
                            {completedMilestones}/{totalMilestones}
                          </span>
                        </div>
                        <div className="w-full bg-[#081722] h-1.5 rounded-full overflow-hidden border border-[#1b3d56]">
                          <div
                            className="bg-gradient-to-r from-[#00D9F5] to-[#00E3B2] h-full rounded-full transition-all"
                            style={{
                              width: `${(completedMilestones / totalMilestones) * 100}%`,
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Footer tags */}
                  <div className="pt-3 border-t border-[#143247] flex flex-wrap gap-1.5">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] font-mono text-[#F5FBFF]/70 bg-[#081722] px-2 py-0.5 rounded border border-[#1b3d56]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
};
