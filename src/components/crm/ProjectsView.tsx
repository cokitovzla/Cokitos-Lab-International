import React, { useState } from 'react';
import { Project, ProjectStatus, Lead } from '../../types/index.ts';
import { api } from '../../lib/api.ts';
import { 
  FolderGit2, 
  Plus, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  Calendar, 
  User, 
  Layers, 
  Trash2,
  Sparkles,
  List,
  LayoutGrid
} from 'lucide-react';

interface ProjectsViewProps {
  projects: Project[];
  leads: Lead[];
  onProjectUpdated: (project: Project) => void;
  onProjectCreated: (project: Project) => void;
  onProjectDeleted: (id: string) => void;
}

export const ProjectsView: React.FC<ProjectsViewProps> = ({
  projects,
  leads,
  onProjectUpdated,
  onProjectCreated,
  onProjectDeleted,
}) => {
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // New Project Form
  const [name, setName] = useState('');
  const [clientName, setClientName] = useState('');
  const [company, setCompany] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Software a Medida');
  const [outcomeMetric, setOutcomeMetric] = useState('');
  const [visibleOnLanding, setVisibleOnLanding] = useState(true);
  const [status, setStatus] = useState<ProjectStatus>('en_desarrollo');

  const handleToggleLandingVisibility = async (project: Project, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const res = await api.updateProject(project.id, {
        visibleOnLanding: !project.visibleOnLanding,
      });
      onProjectUpdated(res.project);
    } catch (err) {
      console.error('Error toggling landing visibility:', err);
    }
  };

  const handleToggleMilestone = async (project: Project, milestoneId: string) => {
    const updatedMilestones = project.milestones.map((m) => {
      if (m.id === milestoneId) return { ...m, done: !m.done };
      return m;
    });

    try {
      const res = await api.updateProject(project.id, {
        milestones: updatedMilestones,
      });
      onProjectUpdated(res.project);
      if (selectedProject?.id === project.id) {
        setSelectedProject(res.project);
      }
    } catch (err) {
      console.error('Error toggling milestone:', err);
    }
  };

  const handleDeleteProject = async (id: string, name: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(`¿Eliminar el proyecto "${name}"?`)) {
      try {
        await api.deleteProject(id);
        onProjectDeleted(id);
        if (selectedProject?.id === id) setSelectedProject(null);
      } catch (err) {
        console.error('Error deleting project:', err);
      }
    }
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !clientName.trim()) return;

    try {
      const res = await api.createProject({
        name: name.trim(),
        clientName: clientName.trim(),
        company: company.trim() || undefined,
        description: description.trim(),
        status,
        assignedLead: 'Director Cokito',
        startDate: new Date().toISOString().split('T')[0],
        milestones: [
          { id: 'm_1', title: 'Planificación de arquitectura de software', done: true },
          { id: 'm_2', title: 'Desarrollo de módulos e integraciones', done: false },
          { id: 'm_3', title: 'Pruebas de calidad y homologación', done: false },
          { id: 'm_4', title: 'Puesta en marcha y documentación técnica', done: false },
        ],
        visibleOnLanding,
        category,
        categories: [category, 'CRM & Operaciones'],
        releasePhase: 'BETA 2.0',
        outcomeMetric: outcomeMetric.trim() || undefined,
        tags: [category.split(' ')[0], 'Producción'],
      });

      onProjectCreated(res.project);
      setShowCreateModal(false);
      setName('');
      setClientName('');
      setCompany('');
      setDescription('');
      setOutcomeMetric('');
    } catch (err) {
      console.error('Error creating project:', err);
    }
  };

  const statusLabels: Record<ProjectStatus, { label: string; style: string }> = {
    planificacion: { label: 'En Planificación', style: 'text-amber-400 bg-amber-400/10 border-amber-400/30' },
    en_desarrollo: { label: 'En Desarrollo', style: 'text-[#00D9F5] bg-[#00D9F5]/10 border-[#00D9F5]/30' },
    pruebas: { label: 'En Pruebas', style: 'text-indigo-400 bg-indigo-400/10 border-indigo-400/30' },
    entregado: { label: 'Entregado / Operativo', style: 'text-[#00E3B2] bg-[#00E3B2]/10 border-[#00E3B2]/30' },
    mantenimiento: { label: 'Mantenimiento', style: 'text-purple-400 bg-purple-400/10 border-purple-400/30' },
  };

  return (
    <div className="space-y-6">
      
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#D0EBF7]">
        <div>
          <h2 className="text-xl font-bold text-[#0B1F2D] tracking-tight">
            Gestión de Proyectos & Sistemas
          </h2>
          <p className="text-xs font-mono text-[#64748B] mt-0.5">
            {projects.length} Sistemas en cartera · Vista en lista y control de visibilidad en la Landing Page
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* List vs Grid view toggle */}
          <div className="flex items-center p-1 bg-white rounded-lg border border-[#D0EBF7] text-xs font-mono shadow-2xs">
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded transition-colors cursor-pointer ${
                viewMode === 'list'
                  ? 'bg-[#00D9F5] text-[#0B1F2D] font-bold shadow-xs'
                  : 'text-[#1E3A52] hover:text-[#009bb3]'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>Lista</span>
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded transition-colors cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-[#00D9F5] text-[#0B1F2D] font-bold shadow-xs'
                  : 'text-[#1E3A52] hover:text-[#009bb3]'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Cuadrícula</span>
            </button>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-md bg-[#00D9F5] hover:bg-[#00E3B2] text-[#0B1F2D] font-bold text-xs font-mono transition-colors cursor-pointer shadow-xs shadow-[#00D9F5]/20 hover:shadow-[0_0_15px_rgba(0,217,245,0.4)]"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Nuevo Proyecto</span>
          </button>
        </div>
      </div>

      {/* LIST VIEW (Default per user request) */}
      {viewMode === 'list' ? (
        <div className="rounded-xl bg-white border border-[#D0EBF7] overflow-hidden shadow-xs">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#D0EBF7] bg-[#F0F9FF] text-[11px] font-mono text-[#1E3A52] uppercase tracking-wider">
                <th className="py-3 px-4 font-bold">Proyecto</th>
                <th className="py-3 px-4 font-bold">Cliente & Empresa</th>
                <th className="py-3 px-4 font-bold">Categoría</th>
                <th className="py-3 px-4 font-bold">Estado</th>
                <th className="py-3 px-4 font-bold">Hitos Técnicos</th>
                <th className="py-3 px-4 font-bold">En Landing</th>
                <th className="py-3 px-4 text-right font-bold">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E0F2FE] text-xs">
              {projects.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-xs font-mono text-[#64748B]">
                    No hay proyectos registrados aún.
                  </td>
                </tr>
              ) : (
                projects.map((proj) => {
                  const statusInfo = statusLabels[proj.status] || statusLabels.en_desarrollo;
                  const completedM = proj.milestones.filter(m => m.done).length;
                  const totalM = proj.milestones.length;

                  return (
                    <tr
                      key={proj.id}
                      onClick={() => setSelectedProject(proj)}
                      className="hover:bg-[#EAF6FD] transition-all cursor-pointer group"
                    >
                      <td className="py-3 px-4 font-bold text-[#0B1F2D] group-hover:text-[#009bb3] transition-colors">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-[9px] font-mono px-1.5 py-0.5 rounded font-extrabold uppercase bg-[#0B1F2D] text-[#00D9F5]">
                            {proj.releasePhase || 'BETA 2.0'}
                          </span>
                          <span>{proj.name}</span>
                        </div>
                        {proj.outcomeMetric && (
                          <div className="text-[10px] font-mono text-[#00897B] font-bold flex items-center gap-1 mt-0.5">
                            <Sparkles className="w-3 h-3" />
                            {proj.outcomeMetric}
                          </div>
                        )}
                      </td>

                      <td className="py-3 px-4 font-mono text-xs text-[#1E3A52]">
                        <div className="font-semibold">{proj.clientName}</div>
                        {proj.company && <div className="text-[10px] text-[#64748B]">{proj.company}</div>}
                      </td>

                      <td className="py-3 px-4 font-mono text-[11px] text-[#009bb3] font-bold">
                        {proj.category}
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded border capitalize font-medium ${statusInfo.style}`}>
                          {statusInfo.label}
                        </span>
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[11px] text-[#009bb3] font-bold tabular-nums">
                            {completedM}/{totalM}
                          </span>
                          <div className="w-20 bg-[#E0F2FE] h-1.5 rounded-full overflow-hidden border border-[#BCE4F7]">
                            <div
                              className="bg-gradient-to-r from-[#00D9F5] to-[#00E3B2] h-full rounded-full"
                              style={{ width: `${totalM > 0 ? (completedM / totalM) * 100 : 0}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={(e) => handleToggleLandingVisibility(proj, e)}
                          className={`flex items-center gap-1 px-2.5 py-1 rounded text-[10px] font-mono border transition-all cursor-pointer font-bold ${
                            proj.visibleOnLanding
                              ? 'bg-[#00E3B2]/15 text-[#00897B] border-[#00E3B2]/40 hover:bg-[#00E3B2]/25'
                              : 'bg-neutral-100 text-neutral-500 border-neutral-300 hover:text-[#0B1F2D]'
                          }`}
                        >
                          {proj.visibleOnLanding ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                          <span>{proj.visibleOnLanding ? 'Público' : 'Oculto'}</span>
                        </button>
                      </td>

                      <td className="py-3 px-4 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedProject(proj)}
                            className="p-1.5 rounded hover:bg-[#EAF6FD] text-[#009bb3] transition-all cursor-pointer"
                            title="Ver detalles e hitos"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={(e) => handleDeleteProject(proj.id, proj.name, e)}
                            className="p-1.5 rounded hover:bg-rose-50 text-neutral-400 hover:text-rose-600 transition-all cursor-pointer"
                            title="Eliminar proyecto"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      ) : (
        /* GRID VIEW (Alternative) */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => {
            const statusInfo = statusLabels[project.status] || statusLabels.en_desarrollo;
            const doneMilestones = project.milestones.filter(m => m.done).length;
            const totalMilestones = project.milestones.length;

            return (
              <div
                key={project.id}
                onClick={() => setSelectedProject(project)}
                className="p-5 rounded-xl bg-white border border-[#D0EBF7] hover:border-[#00D9F5] hover:shadow-md hover:-translate-y-1 transition-all duration-200 cursor-pointer flex flex-col justify-between group shadow-xs"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-xs font-mono text-[#009bb3] font-bold">
                      {project.category}
                    </span>

                    <button
                      onClick={(e) => handleToggleLandingVisibility(project, e)}
                      className={`flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono border transition-all cursor-pointer ${
                        project.visibleOnLanding
                          ? 'bg-[#00E3B2]/10 text-[#00E3B2] border-[#00E3B2]/30'
                          : 'bg-[#143247] text-[#F5FBFF]/50 border-transparent'
                      }`}
                    >
                      {project.visibleOnLanding ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                      <span>{project.visibleOnLanding ? 'En Landing' : 'Oculto'}</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded font-extrabold uppercase bg-[#0B1F2D] text-[#00D9F5]">
                      {project.releasePhase || 'BETA 2.0'}
                    </span>
                    <h3 className="text-base font-bold text-[#0B1F2D] group-hover:text-[#009bb3] transition-colors">
                      {project.name}
                    </h3>
                  </div>
                  <p className="text-[11px] font-mono text-[#64748B] mb-2">
                    Cliente: {project.company || project.clientName}
                  </p>
                  <p className="text-xs text-[#1E3A52] line-clamp-2 leading-relaxed mb-4">
                    {project.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#D0EBF7] flex items-center justify-between text-xs font-mono">
                  <span className={`px-2 py-0.5 rounded border text-[10px] ${statusInfo.style}`}>
                    {statusInfo.label}
                  </span>
                  <span className="text-[#009bb3] font-bold tabular-nums">
                    {doneMilestones}/{totalMilestones} Hitos
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Project Detail Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85">
          <div className="w-full max-w-2xl bg-[#0B1F2D] border border-[#00D9F5]/40 rounded-2xl p-6 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-[#143247] mb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-mono text-[#00D9F5]">{selectedProject.category}</span>
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded font-extrabold uppercase bg-[#143247] text-[#00D9F5] border border-[#00D9F5]/30">
                    {selectedProject.releasePhase || 'BETA 2.0'}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-[#F5FBFF]">{selectedProject.name}</h3>
                <p className="text-xs font-mono text-[#F5FBFF]/60">Cliente: {selectedProject.clientName}</p>
              </div>
              <button
                onClick={() => setSelectedProject(null)}
                className="text-xs font-mono px-3 py-1.5 bg-[#143247] hover:bg-[#1c4563] text-[#F5FBFF] rounded"
              >
                Cerrar
              </button>
            </div>

            <p className="text-xs sm:text-sm text-[#F5FBFF]/80 mb-4 leading-relaxed">
              {selectedProject.description}
            </p>

            <div className="mb-4">
              <span className="text-xs font-mono text-[#00E3B2] uppercase tracking-wider block mb-2 font-bold">
                Lista de Hitos Técnicos (Haz clic para alternar)
              </span>

              <div className="space-y-1.5">
                {selectedProject.milestones.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => handleToggleMilestone(selectedProject, m.id)}
                    className="w-full p-2.5 rounded-lg bg-[#081722] border border-[#1b3d56] hover:border-[#00D9F5] flex items-center justify-between text-left text-xs transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <CheckCircle2
                        className={`w-4 h-4 ${
                          m.done ? 'text-[#00E3B2]' : 'text-[#F5FBFF]/30'
                        }`}
                      />
                      <span className={`font-mono ${m.done ? 'line-through text-[#F5FBFF]/50' : 'text-[#F5FBFF]'}`}>
                        {m.title}
                      </span>
                    </div>
                    {m.dueDate && (
                      <span className="text-[10px] font-mono text-[#F5FBFF]/50">
                        {m.dueDate}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {selectedProject.internalNotes && (
              <div className="p-3 rounded bg-[#081722] border border-[#16364d] text-xs font-mono text-[#F5FBFF]/70">
                <strong>Notas Internas:</strong> {selectedProject.internalNotes}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Create Project Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85">
          <div className="w-full max-w-lg bg-[#0B1F2D] border border-[#00D9F5]/40 rounded-2xl p-6 shadow-2xl animate-in zoom-in-95">
            <h3 className="text-base font-bold text-[#F5FBFF] mb-3">
              Registrar Nuevo Proyecto o Sistema
            </h3>

            <form onSubmit={handleCreateSubmit} className="space-y-3.5">
              <div>
                <label className="text-xs font-mono text-[#F5FBFF]/80 block mb-1">Nombre del Proyecto *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ej. Sistema de Trazabilidad Logística"
                  className="w-full px-3 py-2 rounded bg-[#081722] border border-[#16364d] text-xs text-[#F5FBFF] outline-none font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-mono text-[#F5FBFF]/80 block mb-1">Cliente / Contacto *</label>
                  <input
                    type="text"
                    required
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="Ej. Juan Pérez"
                    className="w-full px-3 py-2 rounded bg-[#081722] border border-[#16364d] text-xs text-[#F5FBFF] outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="text-xs font-mono text-[#F5FBFF]/80 block mb-1">Empresa</label>
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="Ej. Envios Globales C.A."
                    className="w-full px-3 py-2 rounded bg-[#081722] border border-[#16364d] text-xs text-[#F5FBFF] outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-mono text-[#F5FBFF]/80 block mb-1">Categoría</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-2 py-1.5 rounded bg-[#081722] border border-[#16364d] text-xs text-[#F5FBFF] font-mono"
                  >
                    <option value="Software a Medida">Software a Medida</option>
                    <option value="CRM y Gestión Operativa">CRM y Gestión Operativa</option>
                    <option value="Automatización Inteligente">Automatización Inteligente</option>
                    <option value="Optimización de Sistemas">Optimización de Sistemas</option>
                    <option value="Consultoría Tecnológica">Consultoría Tecnológica</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-mono text-[#F5FBFF]/80 block mb-1">Estado</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as ProjectStatus)}
                    className="w-full px-2 py-1.5 rounded bg-[#081722] border border-[#16364d] text-xs text-[#F5FBFF] font-mono"
                  >
                    <option value="planificacion">Planificación</option>
                    <option value="en_desarrollo">En Desarrollo</option>
                    <option value="pruebas">En Pruebas</option>
                    <option value="entregado">Entregado</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-mono text-[#F5FBFF]/80 block mb-1">Métrica de Impacto (Opcional)</label>
                <input
                  type="text"
                  value={outcomeMetric}
                  onChange={(e) => setOutcomeMetric(e.target.value)}
                  placeholder="Ej. Reducción del 75% en tiempo de despacho"
                  className="w-full px-3 py-2 rounded bg-[#081722] border border-[#16364d] text-xs text-[#F5FBFF] outline-none font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-mono text-[#F5FBFF]/80 block mb-1">Descripción del Sistema</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Explica qué problema soluciona y la arquitectura..."
                  className="w-full px-3 py-2 rounded bg-[#081722] border border-[#16364d] text-xs text-[#F5FBFF] outline-none"
                />
              </div>

              <div className="pt-1">
                <label className="flex items-center gap-2 text-xs font-mono text-[#F5FBFF]/80 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={visibleOnLanding}
                    onChange={(e) => setVisibleOnLanding(e.target.checked)}
                    className="w-4 h-4 rounded text-[#00D9F5]"
                  />
                  <span>Mostrar inmediatamente en la sección pública de proyectos</span>
                </label>
              </div>

              <div className="pt-2 flex justify-end gap-3 border-t border-[#143247]">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-xs font-mono text-[#F5FBFF]/70"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-[#00D9F5] text-[#0B1F2D] text-xs font-bold font-mono hover:bg-[#00E3B2]"
                >
                  Crear Proyecto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
