import React, { useState, useMemo } from 'react';
import { Lead, PipelineStage, ProjectType } from '../../types/index.ts';
import { api } from '../../lib/api.ts';
import { 
  Search, 
  Filter, 
  Download, 
  Plus, 
  Building, 
  Mail, 
  Phone, 
  Eye, 
  Trash2, 
  ArrowUpDown,
  MoreVertical,
  CheckCircle2,
  Clock,
  Users,
  Archive,
  ArchiveRestore
} from 'lucide-react';

interface ContactsViewProps {
  leads: Lead[];
  onSelectLead: (lead: Lead) => void;
  onLeadUpdated: (lead: Lead) => void;
  onLeadDeleted: (id: string) => void;
  onOpenNewContactModal: () => void;
}

export const ContactsView: React.FC<ContactsViewProps> = ({
  leads,
  onSelectLead,
  onLeadUpdated,
  onLeadDeleted,
  onOpenNewContactModal,
}) => {
  const [showArchived, setShowArchived] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [sortField, setSortField] = useState<'createdAt' | 'fullName' | 'status'>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const stageOptions: { value: PipelineStage; label: string }[] = [
    { value: 'nuevo_contacto', label: 'Nuevo Contacto' },
    { value: 'en_evaluacion', label: 'En Evaluación' },
    { value: 'contactado', label: 'Contactado' },
    { value: 'reunion_programada', label: 'Reunión Programada' },
    { value: 'propuesta_enviada', label: 'Propuesta Enviada' },
    { value: 'negociacion', label: 'Negociación' },
    { value: 'ganado', label: 'Ganado' },
    { value: 'perdido', label: 'Perdido' },
  ];

  const projectTypes: { value: ProjectType; label: string }[] = [
    { value: 'software', label: 'Software a Medida' },
    { value: 'crm', label: 'CRM y Gestión' },
    { value: 'automation', label: 'Automatización' },
    { value: 'optimization', label: 'Optimización' },
    { value: 'consulting', label: 'Consultoría' },
    { value: 'idea', label: 'Idea / Diagnóstico' },
  ];

  const activeCount = leads.filter(l => !l.isArchived).length;
  const archivedCount = leads.filter(l => l.isArchived).length;

  // Filtering & Sorting
  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const matchArchived = showArchived ? lead.isArchived : !lead.isArchived;

      const matchSearch =
        searchQuery === '' ||
        lead.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (lead.company && lead.company.toLowerCase().includes(searchQuery.toLowerCase())) ||
        lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (lead.referenceCode && lead.referenceCode.toLowerCase().includes(searchQuery.toLowerCase())) ||
        lead.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchStatus = statusFilter === 'all' || lead.status === statusFilter;
      const matchType = typeFilter === 'all' || lead.projectType === typeFilter;

      return matchArchived && matchSearch && matchStatus && matchType;
    }).sort((a, b) => {
      let cmp = 0;
      if (sortField === 'createdAt') {
        cmp = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      } else if (sortField === 'fullName') {
        cmp = a.fullName.localeCompare(b.fullName);
      } else if (sortField === 'status') {
        cmp = a.status.localeCompare(b.status);
      }
      return sortOrder === 'desc' ? -cmp : cmp;
    });
  }, [leads, showArchived, searchQuery, statusFilter, typeFilter, sortField, sortOrder]);

  const handleStageChange = async (leadId: string, newStage: PipelineStage, e: React.ChangeEvent<HTMLSelectElement>) => {
    e.stopPropagation();
    try {
      const res = await api.updateLead(leadId, { status: newStage });
      onLeadUpdated(res.lead);
    } catch (err) {
      console.error('Error changing lead stage:', err);
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
      console.error('Error archiving lead:', err);
    }
  };

  const handleDelete = async (leadId: string, leadName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(`¿Estás seguro de que deseas eliminar permanentemente el lead de "${leadName}"?`)) {
      try {
        await api.deleteLead(leadId);
        onLeadDeleted(leadId);
      } catch (err) {
        console.error('Error deleting lead:', err);
      }
    }
  };

  const handleExportCsv = () => {
    window.location.href = api.getExportCsvUrl();
  };

  const toggleSort = (field: 'createdAt' | 'fullName' | 'status') => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const stageBadgeStyle: Record<string, string> = {
    nuevo_contacto: 'bg-[#00D9F5]/10 text-[#009bb3] border-[#00D9F5]/30',
    en_evaluacion: 'bg-sky-400/10 text-sky-600 border-sky-400/30',
    contactado: 'bg-indigo-400/10 text-indigo-600 border-indigo-400/30',
    reunion_programada: 'bg-violet-400/10 text-violet-600 border-violet-400/30',
    propuesta_enviada: 'bg-amber-400/10 text-amber-700 border-amber-400/30',
    negociacion: 'bg-orange-400/10 text-orange-700 border-orange-400/30',
    ganado: 'bg-[#00E3B2]/15 text-emerald-700 border-[#00E3B2]/40',
    perdido: 'bg-rose-400/10 text-rose-700 border-rose-400/30',
  };

  return (
    <div className="space-y-6">
      
      {/* 1. UNIFIED VIEW HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#D0EBF7]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00D9F5] to-[#0284C7] flex items-center justify-center text-white shadow-sm shrink-0">
            <Users className="w-5 h-5 font-bold" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#0B1F2D] tracking-tight">
              Gestión Integral de Contactos & Leads
            </h1>
            <p className="text-xs font-mono text-[#64748B]">
              Directorio de prospectos, clientes y empresas con sincronización operativa
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Active vs Archived Toggle */}
          <div className="flex items-center p-1 bg-white rounded-xl border border-[#D0EBF7] text-xs font-mono shadow-2xs">
            <button
              onClick={() => setShowArchived(false)}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer font-bold ${
                !showArchived
                  ? 'bg-[#00D9F5] text-[#0B1F2D] shadow-xs'
                  : 'text-[#64748B] hover:text-[#0B1F2D]'
              }`}
            >
              Activos ({activeCount})
            </button>
            <button
              onClick={() => setShowArchived(true)}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer font-bold ${
                showArchived
                  ? 'bg-[#00D9F5] text-[#0B1F2D] shadow-xs'
                  : 'text-[#64748B] hover:text-[#0B1F2D]'
              }`}
            >
              Archivados ({archivedCount})
            </button>
          </div>

          <button
            onClick={handleExportCsv}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-[#EAF6FD] border border-[#BCE4F7] text-xs font-mono text-[#009bb3] font-bold transition-all cursor-pointer shadow-2xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Descargar CSV</span>
          </button>

          <button
            onClick={onOpenNewContactModal}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#00D9F5] hover:bg-[#00E3B2] text-[#0B1F2D] font-bold text-xs font-mono transition-colors cursor-pointer shadow-xs shadow-[#00D9F5]/20 hover:shadow-[0_0_15px_rgba(0,217,245,0.4)]"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Nuevo Contacto</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 p-4 rounded-xl bg-white border border-[#D0EBF7] shadow-xs">
        
        {/* Search */}
        <div className="sm:col-span-5 relative">
          <Search className="w-4 h-4 text-[#009bb3] absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por nombre, empresa, email, ID o requerimiento..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-lg bg-[#F5FBFF] border border-[#D0EBF7] text-[#0B1F2D] outline-none focus:border-[#00D9F5]"
          />
        </div>

        {/* Status Filter */}
        <div className="sm:col-span-4">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-lg bg-[#F5FBFF] border border-[#D0EBF7] text-[#0B1F2D] font-mono outline-none focus:border-[#00D9F5] cursor-pointer"
          >
            <option value="all">Todas las Etapas ({leads.length})</option>
            {stageOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Project Type Filter */}
        <div className="sm:col-span-3">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-lg bg-[#F5FBFF] border border-[#D0EBF7] text-[#0B1F2D] font-mono outline-none focus:border-[#00D9F5] cursor-pointer"
          >
            <option value="all">Todos los Tipos</option>
            {projectTypes.map((pt) => (
              <option key={pt.value} value={pt.value}>
                {pt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-xl border border-[#D0EBF7] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#EAF6FD] border-b border-[#D0EBF7] text-[#1E3A52] font-mono text-[11px] uppercase tracking-wider">
                <th className="py-3 px-4 font-semibold">
                  <button
                    onClick={() => toggleSort('fullName')}
                    className="flex items-center gap-1 hover:text-[#009bb3] cursor-pointer"
                  >
                    <span>Contacto / Empresa</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th className="py-3 px-4 font-semibold">Tipo Solución</th>
                <th className="py-3 px-4 font-semibold">Canal Preferido</th>
                <th className="py-3 px-4 font-semibold">
                  <button
                    onClick={() => toggleSort('status')}
                    className="flex items-center gap-1 hover:text-[#009bb3] cursor-pointer"
                  >
                    <span>Etapa Comercial</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th className="py-3 px-4 font-semibold">Responsable</th>
                <th className="py-3 px-4 font-semibold">
                  <button
                    onClick={() => toggleSort('createdAt')}
                    className="flex items-center gap-1 hover:text-[#009bb3] cursor-pointer"
                  >
                    <span>Fecha</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th className="py-3 px-4 text-right font-semibold">Acciones</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#D0EBF7]">
              {filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-xs font-mono text-[#64748B]">
                    {showArchived
                      ? 'No hay contactos en la bandeja de archivados.'
                      : 'No se encontraron contactos activos que coincidan con los filtros aplicados.'}
                  </td>
                </tr>
              ) : (
                filteredLeads.map((lead) => {
                  return (
                    <tr
                      key={lead.id}
                      onClick={() => onSelectLead(lead)}
                      className="hover:bg-[#F5FBFF] transition-colors cursor-pointer group"
                    >
                      {/* Name & Company */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-[#0B1F2D] text-[#00D9F5] font-mono font-bold text-xs flex items-center justify-center shrink-0">
                            {lead.fullName.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="flex flex-wrap items-center gap-1.5">
                              <span className="font-bold text-[#0B1F2D] group-hover:text-[#009bb3] transition-colors">
                                {lead.fullName}
                              </span>
                              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#00D9F5]/10 text-[#009bb3] border border-[#00D9F5]/30 font-bold">
                                {lead.referenceCode || lead.id}
                              </span>
                              {lead.diagnosticStatus && (
                                <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded font-bold ${
                                  lead.diagnosticStatus === 'completado'
                                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                    : lead.diagnosticStatus === 'en_progreso'
                                    ? 'bg-sky-100 text-sky-800 border border-sky-300'
                                    : 'bg-slate-100 text-slate-600'
                                }`}>
                                  {lead.diagnosticStatus === 'completado' ? 'Diag: Completo' : lead.diagnosticStatus === 'en_progreso' ? 'Diag: En Curso' : 'Diag: Pendiente'}
                                </span>
                              )}
                              {lead.isArchived && (
                                <span className="text-[9px] font-mono bg-amber-500/10 text-amber-600 px-1.5 py-0.2 rounded border border-amber-300">
                                  Archivado
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2 text-[11px] text-[#64748B] font-mono">
                              {lead.company && (
                                <span className="flex items-center gap-1 text-[#00897B] font-semibold">
                                  <Building className="w-3 h-3" />
                                  {lead.company}
                                </span>
                              )}
                              <span>{lead.email}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Project Type */}
                      <td className="py-3.5 px-4 whitespace-nowrap font-mono text-[11px]">
                        <span className="px-2 py-0.5 rounded bg-[#EAF6FD] text-[#009bb3] border border-[#BCE4F7] uppercase font-semibold">
                          {lead.projectType}
                        </span>
                      </td>

                      {/* Channel */}
                      <td className="py-3.5 px-4 whitespace-nowrap font-mono text-[11px] text-[#64748B]">
                        <span className="capitalize">
                          {lead.contactPreference}
                        </span>
                      </td>

                      {/* Status / Stage Dropdown */}
                      <td className="py-3.5 px-4 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                        <select
                          value={lead.status}
                          onChange={(e) => handleStageChange(lead.id, e.target.value as PipelineStage, e)}
                          className={`text-[11px] font-mono font-bold px-2 py-1 rounded-lg border outline-none cursor-pointer ${
                            stageBadgeStyle[lead.status] || 'bg-neutral-100 text-neutral-700 border-neutral-300'
                          }`}
                        >
                          {stageOptions.map((st) => (
                            <option key={st.value} value={st.value} className="bg-white text-[#0B1F2D]">
                              {st.label}
                            </option>
                          ))}
                        </select>
                      </td>

                      {/* Responsible */}
                      <td className="py-3.5 px-4 whitespace-nowrap font-mono text-[11px] text-[#1E3A52]">
                        {lead.assignedTo}
                      </td>

                      {/* Date */}
                      <td className="py-3.5 px-4 whitespace-nowrap font-mono text-[11px] text-[#64748B] tabular-nums">
                        {new Date(lead.createdAt).toLocaleDateString('es-ES', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </td>

                      {/* Action buttons */}
                      <td className="py-3.5 px-4 whitespace-nowrap text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onSelectLead(lead)}
                            className="p-1.5 rounded-lg hover:bg-[#EAF6FD] text-[#009bb3] transition-colors"
                            title="Ver ficha completa y asignar tareas"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          
                          <button
                            onClick={(e) => handleToggleArchive(lead, e)}
                            className="p-1.5 rounded-lg hover:bg-[#EAF6FD] text-[#64748B] hover:text-[#0B1F2D] transition-colors"
                            title={lead.isArchived ? "Desarchivar lead" : "Archivar lead"}
                          >
                            {lead.isArchived ? (
                              <ArchiveRestore className="w-4 h-4 text-amber-600" />
                            ) : (
                              <Archive className="w-4 h-4" />
                            )}
                          </button>

                          <button
                            onClick={(e) => handleDelete(lead.id, lead.fullName, e)}
                            className="p-1.5 rounded-lg hover:bg-rose-50 text-neutral-400 hover:text-rose-600 transition-colors"
                            title="Eliminar contacto"
                          >
                            <Trash2 className="w-4 h-4" />
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
      </div>

    </div>
  );
};
