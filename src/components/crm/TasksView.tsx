import React, { useState } from 'react';
import { Task, TaskPriority, TaskStatus, Lead } from '../../types/index.ts';
import { api } from '../../lib/api.ts';
import { 
  CheckSquare, 
  Square, 
  Calendar, 
  AlertTriangle, 
  Plus, 
  Clock, 
  User, 
  Trash2,
  CheckCircle2,
  Filter
} from 'lucide-react';

interface TasksViewProps {
  tasks: Task[];
  leads: Lead[];
  onTaskUpdated: (task: Task) => void;
  onTaskCreated: (task: Task) => void;
  onTaskDeleted: (id: string) => void;
}

export const TasksView: React.FC<TasksViewProps> = ({
  tasks,
  leads,
  onTaskUpdated,
  onTaskCreated,
  onTaskDeleted,
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // New task form state
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDesc, setNewTaskDesc] = useState('');
  const [newTaskLeadId, setNewTaskLeadId] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<TaskPriority>('media');
  const [newTaskDueDate, setNewTaskDueDate] = useState(
    new Date(Date.now() + 86400000).toISOString().split('T')[0]
  );
  const [newTaskAssignedTo, setNewTaskAssignedTo] = useState('Director Cokito');

  const todayStr = new Date().toISOString().split('T')[0];

  const filteredTasks = tasks.filter((task) => {
    if (filterStatus === 'pending') return task.status === 'pendiente' || task.status === 'en_progreso';
    if (filterStatus === 'overdue') return task.status !== 'completada' && task.dueDate < todayStr;
    if (filterStatus === 'completed') return task.status === 'completada';
    return true;
  });

  const handleToggleTaskStatus = async (task: Task) => {
    const newStatus: TaskStatus = task.status === 'completada' ? 'pendiente' : 'completada';
    try {
      const res = await api.updateTask(task.id, { status: newStatus });
      onTaskUpdated(res.task);
    } catch (err) {
      console.error('Error toggling task:', err);
    }
  };

  const handleDeleteTask = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('¿Eliminar esta tarea?')) {
      try {
        await api.deleteTask(id);
        onTaskDeleted(id);
      } catch (err) {
        console.error('Error deleting task:', err);
      }
    }
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const matchedLead = leads.find(l => l.id === newTaskLeadId);

    try {
      const res = await api.createTask({
        title: newTaskTitle.trim(),
        description: newTaskDesc.trim() || undefined,
        leadId: newTaskLeadId || undefined,
        leadName: matchedLead ? `${matchedLead.fullName} (${matchedLead.company || 'Contacto'})` : undefined,
        priority: newTaskPriority,
        dueDate: newTaskDueDate,
        assignedTo: newTaskAssignedTo,
        status: 'pendiente',
      });

      onTaskCreated(res.task);
      setShowCreateModal(false);
      setNewTaskTitle('');
      setNewTaskDesc('');
      setNewTaskLeadId('');
    } catch (err) {
      console.error('Error creating task:', err);
    }
  };

  const priorityStyles: Record<TaskPriority, { label: string; style: string }> = {
    baja: { label: 'Baja', style: 'text-neutral-400 bg-neutral-400/10 border-neutral-400/20' },
    media: { label: 'Media', style: 'text-[#00D9F5] bg-[#00D9F5]/10 border-[#00D9F5]/30' },
    alta: { label: 'Alta', style: 'text-amber-400 bg-amber-400/10 border-amber-400/30' },
    urgente: { label: 'Urgente', style: 'text-rose-400 bg-rose-400/10 border-rose-400/30' },
  };

  const overdueCount = tasks.filter(t => t.status !== 'completada' && t.dueDate < todayStr).length;

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#F5FBFF] tracking-tight">
            Gestión Operativa de Tareas
          </h2>
          <p className="text-xs font-mono text-[#F5FBFF]/60 mt-0.5">
            Compromisos con clientes y seguimiento de entregas del laboratorio
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-md bg-[#00D9F5] hover:bg-[#00E3B2] text-[#0B1F2D] font-bold text-xs font-mono transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Nueva Tarea</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 p-1 bg-[#081722] rounded-lg border border-[#16364d] text-xs font-mono">
        {[
          { id: 'all', label: `Todas (${tasks.length})` },
          { id: 'pending', label: `Pendientes (${tasks.filter(t => t.status !== 'completada').length})` },
          { id: 'overdue', label: `Vencidas (${overdueCount})`, isAlert: overdueCount > 0 },
          { id: 'completed', label: `Completadas (${tasks.filter(t => t.status === 'completada').length})` },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilterStatus(tab.id)}
            className={`px-3 py-1.5 rounded transition-colors cursor-pointer ${
              filterStatus === tab.id
                ? 'bg-[#00D9F5] text-[#0B1F2D] font-bold'
                : tab.isAlert
                ? 'text-rose-400 hover:bg-[#143247]'
                : 'text-[#F5FBFF]/70 hover:text-[#F5FBFF] hover:bg-[#122e43]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tasks List */}
      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <div className="p-12 text-center text-xs font-mono text-[#F5FBFF]/40 border border-dashed border-[#16364d] rounded-xl bg-[#081722]">
            No hay tareas en esta categoría.
          </div>
        ) : (
          filteredTasks.map((task) => {
            const isCompleted = task.status === 'completada';
            const isOverdue = !isCompleted && task.dueDate < todayStr;
            const priorityInfo = priorityStyles[task.priority] || priorityStyles.media;

            return (
              <div
                key={task.id}
                onClick={() => handleToggleTaskStatus(task)}
                className={`p-4 rounded-xl bg-[#081722] border transition-all cursor-pointer flex items-start gap-4 group ${
                  isCompleted
                    ? 'border-[#16364d] opacity-60'
                    : isOverdue
                    ? 'border-rose-500/40 hover:border-rose-500/60'
                    : 'border-[#16364d] hover:border-[#00D9F5]/40'
                }`}
              >
                {/* Checkbox */}
                <button
                  type="button"
                  className="mt-0.5 text-[#00D9F5] group-hover:scale-110 transition-transform"
                >
                  {isCompleted ? (
                    <CheckSquare className="w-5 h-5 text-[#00E3B2]" />
                  ) : (
                    <Square className="w-5 h-5 text-[#F5FBFF]/40 group-hover:text-[#00D9F5]" />
                  )}
                </button>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded border uppercase ${priorityInfo.style}`}>
                      {priorityInfo.label}
                    </span>

                    {task.leadName && (
                      <span className="text-xs font-mono text-[#00D9F5] truncate">
                        Cliente: {task.leadName}
                      </span>
                    )}

                    {isOverdue && (
                      <span className="text-[10px] font-mono text-rose-400 bg-rose-950/60 border border-rose-500/40 px-2 py-0.5 rounded flex items-center gap-1 font-bold">
                        <AlertTriangle className="w-3 h-3" /> Vencida
                      </span>
                    )}
                  </div>

                  <h4 className={`text-sm font-bold text-[#F5FBFF] ${isCompleted ? 'line-through text-[#F5FBFF]/40' : ''}`}>
                    {task.title}
                  </h4>

                  {task.description && (
                    <p className="text-xs text-[#F5FBFF]/70 mt-1 leading-relaxed">
                      {task.description}
                    </p>
                  )}

                  <div className="flex flex-wrap items-center gap-4 mt-3 text-[11px] font-mono text-[#F5FBFF]/50">
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3 text-[#00E3B2]" />
                      <span>{task.assignedTo}</span>
                    </span>

                    <span className={`flex items-center gap-1 tabular-nums ${isOverdue ? 'text-rose-400 font-bold' : ''}`}>
                      <Calendar className="w-3 h-3" />
                      <span>Límite: {task.dueDate}</span>
                    </span>
                  </div>
                </div>

                {/* Delete button */}
                <button
                  onClick={(e) => handleDeleteTask(task.id, e)}
                  className="p-1.5 text-[#F5FBFF]/30 hover:text-rose-400 hover:bg-rose-950/40 rounded transition-colors"
                  title="Eliminar tarea"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            );
          })
        )}
      </div>

      {/* Create Task Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85">
          <div className="w-full max-w-md bg-[#0B1F2D] border border-[#00D9F5]/40 rounded-2xl p-6 shadow-2xl animate-in zoom-in-95">
            <h3 className="text-base font-bold text-[#F5FBFF] mb-4">
              Nueva Tarea de Seguimiento
            </h3>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-mono text-[#F5FBFF]/80 block mb-1">Título de la Tarea *</label>
                <input
                  type="text"
                  required
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="Ej. Enviar cotización técnica preliminar"
                  className="w-full px-3 py-2 rounded bg-[#081722] border border-[#16364d] text-xs text-[#F5FBFF] outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-mono text-[#F5FBFF]/80 block mb-1">Cliente Vinculado</label>
                <select
                  value={newTaskLeadId}
                  onChange={(e) => setNewTaskLeadId(e.target.value)}
                  className="w-full px-2 py-2 rounded bg-[#081722] border border-[#16364d] text-xs text-[#F5FBFF] font-mono"
                >
                  <option value="">(Tarea interna general / Sin cliente vinculado)</option>
                  {leads.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.fullName} {l.company ? `(${l.company})` : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-mono text-[#F5FBFF]/80 block mb-1">Prioridad</label>
                  <select
                    value={newTaskPriority}
                    onChange={(e) => setNewTaskPriority(e.target.value as TaskPriority)}
                    className="w-full px-2 py-1.5 rounded bg-[#081722] border border-[#16364d] text-xs text-[#F5FBFF] font-mono"
                  >
                    <option value="baja">Baja</option>
                    <option value="media">Media</option>
                    <option value="alta">Alta</option>
                    <option value="urgente">Urgente</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-mono text-[#F5FBFF]/80 block mb-1">Fecha Límite</label>
                  <input
                    type="date"
                    required
                    value={newTaskDueDate}
                    onChange={(e) => setNewTaskDueDate(e.target.value)}
                    className="w-full px-2 py-1.5 rounded bg-[#081722] border border-[#16364d] text-xs text-[#F5FBFF] font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-mono text-[#F5FBFF]/80 block mb-1">Responsable</label>
                <select
                  value={newTaskAssignedTo}
                  onChange={(e) => setNewTaskAssignedTo(e.target.value)}
                  className="w-full px-2 py-1.5 rounded bg-[#081722] border border-[#16364d] text-xs text-[#F5FBFF] font-mono"
                >
                  <option value="Director Cokito">Director Cokito</option>
                  <option value="Ingeniero de Sistemas">Ingeniero de Sistemas</option>
                </select>
              </div>

              <div className="pt-3 flex justify-end gap-3 border-t border-[#143247]">
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
                  Guardar Tarea
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
