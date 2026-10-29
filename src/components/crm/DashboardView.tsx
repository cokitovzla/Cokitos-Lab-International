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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1 border-b border-[#143247]">
        <div>
          <h1 className="text-xl font-bold text-[#F5FBFF] tracking-tight flex items-center gap-2">
            <List className="w-5 h-5 text-[#00D9F5]" />
            <span>Cokito's Lab Control Center — Vista en Lista</span>
          </h1>
          <p className="text-xs font-mono text-[#F5FBFF]/60 mt-0.5">
            Gestión operacional unificada en formato de listas de alta densidad
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportCsv}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#0d2232] hover:bg-[#133249] border border-[#1b3d56] hover:border-[#00D9F5] text-xs font-mono text-[#00D9F5] transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Exportar CSV</span>
          </button>

          <button
            onClick={onOpenNewContactModal}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-md bg-[#00D9F5] hover:bg-[#00E3B2] text-[#0B1F2D] font-bold text-xs font-mono transition-colors cursor-pointer shadow-sm shadow-[#00D9F5]/20 hover:shadow-[0_0_15px_rgba(0,217,245,0.4)]"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Nuevo Lead</span>
          </button>
        </div>
      </div>

      {/* Compact Horizontal Metric Bar (Single Line Bar instead of large square boxes) */}
      <div className="bg-[#0d2232] border border-[#1b3d56] rounded-xl p-3 flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
        <div className="flex items-center gap-2 px-3 border-r border-[#16364d] last:border-0">
          <Users className="w-4 h-4 text-[#00D9F5]" />
          <span className="text-[#F5FBFF]/70">Contactos:</span>
          <strong className="text-sm font-bold text-[#F5FBFF] tabular-nums">{leads.length}</strong>
        </div>

        <div className="flex items-center gap-2 px-3 border-r border-[#16364d] last:border-0">
          <Sparkles className="w-4 h-4 text-[#00E3B2]" />
          <span className="text-[#F5FBFF]/70">Nuevos Leads:</span>
          <strong className="text-sm font-bold text-[#00E3B2] tabular-nums">
            {leads.filter(l => l.status === 'nuevo_contacto').length}
          </strong>
        </div>

        <div className="flex items-center gap-2 px-3 border-r border-[#16364d] last:border-0">
          <TrendingUp className="w-4 h-4 text-sky-400" />
          <span className="text-[#F5FBFF]/70">En Pipeline:</span>
          <strong className="text-sm font-bold text-sky-400 tabular-nums">
            {leads.filter(l => !['ganado', 'perdido'].includes(l.status)).length}
          </strong>
        </div>

        <div className="flex items-center gap-2 px-3 border-r border-[#16364d] last:border-0">
          <CheckSquare className="w-4 h-4 text-amber-400" />
          <span className="text-[#F5FBFF]/70">Tareas Pendientes:</span>
          <strong className="text-sm font-bold text-amber-400 tabular-nums">
            {tasks.filter(t => t.status !== 'completada').length}
          </strong>
        </div>

        <div className="flex items-center gap-2 px-3 border-r border-[#16364d] last:border-0">
          <Layers className="w-4 h-4 text-indigo-400" />
          <span className="text-[#F5FBFF]/70">Proyectos Activos:</span>
          <strong className="text-sm font-bold text-indigo-400 tabular-nums">{projects.length}</strong>
        </div>

        <div className="flex items-center gap-2 px-3">
          <ShieldCheck className="w-4 h-4 text-[#00E3B2]" />
          <span className="text-[#F5FBFF]/70">Tasa de Cierre:</span>
          <strong className="text-sm font-bold text-[#00E3B2] tabular-nums">
            {stats?.conversionRate ?? 0}%
          </strong>
        </div>
      </div>

      {/* Filter Tabs for Lists */}
      <div className="flex items-center gap-1.5 p-1 bg-[#081722] rounded-lg border border-[#16364d] text-xs font-mono w-fit">
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
                ? 'bg-[#00D9F5] text-[#0B1F2D] font-bold shadow-sm'
                : 'text-[#F5FBFF]/70 hover:text-[#00D9F5] hover:bg-[#122e43]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* LIST 1: Recent Leads List */}
      {(activeListFilter === 'all' || activeListFilter === 'leads') && (
        <div className="rounded-xl bg-[#0d2232] border border-[#1b3d56] overflow-hidden shadow-lg">
          <div className="px-5 py-3 bg-[#0a1b28] border-b border-[#143247] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-[#00D9F5]" />
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#F5FBFF]">
                Lista de Contactos y Prospectos
              </h3>
              <span className="text-[11px] font-mono text-[#00D9F5] bg-[#00D9F5]/10 px-2 py-0.2 rounded border border-[#00D9F5]/30">
                {leads.length} Registros
              </span>
            </div>

            <button
              onClick={() => onNavigateTab('leads')}
              className="text-xs font-mono text-[#00D9F5] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Ver tabla completa</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-[#143247]">
            {leads.length === 0 ? (
              <div className="p-6 text-center text-xs font-mono text-[#F5FBFF]/40">
                No hay contactos registrados en la base de datos.
              </div>
            ) : (
              leads.slice(0, 6).map((lead) => {
                const stageStyle = stageBadgeStyle[lead.status] || 'bg-neutral-800 text-neutral-300 border-neutral-700';

                return (
                  <div
                    key={lead.id}
                    onClick={() => onSelectLead(lead)}
                    className="p-3.5 sm:px-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#123047] hover:border-l-4 hover:border-l-[#00D9F5] transition-all cursor-pointer group"
                  >
                    {/* Left: Lead details */}
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-full bg-[#081722] border border-[#1b3d56] group-hover:border-[#00D9F5] flex items-center justify-center font-mono text-xs font-bold text-[#00D9F5] shrink-0">
                        {lead.fullName.charAt(0)}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-sm text-[#F5FBFF] group-hover:text-[#00D9F5] transition-colors truncate">
                            {lead.fullName}
                          </span>
                          {lead.company && (
                            <span className="text-xs font-mono text-[#F5FBFF]/60 flex items-center gap-1">
                              <Building className="w-3 h-3 text-[#00E3B2]" />
                              {lead.company}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-[#F5FBFF]/75 truncate max-w-lg mt-0.5">
                          {lead.description}
                        </p>
                      </div>
                    </div>

                    {/* Right: Badges & Action */}
                    <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                      <span className="text-[11px] font-mono text-[#F5FBFF]/60 uppercase bg-[#081722] px-2 py-0.5 rounded border border-[#1b3d56] hidden md:inline">
                        {lead.projectType}
                      </span>

                      <span className={`text-[11px] font-mono px-2.5 py-0.5 rounded border capitalize ${stageStyle}`}>
                        {lead.status.replace('_', ' ')}
                      </span>

                      <span className="text-[11px] font-mono text-[#F5FBFF]/50 tabular-nums">
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
                        className="p-1.5 rounded bg-[#081722] hover:bg-[#00D9F5] hover:text-[#0B1F2D] text-[#00D9F5] border border-[#1b3d56] hover:border-[#00D9F5] transition-all"
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
        <div className="rounded-xl bg-[#0d2232] border border-[#1b3d56] overflow-hidden shadow-lg">
          <div className="px-5 py-3 bg-[#0a1b28] border-b border-[#143247] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckSquare className="w-4 h-4 text-amber-400" />
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#F5FBFF]">
                Lista de Tareas y Seguimiento
              </h3>
              <span className="text-[11px] font-mono text-amber-400 bg-amber-400/10 px-2 py-0.2 rounded border border-amber-400/30">
                {tasks.filter(t => t.status !== 'completada').length} Pendientes
              </span>
            </div>

            <button
              onClick={() => onNavigateTab('tasks')}
              className="text-xs font-mono text-[#00D9F5] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Ver todas las tareas</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-[#143247]">
            {tasks.length === 0 ? (
              <div className="p-6 text-center text-xs font-mono text-[#F5FBFF]/40">
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
                    className="p-3.5 sm:px-5 flex items-center justify-between gap-4 hover:bg-[#123047] hover:border-l-4 hover:border-l-amber-400 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                        task.status === 'completada'
                          ? 'bg-[#00E3B2]'
                          : isOverdue
                          ? 'bg-rose-500 animate-pulse'
                          : 'bg-amber-400'
                      }`} />

                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`text-xs font-bold text-[#F5FBFF] group-hover:text-[#00D9F5] transition-colors ${
                            task.status === 'completada' ? 'line-through text-[#F5FBFF]/50' : ''
                          }`}>
                            {task.title}
                          </span>
                          {task.leadName && (
                            <span className="text-[11px] font-mono text-[#00D9F5] truncate">
                              [{task.leadName}]
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] font-mono text-[#F5FBFF]/50 block">
                          Asignado: {task.assignedTo}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded border uppercase ${priorityStyle}`}>
                        {task.priority}
                      </span>

                      <span className={`text-[11px] font-mono flex items-center gap-1 tabular-nums ${
                        isOverdue ? 'text-rose-400 font-bold' : 'text-[#F5FBFF]/60'
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
        <div className="rounded-xl bg-[#0d2232] border border-[#1b3d56] overflow-hidden shadow-lg">
          <div className="px-5 py-3 bg-[#0a1b28] border-b border-[#143247] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FolderGit2 className="w-4 h-4 text-indigo-400" />
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#F5FBFF]">
                Lista de Proyectos de Ingeniería
              </h3>
              <span className="text-[11px] font-mono text-indigo-400 bg-indigo-400/10 px-2 py-0.2 rounded border border-indigo-400/30">
                {projects.length} Sistemas
              </span>
            </div>

            <button
              onClick={() => onNavigateTab('projects')}
              className="text-xs font-mono text-[#00D9F5] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Ver todos los proyectos</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-[#143247]">
            {projects.length === 0 ? (
              <div className="p-6 text-center text-xs font-mono text-[#F5FBFF]/40">
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
                    className="p-3.5 sm:px-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#123047] hover:border-l-4 hover:border-l-indigo-400 transition-all cursor-pointer group"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-indigo-400 font-semibold">
                          {proj.category}
                        </span>
                        <span className="text-xs text-[#F5FBFF]/40">·</span>
                        <span className="text-xs font-mono text-[#00E3B2]">
                          Cliente: {proj.company || proj.clientName}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-[#F5FBFF] group-hover:text-[#00D9F5] transition-colors mt-0.5 truncate">
                        {proj.name}
                      </h4>
                    </div>

                    <div className="flex items-center gap-4 shrink-0">
                      {totalM > 0 && (
                        <div className="w-28 hidden sm:block">
                          <div className="flex justify-between text-[10px] font-mono text-[#F5FBFF]/60 mb-1">
                            <span>Hitos</span>
                            <span className="text-[#00D9F5] font-bold tabular-nums">{completedM}/{totalM}</span>
                          </div>
                          <div className="w-full bg-[#081722] h-1.5 rounded-full overflow-hidden border border-[#1b3d56]">
                            <div
                              className="bg-gradient-to-r from-[#00D9F5] to-[#00E3B2] h-full rounded-full"
                              style={{ width: `${(completedM / totalM) * 100}%` }}
                            />
                          </div>
                        </div>
                      )}

                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded border capitalize ${
                        proj.status === 'entregado'
                          ? 'bg-[#00E3B2]/10 text-[#00E3B2] border-[#00E3B2]/30'
                          : 'bg-indigo-400/10 text-indigo-400 border-indigo-400/30'
                      }`}>
                        {proj.status.replace('_', ' ')}
                      </span>

                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                        proj.visibleOnLanding
                          ? 'bg-[#00E3B2]/10 text-[#00E3B2] border-[#00E3B2]/30'
                          : 'bg-[#143247] text-[#F5FBFF]/40 border-transparent'
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
      <div className="rounded-xl bg-[#0d2232] border border-[#1b3d56] overflow-hidden shadow-lg">
        <div className="px-5 py-3 bg-[#0a1b28] border-b border-[#143247] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-[#00D9F5]" />
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#F5FBFF]">
              Lista de Actividad y Auditoría Reciente
            </h3>
          </div>
          <span className="text-[10px] font-mono text-[#00E3B2] bg-[#00E3B2]/10 px-2 py-0.5 rounded border border-[#00E3B2]/30">
            En Vivo
          </span>
        </div>

        <div className="divide-y divide-[#143247] max-h-56 overflow-y-auto">
          {(!stats?.recentActivity || stats.recentActivity.length === 0) ? (
            <div className="p-4 text-center text-xs font-mono text-[#F5FBFF]/40">
              Sin eventos recientes registrados.
            </div>
          ) : (
            stats.recentActivity.slice(0, 6).map((act) => (
              <div
                key={act.id}
                className="px-5 py-2.5 flex items-center justify-between gap-4 text-xs hover:bg-[#123047] transition-colors"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00D9F5] shrink-0" />
                  <span className="font-semibold text-[#00D9F5] font-mono shrink-0">
                    {act.author}:
                  </span>
                  <span className="text-[#F5FBFF]/90 truncate">
                    {act.description}
                  </span>
                </div>
                <span className="text-[10px] font-mono text-[#F5FBFF]/40 shrink-0 tabular-nums">
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
