import React, { useState } from 'react';
import { Lead, PipelineStage, TaskPriority } from '../../types/index.ts';
import { api } from '../../lib/api.ts';
import { 
  X, 
  Building, 
  Mail, 
  Phone, 
  Calendar, 
  User, 
  Send, 
  Plus, 
  CheckCircle2, 
  Clock, 
  Rocket, 
  AlertCircle,
  FileText,
  ListTodo,
  History
} from 'lucide-react';

interface ContactDetailModalProps {
  lead: Lead | null;
  isOpen: boolean;
  onClose: () => void;
  onLeadUpdated: (updatedLead: Lead) => void;
  onLeadConvertedToProject?: (projectData: any) => void;
}

export const ContactDetailModal: React.FC<ContactDetailModalProps> = ({
  lead,
  isOpen,
  onClose,
  onLeadUpdated,
  onLeadConvertedToProject,
}) => {
  if (!isOpen || !lead) return null;

  const [activeTab, setActiveTab] = useState<'info' | 'notes' | 'tasks' | 'activity'>('info');
  const [newNote, setNewNote] = useState('');
  const [addingNote, setAddingNote] = useState(false);
  
  // Task quick creation state
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskPriority, setTaskPriority] = useState<TaskPriority>('media');
  const [taskDueDate, setTaskDueDate] = useState(
    new Date(Date.now() + 2 * 86400000).toISOString().split('T')[0]
  );
  const [taskAssignedTo, setTaskAssignedTo] = useState('Director Cokito');

  // Convert to project modal state
  const [showConvertModal, setShowConvertModal] = useState(false);
  const [projectName, setProjectName] = useState(`Sistema: ${lead.fullName}`);
  const [projectCategory, setProjectCategory] = useState(
    lead.projectType === 'crm' ? 'CRM y Gestión Operativa' :
    lead.projectType === 'automation' ? 'Automatización Inteligente' :
    lead.projectType === 'optimization' ? 'Optimización de Sistemas' :
    lead.projectType === 'consulting' ? 'Consultoría Tecnológica' : 'Software a Medida'
  );
  const [projectDescription, setProjectDescription] = useState(lead.description);
  const [converting, setConverting] = useState(false);

  const pipelineStages: { value: PipelineStage; label: string }[] = [
    { value: 'nuevo_contacto', label: '1. Nuevo Contacto' },
    { value: 'en_evaluacion', label: '2. En Evaluación' },
    { value: 'contactado', label: '3. Contactado' },
    { value: 'reunion_programada', label: '4. Reunión Programada' },
    { value: 'propuesta_enviada', label: '5. Propuesta Enviada' },
    { value: 'negociacion', label: '6. Negociación' },
    { value: 'ganado', label: '7. Ganado (Cerrado)' },
    { value: 'perdido', label: '8. Perdido' },
  ];

  const handleStageChange = async (newStage: PipelineStage) => {
    try {
      const res = await api.updateLead(lead.id, { status: newStage });
      onLeadUpdated(res.lead);
    } catch (e) {
      console.error('Error changing stage:', e);
    }
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    setAddingNote(true);
    try {
      const res = await api.addLeadNote(lead.id, newNote);
      onLeadUpdated(res.lead);
      setNewNote('');
    } catch (e) {
      console.error('Error adding note:', e);
    } finally {
      setAddingNote(false);
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;

    try {
      await api.createTask({
        leadId: lead.id,
        leadName: `${lead.fullName}${lead.company ? ` (${lead.company})` : ''}`,
        title: taskTitle,
        assignedTo: taskAssignedTo,
        priority: taskPriority,
        dueDate: taskDueDate,
        status: 'pendiente',
      });
      // Refresh lead activity
      const refreshed = await api.getLead(lead.id);
      onLeadUpdated(refreshed.lead);
      setTaskTitle('');
      setShowTaskForm(false);
    } catch (e) {
      console.error('Error creating task:', e);
    }
  };

  const handleConvertToProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setConverting(true);

    try {
      const projectPayload = {
        leadId: lead.id,
        name: projectName,
        clientName: lead.fullName,
        company: lead.company || lead.fullName,
        description: projectDescription,
        status: 'en_desarrollo' as const,
        assignedLead: 'Director Cokito',
        startDate: new Date().toISOString().split('T')[0],
        milestones: [
          { id: 'm_1', title: 'Definición de requerimientos y alcance', done: true },
          { id: 'm_2', title: 'Diseño de arquitectura de software', done: false, dueDate: taskDueDate },
          { id: 'm_3', title: 'Desarrollo del núcleo funcional', done: false },
          { id: 'm_4', title: 'Pruebas de aceptación y puesta en marcha', done: false },
        ],
        visibleOnLanding: true,
        category: projectCategory,
        categories: [projectCategory, 'CRM & Operaciones'],
        releasePhase: 'BETA 2.0',
        tags: [lead.projectType.toUpperCase(), 'Producción'],
      };

      const res = await api.createProject(projectPayload);
      const updatedLead = await api.getLead(lead.id);
      onLeadUpdated(updatedLead.lead);

      if (onLeadConvertedToProject) {
        onLeadConvertedToProject(res.project);
      }
      setShowConvertModal(false);
    } catch (e) {
      console.error('Error converting to project:', e);
    } finally {
      setConverting(false);
    }
  };

  const formatDate = (isoStr: string) => {
    try {
      const d = new Date(isoStr);
      return d.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return isoStr;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-4xl max-h-[92vh] bg-[#0B1F2D] border border-[#00D9F5]/40 rounded-2xl flex flex-col shadow-2xl overflow-hidden">
        
        {/* Modal Top Header */}
        <div className="px-6 py-4 bg-[#081722] border-b border-[#143247] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs text-[#00D9F5] bg-[#00D9F5]/10 px-2 py-0.5 rounded border border-[#00D9F5]/30">
              {lead.id}
            </span>
            <div>
              <h2 className="text-lg font-bold text-[#F5FBFF] leading-tight">
                {lead.fullName}
              </h2>
              {lead.company && (
                <span className="text-xs text-[#F5FBFF]/60 flex items-center gap-1 font-mono">
                  <Building className="w-3 h-3 text-[#00E3B2]" />
                  {lead.company}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Convert to Project Action */}
            {!lead.convertedProjectId ? (
              <button
                onClick={() => setShowConvertModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#0B1F2D] bg-[#00E3B2] hover:bg-[#00D9F5] rounded-md transition-colors cursor-pointer"
              >
                <Rocket className="w-3.5 h-3.5" />
                <span>Convertir en Proyecto</span>
              </button>
            ) : (
              <span className="text-xs font-mono text-[#00E3B2] bg-[#00E3B2]/10 px-2.5 py-1 rounded border border-[#00E3B2]/30 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Proyecto Activo
              </span>
            )}

            <button
              onClick={onClose}
              className="p-1.5 text-[#F5FBFF]/60 hover:text-[#F5FBFF] hover:bg-[#143247] rounded-md transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Stage Status Control Strip */}
        <div className="px-6 py-3 bg-[#0B1F2D] border-b border-[#143247] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-[#F5FBFF]/70">
              Etapa Comercial:
            </span>
            <select
              value={lead.status}
              onChange={(e) => handleStageChange(e.target.value as PipelineStage)}
              className="px-3 py-1 rounded-md bg-[#081722] border border-[#00D9F5]/40 text-xs font-mono text-[#00D9F5] font-bold outline-none cursor-pointer"
            >
              {pipelineStages.map((st) => (
                <option key={st.value} value={st.value} className="bg-[#0B1F2D] text-[#F5FBFF]">
                  {st.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono text-[#F5FBFF]/60">
            <span>Asignado: <strong className="text-[#F5FBFF]">{lead.assignedTo}</strong></span>
            <span>Origen: <strong className="text-[#00D9F5]">{lead.source === 'landing_page' ? 'Landing Page' : lead.source}</strong></span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 border-b border-[#143247] bg-[#081722]/60 flex items-center gap-6 text-xs font-mono">
          {[
            { id: 'info', label: 'Ficha General', icon: FileText },
            { id: 'notes', label: `Notas (${lead.notes.length})`, icon: MessageSquareIcon },
            { id: 'activity', label: `Historial (${lead.activity.length})`, icon: History },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-3 flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
                  activeTab === tab.id
                    ? 'border-[#00D9F5] text-[#00D9F5] font-bold'
                    : 'border-transparent text-[#F5FBFF]/60 hover:text-[#F5FBFF]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {activeTab === 'info' && (
            <div className="space-y-6">
              
              {/* Contact Information Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-xl bg-[#081722] border border-[#16364d]">
                <div className="space-y-1">
                  <span className="text-[11px] font-mono text-[#F5FBFF]/50 uppercase">Correo</span>
                  <a href={`mailto:${lead.email}`} className="text-xs text-[#00D9F5] hover:underline block truncate">
                    {lead.email}
                  </a>
                </div>

                <div className="space-y-1">
                  <span className="text-[11px] font-mono text-[#F5FBFF]/50 uppercase">Teléfono</span>
                  <span className="text-xs text-[#F5FBFF] block">
                    {lead.phone || 'No especificado'}
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="text-[11px] font-mono text-[#F5FBFF]/50 uppercase">Preferencia de Contacto</span>
                  <span className="text-xs text-[#00E3B2] uppercase font-mono font-semibold block">
                    {lead.contactPreference}
                  </span>
                </div>
              </div>

              {/* Requirement description */}
              <div>
                <span className="text-xs font-mono text-[#00D9F5] uppercase tracking-wider block mb-2">
                  Descripción de la Necesidad Planteada:
                </span>
                <div className="p-4 rounded-xl bg-[#081722] border border-[#16364d] text-sm text-[#F5FBFF]/90 leading-relaxed whitespace-pre-wrap">
                  {lead.description}
                </div>
              </div>

              {/* Metadata strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono text-[#F5FBFF]/70">
                <div className="p-3 rounded bg-[#081722] border border-[#16364d]">
                  <span className="text-[10px] text-[#F5FBFF]/40 block">TIPO</span>
                  <span className="font-bold text-[#F5FBFF] uppercase">{lead.projectType}</span>
                </div>
                <div className="p-3 rounded bg-[#081722] border border-[#16364d]">
                  <span className="text-[10px] text-[#F5FBFF]/40 block">FECHA REGISTRO</span>
                  <span>{formatDate(lead.createdAt).split(',')[0]}</span>
                </div>
                <div className="p-3 rounded bg-[#081722] border border-[#16364d]">
                  <span className="text-[10px] text-[#F5FBFF]/40 block">CONSENTIMIENTO</span>
                  <span className="text-[#00E3B2] font-semibold">{lead.dataConsent ? 'Otorgado' : 'No'}</span>
                </div>
                <div className="p-3 rounded bg-[#081722] border border-[#16364d]">
                  <span className="text-[10px] text-[#F5FBFF]/40 block">ÚLTIMA ACTIVIDAD</span>
                  <span>{formatDate(lead.updatedAt).split(',')[0]}</span>
                </div>
              </div>

              {/* Quick Task Creation Section */}
              <div className="pt-4 border-t border-[#143247]">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono text-[#00E3B2] uppercase tracking-wider">
                    Asignar Tarea de Seguimiento
                  </span>
                  {!showTaskForm && (
                    <button
                      onClick={() => setShowTaskForm(true)}
                      className="text-xs font-mono text-[#00D9F5] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Nueva Tarea para {lead.fullName.split(' ')[0]}</span>
                    </button>
                  )}
                </div>

                {showTaskForm && (
                  <form onSubmit={handleCreateTask} className="p-4 rounded-xl bg-[#081722] border border-[#00D9F5]/30 space-y-3">
                    <div>
                      <input
                        type="text"
                        required
                        value={taskTitle}
                        onChange={(e) => setTaskTitle(e.target.value)}
                        placeholder="Ej. Agendar llamada de diagnóstico o preparar propuesta"
                        className="w-full px-3 py-2 rounded bg-[#0B1F2D] border border-[#16364d] text-xs text-[#F5FBFF] outline-none"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="text-[10px] font-mono text-[#F5FBFF]/50 block mb-1">Prioridad</label>
                        <select
                          value={taskPriority}
                          onChange={(e) => setTaskPriority(e.target.value as TaskPriority)}
                          className="w-full px-2 py-1.5 rounded bg-[#0B1F2D] border border-[#16364d] text-xs text-[#F5FBFF] font-mono"
                        >
                          <option value="baja">Baja</option>
                          <option value="media">Media</option>
                          <option value="alta">Alta</option>
                          <option value="urgente">Urgente</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] font-mono text-[#F5FBFF]/50 block mb-1">Fecha Límite</label>
                        <input
                          type="date"
                          value={taskDueDate}
                          onChange={(e) => setTaskDueDate(e.target.value)}
                          className="w-full px-2 py-1 rounded bg-[#0B1F2D] border border-[#16364d] text-xs text-[#F5FBFF] font-mono"
                        />
                      </div>
                      <div className="flex items-end gap-2">
                        <button
                          type="submit"
                          className="flex-1 py-1.5 px-3 rounded bg-[#00D9F5] text-[#0B1F2D] text-xs font-bold font-mono hover:bg-[#00E3B2] transition-colors"
                        >
                          Crear Tarea
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowTaskForm(false)}
                          className="py-1.5 px-3 rounded bg-[#16364d] text-[#F5FBFF]/70 text-xs font-mono"
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  </form>
                )}
              </div>

            </div>
          )}

          {activeTab === 'notes' && (
            <div className="space-y-6">
              {/* Add Note Form */}
              <form onSubmit={handleAddNote} className="space-y-2">
                <label className="text-xs font-mono text-[#00D9F5] block">
                  Agregar Nota Interna al Registro
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Escribe un apunte de llamada, requerimiento adicional o acuerdo..."
                    className="flex-1 px-4 py-2.5 rounded-md bg-[#081722] border border-[#16364d] text-xs text-[#F5FBFF] outline-none focus:border-[#00D9F5]"
                  />
                  <button
                    type="submit"
                    disabled={addingNote || !newNote.trim()}
                    className="px-4 py-2.5 rounded-md bg-[#00D9F5] hover:bg-[#00E3B2] text-[#0B1F2D] font-bold text-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Guardar Nota</span>
                  </button>
                </div>
              </form>

              {/* Notes List */}
              <div className="space-y-3">
                {lead.notes.length === 0 ? (
                  <div className="p-8 text-center text-xs font-mono text-[#F5FBFF]/40 border border-dashed border-[#16364d] rounded-xl">
                    No hay notas internas registradas todavía. Agrega la primera arriba.
                  </div>
                ) : (
                  lead.notes.map((note) => (
                    <div
                      key={note.id}
                      className="p-4 rounded-xl bg-[#081722] border border-[#16364d] space-y-1.5"
                    >
                      <div className="flex items-center justify-between text-[11px] font-mono text-[#F5FBFF]/50">
                        <span className="text-[#00E3B2] font-semibold">{note.author}</span>
                        <span>{formatDate(note.createdAt)}</span>
                      </div>
                      <p className="text-xs text-[#F5FBFF]/90 leading-relaxed">
                        {note.content}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === 'activity' && (
            <div className="space-y-4">
              <span className="text-xs font-mono text-[#00D9F5] uppercase tracking-wider block">
                Línea de Tiempo del Lead
              </span>

              <div className="relative pl-6 space-y-6 before:content-[''] before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#16364d]">
                {lead.activity.map((act) => (
                  <div key={act.id} className="relative group">
                    <div className="absolute -left-[27px] top-1 w-3 h-3 rounded-full bg-[#00D9F5] ring-4 ring-[#0B1F2D]" />
                    <div className="text-xs font-mono text-[#F5FBFF]/50 mb-0.5 flex items-center justify-between">
                      <span>{act.author}</span>
                      <span>{formatDate(act.timestamp)}</span>
                    </div>
                    <p className="text-xs text-[#F5FBFF]/90 font-medium">
                      {act.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-[#081722] border-t border-[#143247] flex items-center justify-between">
          <span className="text-[11px] font-mono text-[#F5FBFF]/50">
            Cokito's Lab Control Center · Registro #{lead.id}
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#143247] hover:bg-[#1c4563] text-xs font-mono text-[#F5FBFF] rounded-md transition-colors"
          >
            Cerrar Ficha
          </button>
        </div>

      </div>

      {/* Convert to Project Submodal */}
      {showConvertModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/90">
          <div className="w-full max-w-lg bg-[#0B1F2D] border border-[#00E3B2] rounded-2xl p-6 sm:p-8 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center gap-2 text-[#00E3B2] mb-3">
              <Rocket className="w-5 h-5" />
              <h3 className="text-lg font-bold text-[#F5FBFF]">
                Convertir Oportunidad en Proyecto Activo
              </h3>
            </div>

            <p className="text-xs text-[#F5FBFF]/75 mb-5 leading-relaxed">
              Esta acción marcará a <strong>{lead.fullName}</strong> en la etapa <strong>Ganado</strong>, creará una ficha de proyecto en el módulo de proyectos con hitos de ejecución y la enlazará automáticamente.
            </p>

            <form onSubmit={handleConvertToProject} className="space-y-4">
              <div>
                <label className="text-xs font-mono text-[#F5FBFF]/80 block mb-1">Nombre del Proyecto</label>
                <input
                  type="text"
                  required
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="w-full px-3 py-2 rounded bg-[#081722] border border-[#16364d] text-xs text-[#F5FBFF] outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-mono text-[#F5FBFF]/80 block mb-1">Categoría</label>
                <select
                  value={projectCategory}
                  onChange={(e) => setProjectCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded bg-[#081722] border border-[#16364d] text-xs text-[#F5FBFF] outline-none"
                >
                  <option value="Software a Medida">Software a Medida</option>
                  <option value="CRM y Gestión Operativa">CRM y Gestión Operativa</option>
                  <option value="Automatización Inteligente">Automatización Inteligente</option>
                  <option value="Optimización de Sistemas">Optimización de Sistemas</option>
                  <option value="Consultoría Tecnológica">Consultoría Tecnológica</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-mono text-[#F5FBFF]/80 block mb-1">Alcance y Objetivos</label>
                <textarea
                  rows={3}
                  value={projectDescription}
                  onChange={(e) => setProjectDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded bg-[#081722] border border-[#16364d] text-xs text-[#F5FBFF] outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowConvertModal(false)}
                  className="px-4 py-2 text-xs font-mono text-[#F5FBFF]/70 hover:text-[#F5FBFF]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={converting}
                  className="px-5 py-2.5 rounded bg-[#00E3B2] hover:bg-[#00D9F5] text-[#0B1F2D] text-xs font-bold font-mono transition-colors"
                >
                  {converting ? 'Creando Proyecto...' : 'Confirmar y Crear Proyecto'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

function MessageSquareIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}
