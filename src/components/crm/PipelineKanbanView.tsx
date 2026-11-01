import React, { useState } from 'react';
import { Lead, PipelineStage } from '../../types/index.ts';
import { api } from '../../lib/api.ts';
import { 
  Building, 
  MessageSquare, 
  Calendar, 
  ChevronRight, 
  ChevronLeft,
  Columns3,
  Sparkles,
  Archive,
  ArchiveRestore,
  Plus,
  GripVertical,
  CheckCircle2
} from 'lucide-react';

interface PipelineKanbanViewProps {
  leads: Lead[];
  onSelectLead: (lead: Lead) => void;
  onLeadUpdated: (lead: Lead) => void;
  onOpenNewContactModal?: () => void;
}

export const PipelineKanbanView: React.FC<PipelineKanbanViewProps> = ({
  leads,
  onSelectLead,
  onLeadUpdated,
  onOpenNewContactModal,
}) => {
  const [showArchived, setShowArchived] = useState(false);
  const [draggedLeadId, setDraggedLeadId] = useState<string | null>(null);
  const [dragOverStage, setDragOverStage] = useState<PipelineStage | null>(null);

  const columns: { stage: PipelineStage; label: string; accent: string; bg: string; border: string }[] = [
    { stage: 'nuevo_contacto', label: '1. Nuevo Contacto', accent: 'text-[#00D9F5]', bg: 'bg-[#00D9F5]/10', border: 'border-[#00D9F5]/30' },
    { stage: 'en_evaluacion', label: '2. En Evaluación', accent: 'text-sky-500', bg: 'bg-sky-50', border: 'border-sky-200' },
    { stage: 'contactado', label: '3. Contactado', accent: 'text-indigo-500', bg: 'bg-indigo-50', border: 'border-indigo-200' },
    { stage: 'reunion_programada', label: '4. Reunión Programada', accent: 'text-violet-500', bg: 'bg-violet-50', border: 'border-violet-200' },
    { stage: 'propuesta_enviada', label: '5. Propuesta Enviada', accent: 'text-amber-500', bg: 'bg-amber-50', border: 'border-amber-200' },
    { stage: 'negociacion', label: '6. Negociación', accent: 'text-orange-500', bg: 'bg-orange-50', border: 'border-orange-200' },
    { stage: 'ganado', label: '7. Ganado (Cerrado)', accent: 'text-[#00E3B2]', bg: 'bg-[#00E3B2]/10', border: 'border-[#00E3B2]/40' },
    { stage: 'perdido', label: '8. Perdido', accent: 'text-rose-500', bg: 'bg-rose-50', border: 'border-rose-200' },
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

  // Filter active vs archived
  const displayedLeads = leads.filter(l => showArchived ? l.isArchived : !l.isArchived);
  const activeCount = leads.filter(l => !l.isArchived).length;
  const archivedCount = leads.filter(l => l.isArchived).length;

  // Drag and Drop handlers
  const handleDragStart = (e: React.DragEvent, leadId: string) => {
    e.dataTransfer.setData('text/plain', leadId);
    e.dataTransfer.effectAllowed = 'move';
    setDraggedLeadId(leadId);
  };

  const handleDragEnd = () => {
    setDraggedLeadId(null);
    setDragOverStage(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDragEnter = (stage: PipelineStage) => {
    setDragOverStage(stage);
  };

  const handleDrop = async (e: React.DragEvent, targetStage: PipelineStage) => {
    e.preventDefault();
    setDragOverStage(null);
    const leadId = e.dataTransfer.getData('text/plain') || draggedLeadId;
    if (!leadId) return;

    const lead = leads.find(l => l.id === leadId);
    if (!lead || lead.status === targetStage) return;

    try {
      const res = await api.updateLead(lead.id, { status: targetStage });
      onLeadUpdated(res.lead);
    } catch (err) {
      console.error('Error dropping lead to stage:', err);
    } finally {
      setDraggedLeadId(null);
    }
  };

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

  const handleToggleArchive = async (lead: Lead, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const res = await api.updateLead(lead.id, { 
        isArchived: !lead.isArchived,
        archivedAt: !lead.isArchived ? new Date().toISOString() : undefined
      });
      onLeadUpdated(res.lead);
    } catch (err) {
      console.error('Error toggling archive:', err);
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
    <div className="space-y-6">
      
      {/* 1. UNIFIED VIEW HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#D0EBF7]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00D9F5] to-[#6366F1] flex items-center justify-center text-white shadow-sm shrink-0">
            <Columns3 className="w-5 h-5 font-bold" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#0B1F2D] tracking-tight">
              Pipeline Comercial Kanban
            </h1>
            <p className="text-xs font-mono text-[#64748B]">
              Jala y suelta las tarjetas entre columnas o usa las flechas para avanzar etapas
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Active vs Archived Toggle */}
          <div className="flex items-center p-1 bg-white rounded-xl border border-[#D0EBF7] text-xs font-mono shadow-2xs">
            <button
              onClick={() => setShowArchived(false)}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer font-bold ${
                !showArchived
                  ? 'bg-[#00D9F5] text-[#0B1F2D] shadow-xs'
                  : 'text-[#1E3A52] hover:text-[#009bb3]'
              }`}
            >
              Activas ({activeCount})
            </button>
            <button
              onClick={() => setShowArchived(true)}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer font-bold flex items-center gap-1 ${
                showArchived
                  ? 'bg-[#0B1F2D] text-white shadow-xs'
                  : 'text-[#64748B] hover:text-[#0B1F2D]'
              }`}
            >
              <Archive className="w-3.5 h-3.5" />
              <span>Archivadas ({archivedCount})</span>
            </button>
          </div>

          {onOpenNewContactModal && (
            <button
              onClick={onOpenNewContactModal}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#00D9F5] hover:bg-[#00E3B2] text-[#0B1F2D] font-bold text-xs font-mono transition-all cursor-pointer shadow-xs shadow-[#00D9F5]/25 hover:shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>Nueva Solicitud</span>
            </button>
          )}
        </div>
      </div>

      {/* Helpful Drag Instruction Bar */}
      <div className="p-3 rounded-xl bg-[#F0F9FF] border border-[#BCE4F7] text-xs font-mono text-[#00897B] flex items-center justify-between shadow-2xs">
        <span className="flex items-center gap-2">
          <GripVertical className="w-4 h-4 text-[#009bb3]" />
          <span><strong>Drag & Drop Activo:</strong> Puedes hacer clic sobre cualquier tarjeta, arrastrarla y soltarla en la columna deseada.</span>
        </span>
        <span className="text-[11px] text-[#64748B] hidden md:inline">
          Desplaza horizontalmente para ver las 8 etapas
        </span>
      </div>

      {/* Horizontal Scrollable Kanban Board */}
      <div className="flex gap-4 overflow-x-auto pb-6 pt-1 select-none min-h-[620px] scrollbar-thin">
        {columns.map((col, colIdx) => {
          const stageLeads = displayedLeads.filter(l => l.status === col.stage);
          const isOver = dragOverStage === col.stage;

          return (
            <div
              key={col.stage}
              onDragOver={handleDragOver}
              onDragEnter={() => handleDragEnter(col.stage)}
              onDrop={(e) => handleDrop(e, col.stage)}
              className={`w-72 sm:w-80 shrink-0 rounded-2xl flex flex-col justify-between transition-all duration-200 border ${
                isOver 
                  ? 'bg-[#E0F8FF] border-[#00D9F5] ring-2 ring-[#00D9F5]/40 shadow-lg scale-101' 
                  : 'bg-[#F8FCFE] border-[#D0EBF7]'
              }`}
            >
              {/* Column Header */}
              <div className="p-3.5 border-b border-[#D0EBF7] bg-white rounded-t-2xl flex items-center justify-between shadow-2xs">
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${col.stage === 'ganado' ? 'bg-[#00E3B2]' : 'bg-[#00D9F5]'}`} />
                  <span className="text-xs font-mono font-extrabold text-[#0B1F2D] tracking-tight">
                    {col.label}
                  </span>
                </div>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-[#EAF6FD] text-[#009bb3] border border-[#BCE4F7] tabular-nums">
                  {stageLeads.length}
                </span>
              </div>

              {/* Cards Container */}
              <div className="p-3 space-y-3 flex-1 overflow-y-auto max-h-[650px] scrollbar-thin">
                {stageLeads.length === 0 ? (
                  <div className={`py-12 border-2 border-dashed rounded-xl text-center text-xs font-mono transition-colors ${
                    isOver ? 'border-[#00D9F5] text-[#009bb3] bg-white/80' : 'border-[#D0EBF7] text-[#94A3B8]'
                  }`}>
                    {isOver ? 'Suelta aquí la solicitud' : 'Columna vacía'}
                  </div>
                ) : (
                  stageLeads.map((lead) => {
                    const isBeingDragged = draggedLeadId === lead.id;

                    return (
                      <div
                        key={lead.id}
                        draggable={true}
                        onDragStart={(e) => handleDragStart(e, lead.id)}
                        onDragEnd={handleDragEnd}
                        onClick={() => onSelectLead(lead)}
                        className={`p-4 rounded-xl bg-white border border-[#D0EBF7] hover:border-[#00D9F5] shadow-xs hover:shadow-md transition-all cursor-grab active:cursor-grabbing group relative overflow-hidden ${
                          isBeingDragged ? 'opacity-40 scale-95 border-dashed border-[#00D9F5]' : ''
                        }`}
                      >
                        {/* Top Accent line */}
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#00D9F5] to-[#00897B] opacity-0 group-hover:opacity-100 transition-opacity" />

                        {/* Title and Grip Indicator */}
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="flex items-center gap-1.5 min-w-0">
                            <GripVertical className="w-3.5 h-3.5 text-[#CBD5E1] group-hover:text-[#009bb3] shrink-0" />
                            <h4 className="font-extrabold text-sm text-[#0B1F2D] group-hover:text-[#009bb3] transition-colors truncate">
                              {lead.fullName}
                            </h4>
                          </div>

                          <span className="text-[10px] font-mono text-[#64748B] shrink-0">
                            {getDaysAgo(lead.createdAt)}
                          </span>
                        </div>

                        {/* Company / Service Tag */}
                        <div className="flex items-center gap-2 mb-2.5 flex-wrap">
                          {lead.company && (
                            <span className="text-[11px] font-mono text-[#64748B] flex items-center gap-1">
                              <Building className="w-3 h-3 text-[#00897B]" />
                              <span>{lead.company}</span>
                            </span>
                          )}
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#F0F9FF] text-[#009bb3] border border-[#BCE4F7] font-semibold">
                            {lead.projectType}
                          </span>
                          {lead.convertedProjectId && (
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#00E3B2]/20 text-[#00897B] border border-[#00E3B2]/40 font-bold">
                              ✓ Proyecto Creado
                            </span>
                          )}
                        </div>

                        {/* Description Preview */}
                        <p className="text-xs text-[#1E3A52] line-clamp-2 leading-relaxed mb-3">
                          {lead.description}
                        </p>

                        {/* Bottom Actions Row */}
                        <div className="pt-2.5 border-t border-[#F0F7FB] flex items-center justify-between text-xs font-mono">
                          
                          {/* Quick Archive / Restore Button */}
                          <button
                            onClick={(e) => handleToggleArchive(lead, e)}
                            className="p-1 rounded text-[#94A3B8] hover:text-[#0B1F2D] hover:bg-[#EAF6FD] transition-colors cursor-pointer"
                            title={lead.isArchived ? "Desarchivar solicitud" : "Archivar solicitud de la vista principal"}
                          >
                            {lead.isArchived ? (
                              <ArchiveRestore className="w-3.5 h-3.5 text-[#00897B]" />
                            ) : (
                              <Archive className="w-3.5 h-3.5" />
                            )}
                          </button>

                          {/* Quick Stage Shift Arrows */}
                          <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                            <button
                              disabled={colIdx === 0}
                              onClick={(e) => handleMoveStage(lead, 'backward', e)}
                              className="p-1 rounded text-[#64748B] hover:text-[#0B1F2D] hover:bg-[#EAF6FD] disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed transition-colors"
                              title="Mover a etapa anterior"
                            >
                              <ChevronLeft className="w-4 h-4" />
                            </button>

                            <button
                              disabled={colIdx === columns.length - 1}
                              onClick={(e) => handleMoveStage(lead, 'forward', e)}
                              className="p-1 rounded text-[#009bb3] hover:text-[#00897B] hover:bg-[#EAF6FD] disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed transition-colors"
                              title="Avanzar a etapa siguiente"
                            >
                              <ChevronRight className="w-4 h-4 font-bold" />
                            </button>
                          </div>

                        </div>

                      </div>
                    );
                  })
                )}
              </div>

              {/* Column Footer */}
              <div className="p-2.5 bg-white border-t border-[#D0EBF7] rounded-b-2xl text-[11px] font-mono text-[#64748B] text-center">
                <span>{stageLeads.length} {stageLeads.length === 1 ? 'oportunidad' : 'oportunidades'}</span>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
