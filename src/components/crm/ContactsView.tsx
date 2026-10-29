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
  Clock
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

  // Filtering & Sorting
  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const matchSearch =
        searchQuery === '' ||
        lead.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (lead.company && lead.company.toLowerCase().includes(searchQuery.toLowerCase())) ||
        lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchStatus = statusFilter === 'all' || lead.status === statusFilter;
      const matchType = typeFilter === 'all' || lead.projectType === typeFilter;

      return matchSearch && matchStatus && matchType;
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
  }, [leads, searchQuery, statusFilter, typeFilter, sortField, sortOrder]);

  const handleStageChange = async (leadId: string, newStage: PipelineStage, e: React.ChangeEvent<HTMLSelectElement>) => {
    e.stopPropagation();
    try {
      const res = await api.updateLead(leadId, { status: newStage });
      onLeadUpdated(res.lead);
    } catch (err) {
      console.error('Error changing lead stage:', err);
    }
  };

  const handleDelete = async (leadId: string, leadName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(`¿Estás seguro de que deseas archivar/eliminar el lead de "${leadName}"?`)) {
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
    nuevo_contacto: 'bg-[#00D9F5]/10 text-[#00D9F5] border-[#00D9F5]/30',
    en_evaluacion: 'bg-sky-400/10 text-sky-400 border-sky-400/30',
    contactado: 'bg-indigo-400/10 text-indigo-400 border-indigo-400/30',
    reunion_programada: 'bg-violet-400/10 text-violet-400 border-violet-400/30',
    propuesta_enviada: 'bg-amber-400/10 text-amber-400 border-amber-400/30',
    negociacion: 'bg-orange-400/10 text-orange-400 border-orange-400/30',
    ganado: 'bg-[#00E3B2]/10 text-[#00E3B2] border-[#00E3B2]/30',
    perdido: 'bg-rose-400/10 text-rose-400 border-rose-400/30',
  };

  return (
    <div className="space-y-6">
      
      {/* Title & Action Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#F5FBFF] tracking-tight">
            Gestión Integral de Contactos & Leads
          </h2>
          <p className="text-xs font-mono text-[#F5FBFF]/60 mt-0.5">
            {leads.length} contactos registrados · Datos persistentes en base de datos
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCsv}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-md bg-[#081722] hover:bg-[#143247] border border-[#00D9F5]/30 text-xs font-mono text-[#00D9F5] transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Descargar CSV</span>
          </button>

          <button
            onClick={onOpenNewContactModal}
            className="flex items-center gap-1.5 px-4 py-2 rounded-md bg-[#00D9F5] hover:bg-[#00E3B2] text-[#0B1F2D] font-bold text-xs font-mono transition-colors cursor-pointer shadow-sm shadow-[#00D9F5]/20"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Nuevo Contacto</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 p-4 rounded-xl bg-[#081722] border border-[#16364d]">
        
        {/* Search */}
        <div className="sm:col-span-5 relative">
          <Search className="w-4 h-4 text-[#00D9F5] absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por nombre, empresa, correo o ID..."
            className="w-full pl-9 pr-4 py-2 rounded-md bg-[#0B1F2D] border border-[#16364d] focus:border-[#00D9F5] text-xs font-mono text-[#F5FBFF] placeholder-[#F5FBFF]/40 outline-none"
          />
        </div>

        {/* Filter Stage */}
        <div className="sm:col-span-4">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 rounded-md bg-[#0B1F2D] border border-[#16364d] focus:border-[#00D9F5] text-xs font-mono text-[#F5FBFF] outline-none"
          >
            <option value="all">Todas las etapas del pipeline</option>
            {stageOptions.map((st) => (
              <option key={st.value} value={st.value}>
                {st.label}
              </option>
            ))}
          </select>
        </div>

        {/* Filter Project Type */}
        <div className="sm:col-span-3">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-full px-3 py-2 rounded-md bg-[#0B1F2D] border border-[#16364d] focus:border-[#00D9F5] text-xs font-mono text-[#F5FBFF] outline-none"
          >
            <option value="all">Todos los servicios</option>
            {projectTypes.map((pt) => (
              <option key={pt.value} value={pt.value}>
                {pt.label}
              </option>
            ))}
          </select>
        </div>

      </div>

      {/* Contacts Data Table */}
      <div className="rounded-xl bg-[#081722] border border-[#16364d] overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#143247] bg-[#0B1F2D] text-[11px] font-mono text-[#F5FBFF]/60 uppercase tracking-wider">
                <th className="py-3.5 px-4 font-semibold">ID / Lead</th>
                <th
                  onClick={() => toggleSort('fullName')}
                  className="py-3.5 px-4 font-semibold cursor-pointer hover:text-[#00D9F5] transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Nombre & Organización</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3.5 px-4 font-semibold">Tipo de Proyecto</th>
                <th
                  onClick={() => toggleSort('status')}
                  className="py-3.5 px-4 font-semibold cursor-pointer hover:text-[#00D9F5] transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Etapa / Estado</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3.5 px-4 font-semibold">Responsable</th>
                <th
                  onClick={() => toggleSort('createdAt')}
                  className="py-3.5 px-4 font-semibold cursor-pointer hover:text-[#00D9F5] transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Fecha</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3.5 px-4 text-right font-semibold">Acciones</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#143247] text-xs">
              {filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-xs font-mono text-[#F5FBFF]/40">
                    No se encontraron contactos que coincidan con los filtros aplicados.
                  </td>
                </tr>
              ) : (
                filteredLeads.map((lead) => {
                  return (
                    <tr
                      key={lead.id}
                      onClick={() => onSelectLead(lead)}
                      className="hover:bg-[#0B1F2D]/90 transition-colors cursor-pointer group"
                    >
                      {/* ID / Source */}
                      <td className="py-3.5 px-4 whitespace-nowrap font-mono">
                        <span className="text-[#00D9F5] font-semibold">{lead.id.split('_').slice(1).join('_')}</span>
                        <span className="block text-[10px] text-[#F5FBFF]/40 uppercase">
                          {lead.source === 'landing_page' ? 'Web Landing' : lead.source}
                        </span>
                      </td>

                      {/* Name & Company */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-[#F5FBFF] group-hover:text-[#00D9F5] transition-colors">
                          {lead.fullName}
                        </div>
                        <div className="text-[11px] font-mono text-[#F5FBFF]/60 flex items-center gap-2 mt-0.5">
                          {lead.company && (
                            <span className="flex items-center gap-1">
                              <Building className="w-3 h-3 text-[#00E3B2]" />
                              {lead.company}
                            </span>
                          )}
                          <span className="truncate max-w-[150px]">{lead.email}</span>
                        </div>
                      </td>

                      {/* Project Type */}
                      <td className="py-3.5 px-4 whitespace-nowrap font-mono text-[11px]">
                        <span className="text-[#F5FBFF] capitalize">{lead.projectType}</span>
                        <span className="block text-[10px] text-[#F5FBFF]/40">
                          Pref: {lead.contactPreference}
                        </span>
                      </td>

                      {/* Status / Stage Dropdown */}
                      <td className="py-3.5 px-4 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                        <select
                          value={lead.status}
                          onChange={(e) => handleStageChange(lead.id, e.target.value as PipelineStage, e)}
                          className={`text-[11px] font-mono font-semibold px-2 py-1 rounded border outline-none cursor-pointer ${
                            stageBadgeStyle[lead.status] || 'bg-neutral-800 text-neutral-200 border-neutral-700'
                          }`}
                        >
                          {stageOptions.map((st) => (
                            <option key={st.value} value={st.value} className="bg-[#0B1F2D] text-[#F5FBFF]">
                              {st.label}
                            </option>
                          ))}
                        </select>
                      </td>

                      {/* Responsible */}
                      <td className="py-3.5 px-4 whitespace-nowrap font-mono text-[11px] text-[#F5FBFF]/80">
                        {lead.assignedTo}
                      </td>

                      {/* Date */}
                      <td className="py-3.5 px-4 whitespace-nowrap font-mono text-[11px] text-[#F5FBFF]/60 tabular-nums">
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
                            className="p-1.5 rounded hover:bg-[#143247] text-[#00D9F5] transition-colors"
                            title="Ver ficha completa"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => handleDelete(lead.id, lead.fullName, e)}
                            className="p-1.5 rounded hover:bg-rose-950/60 text-[#F5FBFF]/40 hover:text-rose-400 transition-colors"
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
