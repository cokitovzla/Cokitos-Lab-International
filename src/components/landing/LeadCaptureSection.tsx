import React, { useState, useEffect } from 'react';
import { ProjectType, ContactPreference, Lead } from '../../types/index.ts';
import { api } from '../../lib/api.ts';
import { Send, CheckCircle2, AlertCircle, Loader2, ArrowRight } from 'lucide-react';

interface LeadCaptureSectionProps {
  preselectedServiceType?: ProjectType | null;
  onLeadSubmitted?: (lead: Lead) => void;
}

export const LeadCaptureSection: React.FC<LeadCaptureSectionProps> = ({
  preselectedServiceType,
  onLeadSubmitted,
}) => {
  const [formData, setFormData] = useState({
    fullName: '',
    company: '',
    email: '',
    phone: '',
    projectType: (preselectedServiceType || 'software') as ProjectType,
    description: '',
    contactPreference: 'email' as ContactPreference,
    dataConsent: true,
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [submittedLead, setSubmittedLead] = useState<Lead | null>(null);

  useEffect(() => {
    if (preselectedServiceType) {
      setFormData(prev => ({ ...prev, projectType: preselectedServiceType }));
    }
  }, [preselectedServiceType]);

  const projectTypeOptions: { value: ProjectType; label: string }[] = [
    { value: 'software', label: 'Software a medida' },
    { value: 'crm', label: 'CRM y gestión operativa' },
    { value: 'automation', label: 'Automatización de procesos' },
    { value: 'optimization', label: 'Optimización de sistemas' },
    { value: 'consulting', label: 'Consultoría tecnológica' },
    { value: 'idea', label: 'Tengo una idea y necesito orientación' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Client-side validations
    if (!formData.fullName.trim() || formData.fullName.trim().length < 2) {
      setErrorMsg('Por favor ingresa tu nombre completo (mínimo 2 caracteres).');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email.trim())) {
      setErrorMsg('Por favor introduce una dirección de correo electrónico válida.');
      return;
    }

    if (!formData.description.trim() || formData.description.trim().length < 5) {
      setErrorMsg('Por favor describe brevemente qué problema o idea deseas resolver (mínimo 5 caracteres).');
      return;
    }

    if (!formData.dataConsent) {
      setErrorMsg('Debes aceptar el consentimiento para recibir respuesta del laboratorio.');
      return;
    }

    setLoading(true);

    try {
      const response = await api.submitLead({
        fullName: formData.fullName,
        company: formData.company || undefined,
        email: formData.email,
        phone: formData.phone || undefined,
        projectType: formData.projectType,
        description: formData.description,
        contactPreference: formData.contactPreference,
        dataConsent: formData.dataConsent,
      });

      setSubmittedLead(response.lead);
      if (onLeadSubmitted) {
        onLeadSubmitted(response.lead);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Error al conectar con el laboratorio. Inténtalo nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSubmittedLead(null);
    setFormData({
      fullName: '',
      company: '',
      email: '',
      phone: '',
      projectType: 'software',
      description: '',
      contactPreference: 'email',
      dataConsent: true,
    });
  };

  return (
    <section id="contacto" className="py-12 bg-[#081722] border-t border-[#143247] relative bg-tech-grid">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Compact Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 text-xs font-mono text-[#00D9F5] uppercase tracking-wider mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00E3B2]" />
            <span>05 · Captación & Contacto</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#F5FBFF] tracking-tight mb-2">
            Cuéntanos qué necesitas resolver.
          </h2>
          <p className="text-xs sm:text-sm text-[#F5FBFF]/75 leading-relaxed">
            No necesitas tener una solución técnica definida. Cuéntanos tu idea, necesidad o fricción operativa. En el laboratorio nos encargamos de analizarlo y diseñar el sistema adecuado.
          </p>
        </div>

        {/* Confirmation Screen */}
        {submittedLead ? (
          <div className="p-6 sm:p-8 rounded-2xl bg-[#0d2232] border border-[#00E3B2] text-center shadow-2xl relative animate-in fade-in zoom-in-95">
            <div className="w-12 h-12 rounded-full bg-[#00E3B2]/15 border border-[#00E3B2] flex items-center justify-center mx-auto mb-4 text-[#00E3B2]">
              <CheckCircle2 className="w-6 h-6" />
            </div>

            <span className="font-mono text-xs text-[#00E3B2] uppercase tracking-wider block mb-1 font-bold">
              Solicitud Registrada en el Laboratorio
            </span>

            <h3 className="text-xl sm:text-2xl font-extrabold text-[#F5FBFF] mb-2">
              ¡Mensaje recibido, {submittedLead.fullName}!
            </h3>

            <p className="text-xs sm:text-sm text-[#F5FBFF]/80 max-w-lg mx-auto mb-4 leading-relaxed">
              Hemos registrado tu requerimiento en el CRM con el identificador{' '}
              <strong className="font-mono text-[#00D9F5]">{submittedLead.id}</strong>. Nuestro equipo evaluará tu caso y se comunicará vía{' '}
              <span className="font-bold text-[#00E3B2] uppercase">{submittedLead.contactPreference}</span> en menos de 24 horas hábiles.
            </p>

            <div className="p-3.5 rounded-lg bg-[#081722] border border-[#1b3d56] max-w-md mx-auto text-left text-xs font-mono mb-6 space-y-1 text-[#F5FBFF]/75">
              <div className="flex justify-between">
                <span>Estado:</span>
                <span className="text-[#00D9F5] font-bold">Nuevo Contacto (En Cola)</span>
              </div>
              <div className="flex justify-between">
                <span>Tipo de Proyecto:</span>
                <span className="text-[#F5FBFF] capitalize">{submittedLead.projectType}</span>
              </div>
              <div className="flex justify-between">
                <span>Email de Respuesta:</span>
                <span className="text-[#F5FBFF]">{submittedLead.email}</span>
              </div>
            </div>

            <button
              onClick={handleReset}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-[#081722] hover:bg-[#112d42] border border-[#00D9F5]/40 hover:border-[#00D9F5] text-xs font-mono text-[#00D9F5] transition-all cursor-pointer"
            >
              <span>Enviar otra consulta o proyecto</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          /* High-Contrast Compact Form */
          <div className="rounded-2xl bg-[#0d2232] border border-[#1b3d56] hover:border-[#00D9F5]/60 transition-all p-5 sm:p-7 shadow-xl relative">
            
            {errorMsg && (
              <div className="mb-4 p-3 rounded-lg bg-red-950/60 border border-red-500 text-red-200 text-xs flex items-center gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Row 1: Nombre + Empresa */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="fullName" className="block text-xs font-mono text-[#F5FBFF]/80 mb-1">
                    Nombre completo <span className="text-[#00D9F5]">*</span>
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="Ej. Carlos Valero"
                    className="w-full px-3.5 py-2.5 rounded-md bg-[#081722] border border-[#1b3d56] focus:border-[#00D9F5] focus:ring-1 focus:ring-[#00D9F5] text-xs sm:text-sm text-[#F5FBFF] placeholder-[#F5FBFF]/30 outline-none transition-all font-mono"
                  />
                </div>

                <div>
                  <label htmlFor="company" className="block text-xs font-mono text-[#F5FBFF]/80 mb-1">
                    Empresa u organización <span className="text-[#F5FBFF]/40">(opcional)</span>
                  </label>
                  <input
                    id="company"
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="Ej. Distribuidora Andina"
                    className="w-full px-3.5 py-2.5 rounded-md bg-[#081722] border border-[#1b3d56] focus:border-[#00D9F5] focus:ring-1 focus:ring-[#00D9F5] text-xs sm:text-sm text-[#F5FBFF] placeholder-[#F5FBFF]/30 outline-none transition-all font-mono"
                  />
                </div>
              </div>

              {/* Row 2: Correo + Teléfono */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="email" className="block text-xs font-mono text-[#F5FBFF]/80 mb-1">
                    Correo electrónico <span className="text-[#00D9F5]">*</span>
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="carlos@empresa.com"
                    className="w-full px-3.5 py-2.5 rounded-md bg-[#081722] border border-[#1b3d56] focus:border-[#00D9F5] focus:ring-1 focus:ring-[#00D9F5] text-xs sm:text-sm text-[#F5FBFF] placeholder-[#F5FBFF]/30 outline-none transition-all font-mono"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-xs font-mono text-[#F5FBFF]/80 mb-1">
                    Teléfono / WhatsApp <span className="text-[#F5FBFF]/40">(opcional)</span>
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+58 412 123 4567"
                    className="w-full px-3.5 py-2.5 rounded-md bg-[#081722] border border-[#1b3d56] focus:border-[#00D9F5] focus:ring-1 focus:ring-[#00D9F5] text-xs sm:text-sm text-[#F5FBFF] placeholder-[#F5FBFF]/30 outline-none transition-all font-mono"
                  />
                </div>
              </div>

              {/* Row 3: Tipo de proyecto */}
              <div>
                <label htmlFor="projectType" className="block text-xs font-mono text-[#F5FBFF]/80 mb-1">
                  Tipo de proyecto o necesidad <span className="text-[#00D9F5]">*</span>
                </label>
                <select
                  id="projectType"
                  value={formData.projectType}
                  onChange={(e) => setFormData({ ...formData, projectType: e.target.value as ProjectType })}
                  className="w-full px-3.5 py-2.5 rounded-md bg-[#081722] border border-[#1b3d56] focus:border-[#00D9F5] focus:ring-1 focus:ring-[#00D9F5] text-xs sm:text-sm text-[#F5FBFF] outline-none transition-all font-mono"
                >
                  {projectTypeOptions.map((opt) => (
                    <option key={opt.value} value={opt.value} className="bg-[#0B1F2D] text-[#F5FBFF]">
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Row 4: Descripción de la necesidad */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label htmlFor="description" className="block text-xs font-mono text-[#F5FBFF]/80">
                    Descripción de la necesidad <span className="text-[#00D9F5]">*</span>
                  </label>
                  <span className="text-[10px] font-mono text-[#F5FBFF]/40">
                    {formData.description.length} caracteres
                  </span>
                </div>
                <textarea
                  id="description"
                  required
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Explícanos tu objetivo: ¿Qué proceso deseas automatizar o qué sistema te gustaría desarrollar? Puedes incluir los problemas que enfrentas hoy."
                  className="w-full px-3.5 py-2.5 rounded-md bg-[#081722] border border-[#1b3d56] focus:border-[#00D9F5] focus:ring-1 focus:ring-[#00D9F5] text-xs sm:text-sm text-[#F5FBFF] placeholder-[#F5FBFF]/30 outline-none transition-all resize-y"
                />
              </div>

              {/* Row 5: Preferencia de contacto */}
              <div>
                <label className="block text-xs font-mono text-[#F5FBFF]/80 mb-1.5">
                  Preferencia de contacto
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  {[
                    { value: 'email' as ContactPreference, label: 'Correo' },
                    { value: 'whatsapp' as ContactPreference, label: 'WhatsApp' },
                    { value: 'call' as ContactPreference, label: 'Llamada telefónica' },
                  ].map((item) => (
                    <label
                      key={item.value}
                      className={`flex items-center justify-center p-2 rounded-md border text-xs font-mono cursor-pointer transition-all ${
                        formData.contactPreference === item.value
                          ? 'border-[#00D9F5] bg-[#00D9F5]/15 text-[#00D9F5] font-bold shadow-sm'
                          : 'border-[#1b3d56] bg-[#081722] text-[#F5FBFF]/70 hover:border-[#00D9F5]/40 hover:text-[#F5FBFF]'
                      }`}
                    >
                      <input
                        type="radio"
                        name="contactPreference"
                        value={item.value}
                        checked={formData.contactPreference === item.value}
                        onChange={() => setFormData({ ...formData, contactPreference: item.value })}
                        className="sr-only"
                      />
                      <span>{item.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Row 6: Consentimiento */}
              <div className="pt-1">
                <label className="flex items-start gap-2.5 text-xs text-[#F5FBFF]/75 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.dataConsent}
                    onChange={(e) => setFormData({ ...formData, dataConsent: e.target.checked })}
                    className="mt-0.5 w-4 h-4 rounded border-[#1b3d56] bg-[#081722] text-[#00D9F5] focus:ring-[#00D9F5]"
                  />
                  <span>
                    Doy mi consentimiento para que Cokito's Lab trate mis datos exclusivamente para responder a esta solicitud y coordinar el diagnóstico inicial.
                  </span>
                </label>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-3 px-5 rounded-md bg-[#00D9F5] hover:bg-[#00E3B2] text-[#0B1F2D] font-bold text-xs sm:text-sm tracking-wide transition-all shadow-md shadow-[#00D9F5]/20 cursor-pointer disabled:opacity-50 hover:shadow-[0_0_20px_rgba(0,217,245,0.4)]"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Procesando en el laboratorio...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Enviar al laboratorio</span>
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>
        )}

      </div>
    </section>
  );
};
