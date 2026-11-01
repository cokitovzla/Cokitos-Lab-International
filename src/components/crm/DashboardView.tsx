import React, { useState } from 'react';
import { DashboardStats, Lead, Project, Task, PipelineStage } from '../../types/index.ts';
import { api } from '../../lib/api.ts';
import { 
  Users, 
  Sparkles, 
  TrendingUp, 
  Layers, 
  CheckSquare, 
  Clock, 
  ArrowRight, 
  Plus, 
  Download,
  ShieldCheck, 
  Building, 
  CheckCircle2, 
  Calendar, 
  Columns3,
  ListTodo,
  ExternalLink,
  ChevronRight,
  Flame,
  LayoutDashboard
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
  const activeLeads = leads.filter(l => !l.isArchived && !['ganado', 'perdido'].includes(l.status));
  const newLeads = leads.filter(l => !l.isArchived && l.status === 'nuevo_contacto');
  const pendingTasks = tasks.filter(t => t.status !== 'completada');

  const handleExportCsv = () => {
    window.location.href = api.getExportCsvUrl();
  };

  // Funnel stages breakdown
  const stagesOrder: { stage: PipelineStage; label: string; color: string }[] = [
    { stage: 'nuevo_contacto', label: '1. Nuevo Contacto', color: '#00D9F5' },
    { stage: 'en_evaluacion', label: '2. En Evaluación', color: '#38BDF8' },
    { stage: 'contactado', label: '3. Contactado', color: '#6366F1' },
    { stage: 'reunion_programada', label: '4. Reunión', color: '#8B5CF6' },
    { stage: 'propuesta_enviada', label: '5. Propuesta', color: '#F59E0B' },
    { stage: 'negociacion', label: '6. Negociación', color: '#F97316' },
    { stage: 'ganado', label: '7. Ganado (Cerrado)', color: '#00E3B2' },
  ];

  return (
    <div className="space-y-6">
      
      {/* 1. UNIFIED VIEW HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#D0EBF7]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00D9F5] to-[#00897B] flex items-center justify-center text-[#0B1F2D] shadow-sm shrink-0">
            <LayoutDashboard className="w-5 h-5 font-bold" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#0B1F2D] tracking-tight">
              Panel Ejecutivo de Control
            </h1>
            <p className="text-xs font-mono text-[#64748B]">
              Visión centralizada de captación, avance comercial y entregas técnicas de Cokito's Lab
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportCsv}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-[#EAF6FD] border border-[#BCE4F7] hover:border-[#00D9F5] text-xs font-mono text-[#009bb3] font-bold transition-all cursor-pointer shadow-2xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Descargar CSV</span>
          </button>

          <button
            onClick={onOpenNewContactModal}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#00D9F5] hover:bg-[#00E3B2] text-[#0B1F2D] font-bold text-xs font-mono transition-all cursor-pointer shadow-xs shadow-[#00D9F5]/25 hover:shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>Nuevo Contacto</span>
          </button>
        </div>
      </div>

      {/* 2. EXECUTIVE COMMAND KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Nuevos Leads */}
        <div 
          onClick={() => onNavigateTab('kanban')}
          className="p-5 rounded-2xl bg-white border border-[#D0EBF7] hover:border-[#00D9F5] transition-all shadow-xs hover:shadow-md cursor-pointer flex flex-col justify-between group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono font-bold text-[#64748B] uppercase tracking-wider">
              Nuevas Solicitudes
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#00D9F5]/15 text-[#009bb3] flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-[#0B1F2D] tabular-nums">
              {newLeads.length}
            </span>
            {newLeads.length > 0 ? (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded font-extrabold bg-[#00E3B2]/20 text-[#00897B] border border-[#00E3B2]/40">
                ● Requieren atención
              </span>
            ) : (
              <span className="text-[10px] font-mono text-[#64748B]">Al día</span>
            )}
          </div>
          <p className="text-[11px] text-[#64748B] mt-2 flex items-center gap-1 group-hover:text-[#009bb3] transition-colors">
            <span>Ver solicitudes en Pipeline</span>
            <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </p>
        </div>

        {/* Card 2: En Pipeline Activo */}
        <div 
          onClick={() => onNavigateTab('kanban')}
          className="p-5 rounded-2xl bg-white border border-[#D0EBF7] hover:border-[#38BDF8] transition-all shadow-xs hover:shadow-md cursor-pointer flex flex-col justify-between group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono font-bold text-[#64748B] uppercase tracking-wider">
              En Pipeline Activo
            </span>
            <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-[#0B1F2D] tabular-nums">
              {activeLeads.length}
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded font-bold bg-sky-50 text-sky-700 border border-sky-200">
              {stats?.conversionRate ?? 0}% Cierre
            </span>
          </div>
          <p className="text-[11px] text-[#64748B] mt-2 flex items-center gap-1 group-hover:text-sky-600 transition-colors">
            <span>Gestión comercial en curso</span>
            <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </p>
        </div>

        {/* Card 3: Tareas Pendientes */}
        <div 
          onClick={() => onNavigateTab('tasks')}
          className="p-5 rounded-2xl bg-white border border-[#D0EBF7] hover:border-amber-400 transition-all shadow-xs hover:shadow-md cursor-pointer flex flex-col justify-between group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono font-bold text-[#64748B] uppercase tracking-wider">
              Tareas del Equipo
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <CheckSquare className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-[#0B1F2D] tabular-nums">
              {pendingTasks.length}
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded font-bold bg-amber-50 text-amber-700 border border-amber-200">
              Pendientes
            </span>
          </div>
          <p className="text-[11px] text-[#64748B] mt-2 flex items-center gap-1 group-hover:text-amber-600 transition-colors">
            <span>Asignadas y por vencer</span>
            <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </p>
        </div>

        {/* Card 4: Proyectos & Sistemas */}
        <div 
          onClick={() => onNavigateTab('projects')}
          className="p-5 rounded-2xl bg-white border border-[#D0EBF7] hover:border-[#8B5CF6] transition-all shadow-xs hover:shadow-md cursor-pointer flex flex-col justify-between group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono font-bold text-[#64748B] uppercase tracking-wider">
              Sistemas Activos
            </span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-[#8B5CF6] flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-[#0B1F2D] tabular-nums">
              {projects.length}
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded font-bold bg-purple-50 text-[#8B5CF6] border border-purple-200">
              En Producción
            </span>
          </div>
          <p className="text-[11px] text-[#64748B] mt-2 flex items-center gap-1 group-hover:text-[#8B5CF6] transition-colors">
            <span>LegalTech, EdTech, Sports, FinTech</span>
            <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </p>
        </div>

      </div>

      {/* 3. VISUAL SCREEN OVERVIEW: 2-COLUMN COMMAND SPLIT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column (7 cols): Embudo Visual de Avance Comercial */}
        <div className="lg:col-span-7 rounded-2xl bg-white border border-[#D0EBF7] p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-[#EAF6FD]">
            <div className="flex items-center gap-2">
              <Columns3 className="w-4 h-4 text-[#009bb3]" />
              <h2 className="text-sm font-extrabold text-[#0B1F2D] tracking-tight">
                Embudo Comercial de Oportunidades
              </h2>
            </div>
            <button
              onClick={() => onNavigateTab('kanban')}
              className="text-xs font-mono text-[#009bb3] hover:text-[#00897B] font-bold flex items-center gap-1 cursor-pointer"
            >
              <span>Abrir Tablero Kanban Drag & Drop</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Visual Funnel Bars */}
          <div className="space-y-3 font-mono text-xs">
            {stagesOrder.map((st) => {
              const count = leads.filter(l => !l.isArchived && l.status === st.stage).length;
              const maxLeads = Math.max(leads.length, 1);
              const pct = Math.round((count / maxLeads) * 100);

              return (
                <div 
                  key={st.stage}
                  onClick={() => onNavigateTab('kanban')}
                  className="p-2.5 rounded-xl hover:bg-[#F8FCFE] transition-colors cursor-pointer border border-transparent hover:border-[#D0EBF7] group"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold text-[#0B1F2D] group-hover:text-[#009bb3] transition-colors">
                      {st.label}
                    </span>
                    <span className="text-xs font-extrabold text-[#0B1F2D] tabular-nums">
                      {count} {count === 1 ? 'prospecto' : 'prospectos'}
                    </span>
                  </div>
                  <div className="w-full bg-[#EAF6FD] h-2.5 rounded-full overflow-hidden border border-[#D0EBF7]/60">
                    <div 
                      className="h-full rounded-full transition-all duration-500"
                      style={{ 
                        width: `${Math.max(pct, count > 0 ? 8 : 0)}%`,
                        backgroundColor: st.color
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Solicitudes Más Recientes (Cards breves con clic directo) */}
          <div className="pt-4 border-t border-[#EAF6FD] space-y-3">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#64748B] block">
              Últimas Solicitudes Registradas (Haz clic para abrir expediente):
            </span>

            <div className="space-y-2">
              {leads.filter(l => !l.isArchived).slice(0, 3).map((lead) => (
                <div
                  key={lead.id}
                  onClick={() => onSelectLead(lead)}
                  className="p-3 rounded-xl bg-[#F8FCFE] hover:bg-white border border-[#D0EBF7] hover:border-[#00D9F5] transition-all cursor-pointer flex items-center justify-between gap-3 shadow-2xs hover:shadow-xs group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-white border border-[#BCE4F7] text-[#009bb3] font-bold text-xs flex items-center justify-center shrink-0">
                      {lead.fullName.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#0B1F2D] group-hover:text-[#009bb3] transition-colors truncate">
                          {lead.fullName}
                        </span>
                        {lead.company && (
                          <span className="text-[10px] font-mono text-[#64748B] truncate">
                            · {lead.company}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-[#64748B] truncate">
                        {lead.description}
                      </p>
                    </div>
                  </div>

                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white border border-[#BCE4F7] text-[#0B1F2D] font-bold shrink-0">
                    {lead.status.replace('_', ' ')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (5 cols): Tareas Pendientes & Sedes de Cokito's Lab */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Tareas Inmediatas del Laboratorio */}
          <div className="rounded-2xl bg-white border border-[#D0EBF7] p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#EAF6FD]">
              <div className="flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-amber-600" />
                <h2 className="text-sm font-extrabold text-[#0B1F2D] tracking-tight">
                  Tareas Inmediatas del Equipo
                </h2>
              </div>
              <button
                onClick={() => onNavigateTab('tasks')}
                className="text-xs font-mono text-[#009bb3] hover:text-[#00897B] font-bold flex items-center gap-1 cursor-pointer"
              >
                <span>Ver todas</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {pendingTasks.length === 0 ? (
              <div className="py-8 text-center text-xs font-mono text-[#64748B]">
                <CheckCircle2 className="w-8 h-8 text-[#00E3B2] mx-auto mb-2 opacity-80" />
                <p>No hay tareas pendientes en este momento.</p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {pendingTasks.slice(0, 4).map((task) => (
                  <div
                    key={task.id}
                    onClick={() => onNavigateTab('tasks')}
                    className="p-3 rounded-xl bg-[#F8FCFE] hover:bg-white border border-[#D0EBF7] hover:border-amber-400 transition-all cursor-pointer space-y-1.5 shadow-2xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#0B1F2D]">
                        {task.title}
                      </span>
                      <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-bold uppercase ${
                        task.priority === 'urgente' ? 'bg-red-100 text-red-700' :
                        task.priority === 'alta' ? 'bg-amber-100 text-amber-700' : 'bg-sky-100 text-sky-700'
                      }`}>
                        {task.priority}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] font-mono text-[#64748B]">
                      <span>{task.leadName || task.projectName || 'Laboratorio'}</span>
                      <span className="text-[#00897B] font-semibold">Responsable: {task.assignedTo}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sedes & Hubs Status Box */}
          <div className="rounded-2xl bg-gradient-to-br from-[#F8FCFE] to-[#EAF6FD] border border-[#BCE4F7] p-5 shadow-xs space-y-3">
            <span className="text-[10px] font-mono uppercase font-bold tracking-wider text-[#00897B] block">
              Coordinación de Hubs Cokito's Lab
            </span>
            
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2 rounded-lg bg-white border border-[#D0EBF7]">
                <div className="flex items-center gap-2">
                  <span>🇻🇪</span>
                  <span className="font-bold text-[#0B1F2D]">Hub Venezuela</span>
                </div>
                <span className="text-[#00897B] font-mono text-[11px] font-semibold">Ana Teresa Sandoval</span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-white border border-[#D0EBF7]">
                <div className="flex items-center gap-2">
                  <span>🇫🇷</span>
                  <span className="font-bold text-[#0B1F2D]">Hub Francia</span>
                </div>
                <span className="text-[#0055A4] font-mono text-[11px] font-semibold">Morice Mojica</span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-white border border-[#D0EBF7]">
                <div className="flex items-center gap-2">
                  <span>🇺🇸</span>
                  <span className="font-bold text-[#0B1F2D]">Hub USA</span>
                </div>
                <span className="text-[#0A3161] font-mono text-[11px] font-semibold">Antonio Fuentes</span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
