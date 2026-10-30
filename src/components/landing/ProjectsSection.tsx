import React, { useState, useEffect } from 'react';
import { Project } from '../../types/index.ts';
import { api } from '../../lib/api.ts';
import { INITIAL_PROJECTS } from '../../lib/initialData.ts';
import { Language, translations } from '../../lib/i18n.ts';
import { trackSectionNavigation } from '../../lib/analytics.ts';
import { CheckCircle2, Clock, Sparkles, FolderGit2, ExternalLink, FlaskConical } from 'lucide-react';

interface ProjectsSectionProps {
  currentLang: Language;
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({ currentLang }) => {
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [loading, setLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');

  const t = translations[currentLang].projects;

  useEffect(() => {
    async function loadProjects() {
      try {
        const res = await api.getPublicProjects();
        if (res.projects && res.projects.length > 0) {
          setProjects(res.projects);
        }
      } catch (e) {
        console.error('Error fetching public projects:', e);
      }
    }
    loadProjects();
  }, []);

  const categories = ['all', ...Array.from(new Set(projects.map(p => p.category)))];

  const filteredProjects = activeCategory === 'all'
    ? projects
    : projects.filter(p => p.category === activeCategory);

  const statusLabels: Record<string, { label: string; color: string }> = {
    planificacion: { 
      label: currentLang === 'en' ? 'In Planning' : currentLang === 'fr' ? 'En Planification' : 'En Planificación', 
      color: 'text-amber-400 bg-amber-400/10 border-amber-400/30' 
    },
    en_desarrollo: { 
      label: currentLang === 'en' ? 'In Development' : currentLang === 'fr' ? 'En Développement' : 'En Desarrollo', 
      color: 'text-[#00D9F5] bg-[#00D9F5]/10 border-[#00D9F5]/30' 
    },
    pruebas: { 
      label: currentLang === 'en' ? 'Testing Phase' : currentLang === 'fr' ? 'Phase de Test' : 'Fase de Pruebas', 
      color: 'text-indigo-400 bg-indigo-400/10 border-indigo-400/30' 
    },
    entregado: { 
      label: currentLang === 'en' ? 'Delivered & Live' : currentLang === 'fr' ? 'Livré & Opérationnel' : 'Completado & Operativo', 
      color: 'text-[#00E3B2] bg-[#00E3B2]/10 border-[#00E3B2]/30' 
    },
    mantenimiento: { 
      label: currentLang === 'en' ? 'Continuous Support' : currentLang === 'fr' ? 'Support Continu' : 'Soporte Continuo', 
      color: 'text-purple-400 bg-purple-400/10 border-purple-400/30' 
    },
  };

  const handleFilterClick = (cat: string) => {
    setActiveCategory(cat);
    trackSectionNavigation(`/projects?category=${encodeURIComponent(cat)}`, 'projects_filter_click');
  };

  return (
    <section id="proyectos" className="py-12 bg-white border-t border-[#E0F2FE] relative bg-tech-grid-light">
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

          {/* Interactive filter segmented control */}
          {categories.length > 2 && (
            <div className="flex flex-wrap items-center gap-1.5 p-1 bg-[#EAF6FD] rounded-lg border border-[#BCE4F7]">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleFilterClick(cat)}
                  className={`px-3 py-1 text-xs font-mono rounded-md transition-colors cursor-pointer ${
                    activeCategory === cat
                      ? 'bg-[#00D9F5] text-[#0B1F2D] font-bold shadow-xs'
                      : 'text-[#1E3A52] hover:text-[#009bb3] hover:bg-white'
                  }`}
                >
                  {cat === 'all' ? t.allFilter : cat}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Projects Cards List (Dense & High Contrast) */}
        {loading ? (
          <div className="py-10 text-center text-[#64748B] font-mono text-xs">
            Loading database records...
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="p-6 rounded-xl lab-card-clean bg-white border-[#BCE4F7] text-center max-w-xl mx-auto">
            <FolderGit2 className="w-8 h-8 text-[#009bb3] mx-auto mb-2" />
            <p className="text-xs text-[#1E3A52]">
              {t.empty}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {filteredProjects.map((project) => {
              const statusInfo = statusLabels[project.status] || {
                label: project.status,
                color: 'text-neutral-600 bg-neutral-100 border-neutral-300',
              };

              const completedMilestones = project.milestones.filter(m => m.done).length;
              const totalMilestones = project.milestones.length;

              const primaryColor = project.colorTheme?.primary || '#00D9F5';
              const secondaryColor = project.colorTheme?.secondary || '#00E3B2';

              return (
                <div
                  key={project.id}
                  style={{
                    borderTop: `3px solid ${primaryColor}`,
                  }}
                  className="p-5 rounded-xl lab-card-clean bg-[#F8FCFE] hover:bg-white border-[#CDE9F7] hover:border-[#00D9F5] hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between group shadow-xs relative overflow-hidden"
                >
                  {/* Subtle palette glow at top */}
                  <div
                    className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-10 blur-2xl pointer-events-none transition-opacity group-hover:opacity-20"
                    style={{ backgroundColor: primaryColor }}
                  />

                  <div>
                    {/* Lab Origin Seal */}
                    <div className="flex items-center gap-1.5 mb-2.5 pb-2 border-b border-[#E0F2FE]">
                      <FlaskConical className="w-3.5 h-3.5 text-[#00897B]" />
                      <span className="text-[10px] font-mono tracking-wider uppercase text-[#0B1F2D] font-bold">
                        Proyecto del Laboratorio de Cokito’s Lab
                      </span>
                    </div>

                    {/* Header: Category & Status */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span
                        className="text-xs font-mono font-bold"
                        style={{ color: primaryColor === '#00D9F5' ? '#009bb3' : primaryColor }}
                      >
                        {project.category}
                      </span>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded border font-semibold ${statusInfo.color}`}>
                        {statusInfo.label}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-base font-bold text-[#0B1F2D] group-hover:text-[#009bb3] transition-colors mb-1 leading-snug">
                      {project.name}
                    </h3>

                    {/* Client / Context note */}
                    <p className="text-[11px] font-mono text-[#00897B] font-semibold mb-3">
                      {t.context} {project.company || project.clientName}
                    </p>

                    {/* Description */}
                    <p className="text-xs text-[#1E3A52] leading-relaxed mb-4 line-clamp-3">
                      {project.description}
                    </p>

                    {/* Impact metric if available */}
                    {project.outcomeMetric && (
                      <div
                        className="p-2.5 rounded-lg border mb-4 flex items-center gap-2"
                        style={{
                          backgroundColor: `${primaryColor}10`,
                          borderColor: `${primaryColor}40`,
                        }}
                      >
                        <Sparkles className="w-3.5 h-3.5 text-[#00897B] shrink-0" />
                        <span className="text-xs font-mono text-[#00897B] font-bold">
                          {project.outcomeMetric}
                        </span>
                      </div>
                    )}

                    {/* Milestones Progress */}
                    {totalMilestones > 0 && (
                      <div className="mb-4">
                        <div className="flex items-center justify-between text-[11px] font-mono text-[#64748B] mb-1.5 font-semibold">
                          <span>{t.milestones}</span>
                          <span className="tabular-nums font-bold" style={{ color: primaryColor === '#00D9F5' ? '#009bb3' : primaryColor }}>
                            {completedMilestones}/{totalMilestones}
                          </span>
                        </div>
                        <div className="w-full bg-[#E0F2FE] h-2 rounded-full overflow-hidden border border-[#BCE4F7]">
                          <div
                            className="h-full rounded-full transition-all"
                            style={{
                              width: `${(completedMilestones / totalMilestones) * 100}%`,
                              background: `linear-gradient(90deg, ${primaryColor}, ${secondaryColor})`,
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    {/* Demo / Live link if available */}
                    {project.demoUrl && (
                      <div className="mb-3">
                        <a
                          href={project.demoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => trackSectionNavigation(project.demoUrl!, 'project_demo_click')}
                          className="w-full py-2 px-3 rounded-lg bg-[#0B1F2D] hover:bg-[#133045] text-white text-xs font-mono font-bold flex items-center justify-center gap-2 transition-all shadow-xs group/btn border border-[#00D9F5]/40 hover:border-[#00D9F5]"
                        >
                          <span>Explorar en Producción</span>
                          <ExternalLink className="w-3.5 h-3.5 text-[#00D9F5] group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                        </a>
                      </div>
                    )}

                    {/* Footer tags */}
                    <div className="pt-3 border-t border-[#E0F2FE] flex flex-wrap gap-1.5">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] font-mono text-[#1E3A52] bg-[#EAF6FD] px-2 py-0.5 rounded border border-[#BCE4F7] font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
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
