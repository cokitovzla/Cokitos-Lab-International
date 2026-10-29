import React from 'react';
import { Lead, PipelineStage } from '../../types/index.ts';
import { api } from '../../lib/api.ts';
import { 
  Building, 
  MessageSquare, 
  Calendar, 
  MoreHorizontal, 
  ChevronRight, 
  ChevronLeft,
  ArrowRight
} from 'lucide-react';

interface PipelineKanbanViewProps {
  leads: Lead[];
  onSelectLead: (lead: Lead) => void;
  onLeadUpdated: (lead: Lead) => void;
}

export const PipelineKanbanView: React.FC<PipelineKanbanViewProps> = ({
  leads,
  onSelectLead,
  onLeadUpdated,
}) => {
  const columns: { stage: PipelineStage; label: string; accent: string; bg: string }[] = [
    { stage: 'nuevo_contacto', label: '1. Nuevo Contacto', accent: 'text-[#00D9F5]', bg: 'bg-[#00D9F5]/10 border-[#00D9F5]/30' },
    { stage: 'en_evaluacion', label: '2. En Evaluación', accent: 'text-sky-400', bg: 'bg-sky-400/10 border-sky-400/30' },
    { stage: 'contactado', label: '3. Contactado', accent: 'text-indigo-400', bg: 'bg-indigo-400/10 border-indigo-400/30' },
    { stage: 'reunion_programada', label: '4. Reunión Programada', accent: 'text-violet-400', bg: 'bg-violet-400/10 border-violet-400/30' },
    { stage: 'propuesta_enviada', label: '5. Propuesta Enviada', accent: 'text-amber-400', bg: 'bg-amber-400/10 border-amber-400/30' },
    { stage: 'negociacion', label: '6. Negociación', accent: 'text-orange-400', bg: 'bg-orange-400/10 border-orange-400/30' },
    { stage: 'ganado', label: '7. Ganado', accent: 'text-[#00E3B2]', bg: 'bg-[#00E3B2]/10 border-[#00E3B2]/30' },
    { stage: 'perdido', label: '8. Perdido', accent: 'text-rose-400', bg: 'bg-rose-400/10 border-rose-400/30' },
  ];

  const stageKeys: PipelineStage[] = [
    'nuevo_contacto',
    'en_evaluacion',
    'contactado',
    'reunion_programada',
    'propuesta_enviada',
    'negociacion',
    'ganado',
    'perdido',
  ];

  const handleMoveStage = async (lead: Lead, direction: 'forward' | 'backward', e: React.MouseEvent) => {
    e.stopPropagation();
    const currentIndex = stageKeys.indexOf(lead.status);
    const newIndex = direction === 'forward' ? currentIndex + 1 : currentIndex - 1;

    if (newIndex >= 0 && newIndex < stageKeys.length) {
      const nextStage = stageKeys[newIndex];
      try {
        const res = await api.updateLead(lead.id, { status: nextStage });
        onLeadUpdated(res.lead);
      } catch (err) {
        console.error('Error updating stage:', err);
      }
    }
  };

  const getDaysAgo = (dateStr: string) => {
    try {
      const diffMs = Date.now() - new Date(dateStr).getTime();
      const diffDays = Math.floor(diffMs / 86400000);
      if (diffDays === 0) return 'Hoy';
      if (diffDays === 1) return 'Ayer';
      return `hace ${diffDays}d`;
    } catch {
      return '';
    }
  };

  return (
    <div className="space-y-4">
      {/* Kanban Header & Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <h2 className="text-xl font-bold text-[#F5FBFF] tracking-tight">
            Pipeline Comercial
          </h2>
          <p className="text-xs font-mono text-[#F5FBFF]/60">
            8 Etapas operativas · Desplaza horizontalmente para ver todas las etapas
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-[#F5FBFF]/60">
          <span>Total Oportunidades: <strong className="text-[#00D9F5] tabular-nums">{leads.length}</strong></span>
        </div>
      </div>

      {/* Horizontal Scrollable Kanban Board */}
      <div className="flex gap-4 overflow-x-auto pb-6 pt-1 select-none min-h-[600px] scrollbar-thin">
        {columns.map((col, colIdx) => {
          const stageLeads = leads.filter(l => l.status === col.stage);

          return (
            <div
              key={col.stage}
              className="w-72 shrink-0 flex flex-col rounded-xl bg-[#081722]/80 border border-[#16364d] overflow-hidden"
            >
              {/* Column Header */}
              <div className="p-3 bg-[#0B1F2D] border-b border-[#143247] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-mono font-bold ${col.accent}`}>
                    {col.label}
                  </span>
                </div>
                <span className={`font-mono text-xs px-2 py-0.5 rounded-full border tabular-nums ${col.bg}`}>
                  {stageLeads.length}
                </span>
              </div>

              {/* Cards Container */}
              <div className="p-2.5 flex-1 space-y-2.5 overflow-y-auto max-h-[70vh]">
                {stageLeads.length === 0 ? (
                  <div className="h-28 border border-dashed border-[#16364d]/60 rounded-lg flex items-center justify-center text-[11px] font-mono text-[#F5FBFF]/30 text-center p-3">
                    Sin prospectos en esta etapa
                  </div>
                ) : (
                  stageLeads.map((lead) => (
                    <div
                      key={lead.id}
                      onClick={() => onSelectLead(lead)}
                      className="p-3.5 rounded-lg bg-[#0B1F2D] border border-[#16364d] hover:border-[#00D9F5]/40 transition-all cursor-pointer shadow-sm group hover:shadow-md hover:shadow-[#00D9F5]/5"
                    >
                      {/* Card Top: Type & Age */}
                      <div className="flex items-center justify-between text-[10px] font-mono text-[#F5FBFF]/50 mb-2">
                        <span className="text-[#00D9F5] uppercase tracking-wider">
                          {lead.projectType}
                        </span>
                        <span>{getDaysAgo(lead.createdAt)}</span>
                      </div>

                      {/* Name & Company */}
                      <h4 className="text-sm font-bold text-[#F5FBFF] group-hover:text-[#00D9F5] transition-colors leading-snug mb-1">
                        {lead.fullName}
                      </h4>

                      {lead.company && (
                        <div className="flex items-center gap-1.5 text-xs text-[#F5FBFF]/60 mb-2 font-mono truncate">
                          <Building className="w-3 h-3 text-[#00E3B2] shrink-0" />
                          <span className="truncate">{lead.company}</span>
                        </div>
                      )}

                      {/* Brief description snippet */}
                      <p className="text-xs text-[#F5FBFF]/70 line-clamp-2 leading-relaxed mb-3">
                        {lead.description}
                      </p>

                      {/* Card Footer: Notes counter + Stage shift quick buttons */}
                      <div className="pt-2 border-t border-[#143247] flex items-center justify-between text-[11px] font-mono text-[#F5FBFF]/60">
                        <div className="flex items-center gap-2">
                          <span className="flex items-center gap-1">
                            <MessageSquare className="w-3 h-3 text-[#00D9F5]" />
                            <span>{lead.notes.length}</span>
                          </span>
                        </div>

                        {/* Move stage controls */}
                        <div className="flex items-center gap-1">
                          {colIdx > 0 && (
                            <button
                              onClick={(e) => handleMoveStage(lead, 'backward', e)}
                              className="p-1 hover:bg-[#143247] rounded text-[#F5FBFF]/60 hover:text-[#F5FBFF] transition-colors"
                              title="Mover a etapa anterior"
                            >
                              <ChevronLeft className="w-3.5 h-3.5" />
                            </button>
                          )}
                          {colIdx < stageKeys.length - 1 && (
                            <button
                              onClick={(e) => handleMoveStage(lead, 'forward', e)}
                              className="p-1 hover:bg-[#143247] rounded text-[#00D9F5] hover:text-[#00E3B2] transition-colors"
                              title="Avanzar etapa"
                            >
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
};
