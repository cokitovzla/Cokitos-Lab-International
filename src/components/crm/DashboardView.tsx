import React, { useState } from 'react';
import { DashboardStats, Lead, Project, Task } from '../../types/index.ts';
import { api } from '../../lib/api.ts';
import { 
  Users, 
  Sparkles, 
  TrendingUp, 
  Layers, 
  CheckSquare, 
  Clock, 
  ArrowUpRight, 
  Download, 
  Plus, 
  Activity,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  Building,
  CheckCircle2,
  Calendar,
  Eye,
  Filter,
  List,
  FolderGit2
} from 'lucide-react';

interface DashboardViewProps {
  stats: DashboardStats | null;
  leads: Lead[];
  tasks: Task[];
  projects: Project[];
  onNavigateTab: (tabId: string) => void;
  onSelectLead: (lead: Lead) => void;
  onOpenNewContactModal: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  stats,
  leads,
  tasks,
  projects,
  onNavigateTab,
  onSelectLead,
  onOpenNewContactModal,
}) => {
  const [activeListFilter, setActiveListFilter] = useState<'all' | 'leads' | 'tasks' | 'projects'>('all');
  const todayStr = new Date().toISOString().split('T')[0];

  const handleExportCsv = () => {
    window.location.href = api.getExportCsvUrl();
  };

  const stageBadgeStyle: Record<string, string> = {
    nuevo_contacto: 'bg-[#00D9F5]/15 text-[#00D9F5] border-[#00D9F5]/40',
    en_evaluacion: 'bg-sky-400/15 text-sky-400 border-sky-400/40',
    contactado: 'bg-indigo-400/15 text-indigo-400 border-indigo-400/40',
    reunion_programada: 'bg-violet-400/15 text-violet-400 border-violet-400/40',
    propuesta_enviada: 'bg-amber-400/15 text-amber-400 border-amber-400/40',
    negociacion: 'bg-orange-400/15 text-orange-400 border-orange-400/40',
    ganado: 'bg-[#00E3B2]/15 text-[#00E3B2] border-[#00E3B2]/40 font-bold',
    perdido: 'bg-rose-400/15 text-rose-400 border-rose-400/40',
  };

  const priorityBadgeStyle: Record<string, string> = {
    baja: 'text-neutral-400 bg-neutral-400/10 border-neutral-400/20',
    media: 'text-[#00D9F5] bg-[#00D9F5]/10 border-[#00D9F5]/30',
    alta: 'text-amber-400 bg-amber-400/10 border-amber-400/30',
    urgente: 'text-rose-400 bg-rose-400/15 border-rose-400/40 font-bold',
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header & Fast Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#D0EBF7]">
        <div>
          <h1 className="text-xl font-bold text-[#0B1F2D] tracking-tight flex items-center gap-2">
            <List className="w-5 h-5 text-[#009bb3]" />
            <span>Cokito's Lab Control Center — Vista en Lista</span>
          </h1>
          <p className="text-xs font-mono text-[#64748B] mt-0.5">
            Gestión operacional unificada en formato de listas de alta densidad
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportCsv}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white hover:bg-[#EAF6FD] border border-[#BCE4F7] hover:border-[#00D9F5] text-xs font-mono text-[#009bb3] font-bold transition-all cursor-pointer shadow-2xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Exportar CSV</span>
          </button>

          <button
            onClick={onOpenNewContactModal}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-md bg-[#00D9F5] hover:bg-[#00E3B2] text-[#0B1F2D] font-bold text-xs font-mono transition-colors cursor-pointer shadow-xs shadow-[#00D9F5]/20 hover:shadow-[0_0_15px_rgba(0,217,245,0.4)]"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Nuevo Lead</span>
          </button>
        </div>
      </div>

      {/* Compact Horizontal Metric Bar (Clean, Light) */}
      <div className="bg-white border border-[#D0EBF7] rounded-xl p-3 flex flex-wrap items-center justify-between gap-4 text-xs font-mono shadow-xs">
        <div className="flex items-center gap-2 px-3 border-r border-[#E0F2FE] last:border-0">
          <Users className="w-4 h-4 text-[#009bb3]" />
          <span className="text-[#64748B]">Contactos:</span>
          <strong className="text-sm font-bold text-[#0B1F2D] tabular-nums">{leads.length}</strong>
        </div>

        <div className="flex items-center gap-2 px-3 border-r border-[#E0F2FE] last:border-0">
          <Sparkles className="w-4 h-4 text-[#00897B]" />
          <span className="text-[#64748B]">Nuevos Leads:</span>
          <strong className="text-sm font-bold text-[#00897B] tabular-nums">
            {leads.filter(l => l.status === 'nuevo_contacto').length}
          </strong>
        </div>

        <div className="flex items-center gap-2 px-3 border-r border-[#E0F2FE] last:border-0">
          <TrendingUp className="w-4 h-4 text-sky-600" />
          <span className="text-[#64748B]">En Pipeline:</span>
          <strong className="text-sm font-bold text-sky-600 tabular-nums">
            {leads.filter(l => !['ganado', 'perdido'].includes(l.status)).length}
          </strong>
        </div>

        <div className="flex items-center gap-2 px-3 border-r border-[#E0F2FE] last:border-0">
          <CheckSquare className="w-4 h-4 text-amber-600" />
          <span className="text-[#64748B]">Tareas Pendientes:</span>
          <strong className="text-sm font-bold text-amber-600 tabular-nums">
            {tasks.filter(t => t.status !== 'completada').length}
          </strong>
        </div>

        <div className="flex items-center gap-2 px-3 border-r border-[#E0F2FE] last:border-0">
          <Layers className="w-4 h-4 text-indigo-600" />
          <span className="text-[#64748B]">Proyectos Activos:</span>
          <strong className="text-sm font-bold text-indigo-600 tabular-nums">{projects.length}</strong>
        </div>

        <div className="flex items-center gap-2 px-3">
          <ShieldCheck className="w-4 h-4 text-[#00897B]" />
          <span className="text-[#64748B]">Tasa de Cierre:</span>
          <strong className="text-sm font-bold text-[#00897B] tabular-nums">
            {stats?.conversionRate ?? 0}%
          </strong>
        </div>
      </div>

      {/* Filter Tabs for Lists */}
      <div className="flex items-center gap-1.5 p-1 bg-white rounded-lg border border-[#D0EBF7] text-xs font-mono w-fit shadow-2xs">
        {[
          { id: 'all', label: 'Todas las Listas Operativas' },
          { id: 'leads', label: `Lista de Contactos (${leads.length})` },
          { id: 'tasks', label: `Lista de Tareas (${tasks.filter(t => t.status !== 'completada').length})` },
          { id: 'projects', label: `Lista de Proyectos (${projects.length})` },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveListFilter(tab.id as any)}
            className={`px-3 py-1.5 rounded transition-all cursor-pointer ${
              activeListFilter === tab.id
                ? 'bg-[#00D9F5] text-[#0B1F2D] font-bold shadow-xs'
                : 'text-[#1E3A52] hover:text-[#009bb3] hover:bg-[#EAF6FD]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* LIST 1: Recent Leads List */}
      {(activeListFilter === 'all' || activeListFilter === 'leads') && (
        <div className="rounded-xl bg-white border border-[#D0EBF7] overflow-hidden shadow-sm">
          <div className="px-5 py-3 bg-[#F0F9FF] border-b border-[#D0EBF7] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-[#009bb3]" />
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#0B1F2D]">
                Lista de Contactos y Prospectos
              </h3>
              <span className="text-[11px] font-mono text-[#00897B] bg-[#00E3B2]/15 px-2 py-0.2 rounded border border-[#00E3B2]/40 font-bold">
                {leads.length} Registros
              </span>
            </div>

            <button
              onClick={() => onNavigateTab('leads')}
              className="text-xs font-mono text-[#009bb3] hover:underline flex items-center gap-1 cursor-pointer font-bold"
            >
              <span>Ver tabla completa</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-[#E0F2FE]">
            {leads.length === 0 ? (
              <div className="p-6 text-center text-xs font-mono text-[#64748B]">
                No hay contactos registrados en la base de datos.
              </div>
            ) : (
              leads.slice(0, 6).map((lead) => {
                const stageStyle = stageBadgeStyle[lead.status] || 'bg-neutral-100 text-neutral-700 border-neutral-300';

                return (
                  <div
                    key={lead.id}
                    onClick={() => onSelectLead(lead)}
                    className="p-3.5 sm:px-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#EAF6FD] hover:border-l-4 hover:border-l-[#00D9F5] transition-all cursor-pointer group"
                  >
                    {/* Left: Lead details */}
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-full bg-[#EAF6FD] border border-[#BCE4F7] group-hover:border-[#00D9F5] flex items-center justify-center font-mono text-xs font-bold text-[#009bb3] shrink-0">
                        {lead.fullName.charAt(0)}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-sm text-[#0B1F2D] group-hover:text-[#009bb3] transition-colors truncate">
                            {lead.fullName}
                          </span>
                          {lead.company && (
                            <span className="text-xs font-mono text-[#64748B] flex items-center gap-1">
                              <Building className="w-3 h-3 text-[#00897B]" />
                              {lead.company}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-[#1E3A52] truncate max-w-lg mt-0.5">
                          {lead.description}
                        </p>
                      </div>
                    </div>

                    {/* Right: Badges & Action */}
                    <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                      <span className="text-[11px] font-mono text-[#1E3A52] uppercase bg-[#F0F9FF] px-2 py-0.5 rounded border border-[#D0EBF7] hidden md:inline font-medium">
                        {lead.projectType}
                      </span>

                      <span className={`text-[11px] font-mono px-2.5 py-0.5 rounded border capitalize ${stageStyle}`}>
                        {lead.status.replace('_', ' ')}
                      </span>

                      <span className="text-[11px] font-mono text-[#64748B] tabular-nums">
                        {new Date(lead.createdAt).toLocaleDateString('es-ES', {
                          day: '2-digit',
                          month: 'short',
                        })}
                      </span>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectLead(lead);
                        }}
                        className="p-1.5 rounded bg-white hover:bg-[#00D9F5] hover:text-[#0B1F2D] text-[#009bb3] border border-[#BCE4F7] hover:border-[#00D9F5] transition-all shadow-2xs"
                        title="Ver Ficha del Cliente"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* LIST 2: Tasks List */}
      {(activeListFilter === 'all' || activeListFilter === 'tasks') && (
        <div className="rounded-xl bg-white border border-[#D0EBF7] overflow-hidden shadow-sm">
          <div className="px-5 py-3 bg-[#F0F9FF] border-b border-[#D0EBF7] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckSquare className="w-4 h-4 text-amber-600" />
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#0B1F2D]">
                Lista de Tareas y Seguimiento
              </h3>
              <span className="text-[11px] font-mono text-amber-700 bg-amber-50 px-2 py-0.2 rounded border border-amber-200 font-bold">
                {tasks.filter(t => t.status !== 'completada').length} Pendientes
              </span>
            </div>

            <button
              onClick={() => onNavigateTab('tasks')}
              className="text-xs font-mono text-[#009bb3] hover:underline flex items-center gap-1 cursor-pointer font-bold"
            >
              <span>Ver todas las tareas</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-[#E0F2FE]">
            {tasks.length === 0 ? (
              <div className="p-6 text-center text-xs font-mono text-[#64748B]">
                No hay tareas pendientes en este momento.
              </div>
            ) : (
              tasks.slice(0, 5).map((task) => {
                const isOverdue = task.status !== 'completada' && task.dueDate < todayStr;
                const priorityStyle = priorityBadgeStyle[task.priority] || priorityBadgeStyle.media;

                return (
                  <div
                    key={task.id}
                    onClick={() => onNavigateTab('tasks')}
                    className="p-3.5 sm:px-5 flex items-center justify-between gap-4 hover:bg-[#EAF6FD] hover:border-l-4 hover:border-l-amber-400 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                        task.status === 'completada'
                          ? 'bg-[#00897B]'
                          : isOverdue
                          ? 'bg-rose-500 animate-pulse'
                          : 'bg-amber-400'
                      }`} />

                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`text-xs font-bold text-[#0B1F2D] group-hover:text-[#009bb3] transition-colors ${
                            task.status === 'completada' ? 'line-through text-[#64748B]' : ''
                          }`}>
                            {task.title}
                          </span>
                          {task.leadName && (
                            <span className="text-[11px] font-mono text-[#009bb3] truncate font-medium">
                              [{task.leadName}]
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] font-mono text-[#64748B] block">
                          Asignado: {task.assignedTo}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded border uppercase font-medium ${priorityStyle}`}>
                        {task.priority}
                      </span>

                      <span className={`text-[11px] font-mono flex items-center gap-1 tabular-nums ${
                        isOverdue ? 'text-rose-600 font-bold' : 'text-[#64748B]'
                      }`}>
                        <Calendar className="w-3 h-3" />
                        {task.dueDate}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* LIST 3: Projects List */}
      {(activeListFilter === 'all' || activeListFilter === 'projects') && (
        <div className="rounded-xl bg-white border border-[#D0EBF7] overflow-hidden shadow-sm">
          <div className="px-5 py-3 bg-[#F0F9FF] border-b border-[#D0EBF7] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FolderGit2 className="w-4 h-4 text-indigo-600" />
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#0B1F2D]">
                Lista de Proyectos y Sistemas Tecnológicos
              </h3>
              <span className="text-[11px] font-mono text-indigo-700 bg-indigo-50 px-2 py-0.2 rounded border border-indigo-200 font-bold">
                {projects.length} Sistemas
              </span>
            </div>

            <button
              onClick={() => onNavigateTab('projects')}
              className="text-xs font-mono text-[#009bb3] hover:underline flex items-center gap-1 cursor-pointer font-bold"
            >
              <span>Ver todos los proyectos</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-[#E0F2FE]">
            {projects.length === 0 ? (
              <div className="p-6 text-center text-xs font-mono text-[#64748B]">
                No hay proyectos registrados en este momento.
              </div>
            ) : (
              projects.map((proj) => {
                const completedM = proj.milestones.filter(m => m.done).length;
                const totalM = proj.milestones.length;

                return (
                  <div
                    key={proj.id}
                    onClick={() => onNavigateTab('projects')}
                    className="p-3.5 sm:px-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#EAF6FD] hover:border-l-4 hover:border-l-indigo-400 transition-all cursor-pointer group"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-indigo-600 font-semibold">
                          {proj.category}
                        </span>
                        <span className="text-xs text-[#94A3B8]">·</span>
                        <span className="text-xs font-mono text-[#00897B] font-medium">
                          Cliente: {proj.company || proj.clientName}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-[#0B1F2D] group-hover:text-[#009bb3] transition-colors mt-0.5 truncate">
                        {proj.name}
                      </h4>
                    </div>

                    <div className="flex items-center gap-4 shrink-0">
                      {totalM > 0 && (
                        <div className="w-28 hidden sm:block">
                          <div className="flex justify-between text-[10px] font-mono text-[#64748B] mb-1">
                            <span>Hitos</span>
                            <span className="text-[#009bb3] font-bold tabular-nums">{completedM}/{totalM}</span>
                          </div>
                          <div className="w-full bg-[#E0F2FE] h-1.5 rounded-full overflow-hidden border border-[#BCE4F7]">
                            <div
                              className="bg-gradient-to-r from-[#00D9F5] to-[#00E3B2] h-full rounded-full"
                              style={{ width: `${(completedM / totalM) * 100}%` }}
                            />
                          </div>
                        </div>
                      )}

                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded border capitalize font-medium ${
                        proj.status === 'entregado'
                          ? 'bg-[#00E3B2]/15 text-[#00897B] border-[#00E3B2]/40'
                          : 'bg-indigo-50 text-indigo-600 border-indigo-200'
                      }`}>
                        {proj.status.replace('_', ' ')}
                      </span>

                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded border font-medium ${
                        proj.visibleOnLanding
                          ? 'bg-[#00E3B2]/15 text-[#00897B] border-[#00E3B2]/40'
                          : 'bg-neutral-100 text-neutral-500 border-neutral-200'
                      }`}>
                        {proj.visibleOnLanding ? 'Público' : 'Oculto'}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* LIST 4: Recent System Activity Feed (Dense List) */}
      <div className="rounded-xl bg-white border border-[#D0EBF7] overflow-hidden shadow-sm">
        <div className="px-5 py-3 bg-[#F0F9FF] border-b border-[#D0EBF7] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-[#009bb3]" />
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#0B1F2D]">
              Lista de Actividad y Auditoría Reciente
            </h3>
          </div>
          <span className="text-[10px] font-mono text-[#00897B] bg-[#00E3B2]/15 px-2 py-0.5 rounded border border-[#00E3B2]/40 font-bold">
            En Vivo
          </span>
        </div>

        <div className="divide-y divide-[#E0F2FE] max-h-56 overflow-y-auto">
          {(!stats?.recentActivity || stats.recentActivity.length === 0) ? (
            <div className="p-4 text-center text-xs font-mono text-[#64748B]">
              Sin eventos recientes registrados.
            </div>
          ) : (
            stats.recentActivity.slice(0, 6).map((act) => (
              <div
                key={act.id}
                className="px-5 py-2.5 flex items-center justify-between gap-4 text-xs hover:bg-[#EAF6FD] transition-colors"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00D9F5] shrink-0" />
                  <span className="font-semibold text-[#009bb3] font-mono shrink-0">
                    {act.author}:
                  </span>
                  <span className="text-[#1E3A52] truncate">
                    {act.description}
                  </span>
                </div>
                <span className="text-[10px] font-mono text-[#64748B] shrink-0 tabular-nums">
                  {new Date(act.timestamp).toLocaleTimeString('es-ES', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
};
