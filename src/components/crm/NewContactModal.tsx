import React, { useState } from 'react';
import { ProjectType, ContactPreference, Lead, PipelineStage } from '../../types/index.ts';
import { api } from '../../lib/api.ts';
import { X, UserPlus, Loader2, AlertCircle } from 'lucide-react';

interface NewContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLeadCreated: (lead: Lead) => void;
}

export const NewContactModal: React.FC<NewContactModalProps> = ({
  isOpen,
  onClose,
  onLeadCreated,
}) => {
  if (!isOpen) return null;

  const [formData, setFormData] = useState({
    fullName: '',
    company: '',
    email: '',
    phone: '',
    projectType: 'software' as ProjectType,
    description: '',
    contactPreference: 'email' as ContactPreference,
    status: 'nuevo_contacto' as PipelineStage,
    assignedTo: 'Director Cokito',
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!formData.fullName.trim() || formData.fullName.trim().length < 2) {
      setErrorMsg('Nombre obligatorio (mínimo 2 letras).');
      return;
    }

    if (!formData.email.trim() || !formData.email.includes('@')) {
      setErrorMsg('Correo electrónico obligatorio.');
      return;
    }

    if (!formData.description.trim()) {
      setErrorMsg('Por favor incluye un resumen de la necesidad o requerimiento.');
      return;
    }

    setLoading(true);
    try {
      const res = await api.submitLead({
        fullName: formData.fullName,
        company: formData.company || undefined,
        email: formData.email,
        phone: formData.phone || undefined,
        projectType: formData.projectType,
        description: formData.description,
        contactPreference: formData.contactPreference,
        dataConsent: true,
      });

      // Update stage & assign if non-default
      let createdLead = res.lead;
      if (formData.status !== 'nuevo_contacto' || formData.assignedTo !== 'Director Cokito') {
        const updated = await api.updateLead(createdLead.id, {
          status: formData.status,
          assignedTo: formData.assignedTo,
        });
        createdLead = updated.lead;
      }

      onLeadCreated(createdLead);
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Error al crear el contacto.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-xl bg-[#0B1F2D] border border-[#00D9F5]/40 rounded-2xl p-6 sm:p-8 shadow-2xl overflow-hidden">
        
        <div className="flex items-center justify-between pb-4 border-b border-[#143247] mb-5">
          <div className="flex items-center gap-2 text-[#00D9F5]">
            <UserPlus className="w-5 h-5" />
            <h3 className="text-lg font-bold text-[#F5FBFF]">
              Registrar Nuevo Contacto en CRM
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#F5FBFF]/60 hover:text-[#F5FBFF] hover:bg-[#143247] rounded-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 rounded bg-red-950/60 border border-red-500/50 text-red-200 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-mono text-[#F5FBFF]/80 block mb-1">Nombre Completo *</label>
              <input
                type="text"
                required
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                placeholder="Ej. Sofía Ramos"
                className="w-full px-3 py-2 rounded bg-[#081722] border border-[#16364d] text-xs text-[#F5FBFF] outline-none font-mono"
              />
            </div>

            <div>
              <label className="text-xs font-mono text-[#F5FBFF]/80 block mb-1">Empresa / Negocio</label>
              <input
                type="text"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                placeholder="Ej. Inversiones Alfa"
                className="w-full px-3 py-2 rounded bg-[#081722] border border-[#16364d] text-xs text-[#F5FBFF] outline-none font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-mono text-[#F5FBFF]/80 block mb-1">Correo Electrónico *</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="sofia@empresa.com"
                className="w-full px-3 py-2 rounded bg-[#081722] border border-[#16364d] text-xs text-[#F5FBFF] outline-none font-mono"
              />
            </div>

            <div>
              <label className="text-xs font-mono text-[#F5FBFF]/80 block mb-1">Teléfono</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+58 414 000 0000"
                className="w-full px-3 py-2 rounded bg-[#081722] border border-[#16364d] text-xs text-[#F5FBFF] outline-none font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-mono text-[#F5FBFF]/80 block mb-1">Tipo de Servicio</label>
              <select
                value={formData.projectType}
                onChange={(e) => setFormData({ ...formData, projectType: e.target.value as ProjectType })}
                className="w-full px-2 py-2 rounded bg-[#081722] border border-[#16364d] text-xs text-[#F5FBFF] font-mono"
              >
                <option value="software">Software a medida</option>
                <option value="crm">CRM y gestión</option>
                <option value="automation">Automatización</option>
                <option value="optimization">Optimización</option>
                <option value="consulting">Consultoría</option>
                <option value="idea">Idea y diagnóstico</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-mono text-[#F5FBFF]/80 block mb-1">Etapa Inicial</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as PipelineStage })}
                className="w-full px-2 py-2 rounded bg-[#081722] border border-[#16364d] text-xs text-[#F5FBFF] font-mono"
              >
                <option value="nuevo_contacto">Nuevo contacto</option>
                <option value="en_evaluacion">En evaluación</option>
                <option value="contactado">Contactado</option>
                <option value="reunion_programada">Reunión programada</option>
                <option value="propuesta_enviada">Propuesta enviada</option>
                <option value="negociacion">Negociación</option>
                <option value="ganado">Ganado</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-mono text-[#F5FBFF]/80 block mb-1">Responsable</label>
              <select
                value={formData.assignedTo}
                onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                className="w-full px-2 py-2 rounded bg-[#081722] border border-[#16364d] text-xs text-[#F5FBFF] font-mono"
              >
                <option value="Director Cokito">Director Cokito</option>
                <option value="Ingeniero de Sistemas">Ingeniero de Sistemas</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-mono text-[#F5FBFF]/80 block mb-1">
              Descripción de la Necesidad / Notas Iniciales *
            </label>
            <textarea
              required
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Detalla lo conversado o solicitado por el cliente..."
              className="w-full px-3 py-2 rounded bg-[#081722] border border-[#16364d] text-xs text-[#F5FBFF] outline-none"
            />
          </div>

          <div className="pt-3 flex items-center justify-end gap-3 border-t border-[#143247]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-mono text-[#F5FBFF]/70 hover:text-[#F5FBFF]"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 rounded bg-[#00D9F5] hover:bg-[#00E3B2] text-[#0B1F2D] text-xs font-bold font-mono transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>Guardar Contacto en CRM</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
