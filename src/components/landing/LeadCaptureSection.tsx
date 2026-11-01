import React, { useState, useEffect } from 'react';
import { ProjectType, ContactPreference, Lead, LeadDiagnostic } from '../../types/index.ts';
import { api } from '../../lib/api.ts';
import { Language, translations } from '../../lib/i18n.ts';
import { trackSectionNavigation } from '../../lib/analytics.ts';
import { DiagnosticFlowModal } from '../diagnostic/DiagnosticFlowModal.tsx';
import { RecoverRequestModal } from '../diagnostic/RecoverRequestModal.tsx';
import { 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  ArrowRight, 
  Copy, 
  Check, 
  MessageCircle, 
  Sparkles, 
  Clock, 
  ExternalLink,
  Search,
  Code2,
  Users,
  Zap,
  Cpu,
  Compass,
  Globe,
  Lightbulb
} from 'lucide-react';

interface LeadCaptureSectionProps {
  preselectedServiceType?: ProjectType | null;
  onLeadSubmitted?: (lead: Lead) => void;
  currentLang: Language;
}

const SERVICE_AREA_OPTIONS: { 
  value: ProjectType; 
  label: string; 
  badge: string; 
  description: string;
  icon: React.ElementType;
}[] = [
  { 
    value: 'software', 
    label: 'Sistemas y software a medida', 
    badge: 'Módulo 1', 
    description: 'Plataformas web, apps móviles y portales personalizados',
    icon: Code2 
  },
  { 
    value: 'crm', 
    label: 'CRM y gestión operativa', 
    badge: 'Módulo 2', 
    description: 'Embudo de ventas, seguimiento comercial y control de tareas',
    icon: Users 
  },
  { 
    value: 'automation', 
    label: 'Automatización de procesos', 
    badge: 'Módulo 3', 
    description: 'Eliminación de tareas repetitivas y flujos automáticos',
    icon: Zap 
  },
  { 
    value: 'optimization', 
    label: 'Optimización de sistemas existentes', 
    badge: 'Módulo 4', 
    description: 'Rendimiento, estabilidad y modernización de código',
    icon: Cpu 
  },
  { 
    value: 'consulting', 
    label: 'Consultoría tecnológica', 
    badge: 'Módulo 5', 
    description: 'Decisiones de arquitectura, stack y auditoría técnica',
    icon: Compass 
  },
  { 
    value: 'landing', 
    label: 'Landing pages y plataformas de captación', 
    badge: 'Módulo 6', 
    description: 'Web corporativa, páginas de conversión y tiendas online',
    icon: Globe 
  },
  { 
    value: 'idea', 
    label: 'Tengo una idea y necesito orientación', 
    badge: 'Módulo 7', 
    description: 'Estructuración de prototipo, viabilidad y definición de MVP',
    icon: Lightbulb 
  },
];

export const LeadCaptureSection: React.FC<LeadCaptureSectionProps> = ({
  preselectedServiceType,
  onLeadSubmitted,
  currentLang,
}) => {
  const [formData, setFormData] = useState({
    fullName: '',
    company: '',
    email: '',
    phone: '',
    serviceAreas: [(preselectedServiceType || 'software') as ProjectType],
    description: '',
    contactPreference: 'email' as ContactPreference,
    dataConsent: true,
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Success state with rich metadata
  const [submissionResult, setSubmissionResult] = useState<{
    lead: Lead;
    referenceCode: string;
    diagnostic?: LeadDiagnostic;
    recoveryToken?: string;
  } | null>(null);

  // Modals state
  const [showDiagnosticModal, setShowDiagnosticModal] = useState(false);
  const [showRecoverModal, setShowRecoverModal] = useState(false);
  const [copiedRef, setCopiedRef] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const t = translations[currentLang].contact;

  useEffect(() => {
    if (preselectedServiceType) {
      setFormData(prev => ({
        ...prev,
        serviceAreas: prev.serviceAreas.includes(preselectedServiceType)
          ? prev.serviceAreas
          : [preselectedServiceType, ...prev.serviceAreas]
      }));
    }
  }, [preselectedServiceType]);

  const handleToggleArea = (area: ProjectType) => {
    setFormData(prev => {
      const exists = prev.serviceAreas.includes(area);
      let updated: ProjectType[];
      if (exists) {
        if (prev.serviceAreas.length === 1) return prev; // Keep at least one
        updated = prev.serviceAreas.filter(a => a !== area);
      } else {
        updated = [...prev.serviceAreas, area];
      }
      return { ...prev, serviceAreas: updated };
    });
  };

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

    if (formData.serviceAreas.length === 0) {
      setErrorMsg('Por favor selecciona al menos un área de especialidad o interés.');
      return;
    }

    const cleanDesc = formData.description.trim() || 'Consulta inicial desde el portal web';

    setLoading(true);

    try {
      const response = await api.submitLead({
        fullName: formData.fullName,
        company: formData.company || undefined,
        email: formData.email,
        phone: formData.phone || undefined,
        projectType: formData.serviceAreas[0] || 'software',
        serviceAreas: formData.serviceAreas,
        description: cleanDesc,
        contactPreference: formData.contactPreference,
        dataConsent: formData.dataConsent !== false,
      });

      trackSectionNavigation('/contact/success', 'lead_form_submitted');
      setSubmissionResult({
        lead: response.lead,
        referenceCode: response.referenceCode,
        diagnostic: response.diagnostic,
        recoveryToken: response.recoveryToken,
      });

      if (onLeadSubmitted) {
        onLeadSubmitted(response.lead);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Error al comunicar con el laboratorio.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSubmissionResult(null);
    setFormData({
      fullName: '',
      company: '',
      email: '',
      phone: '',
      serviceAreas: ['software'],
      description: '',
      contactPreference: 'email',
      dataConsent: true,
    });
  };

  const getRecoveryUrl = () => {
    if (!submissionResult) return '';
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    return `${origin}/#recuperar?ref=${encodeURIComponent(submissionResult.referenceCode)}${
      submissionResult.recoveryToken ? `&token=${encodeURIComponent(submissionResult.recoveryToken)}` : ''
    }`;
  };

  const handleCopyRef = () => {
    if (!submissionResult) return;
    navigator.clipboard.writeText(submissionResult.referenceCode);
    setCopiedRef(true);
    setTimeout(() => setCopiedRef(false), 2500);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(getRecoveryUrl());
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleOpenWhatsApp = () => {
    if (!submissionResult) return;
    const areas = formData.serviceAreas
      .map(a => SERVICE_AREA_OPTIONS.find(opt => opt.value === a)?.label)
      .filter(Boolean)
      .join(', ');

    const text = encodeURIComponent(
      `Hola equipo de Cokito's Lab, acabo de registrar mi solicitud formal con referencia ${submissionResult.referenceCode} a nombre de ${formData.fullName}. Áreas de interés: ${areas}. Mi preferencia de contacto es WhatsApp.`
    );
    window.open(`https://wa.me/584242636400?text=${text}`, '_blank');
  };

  return (
    <section id="contacto" className="py-14 bg-[#F5FBFF] border-t border-[#E0F2FE] relative bg-tech-grid-light">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 text-xs font-mono text-[#009bb3] uppercase tracking-wider mb-2 font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00b38c]" />
            <span>{t.tag}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B1F2D] tracking-tight mb-2">
            {t.title}
          </h2>
          <p className="text-xs sm:text-sm text-[#1E3A52] leading-relaxed">
            {t.subtitle}
          </p>
        </div>

        {/* WELCOME & DECISION SCREEN (After successful submission) */}
        {submissionResult ? (
          <div className="p-6 sm:p-9 rounded-2xl lab-card-clean bg-white border-2 border-[#00E3B2] shadow-2xl relative animate-in fade-in zoom-in-95 space-y-6">
            
            <div className="text-center space-y-2">
              <div className="w-14 h-14 rounded-full bg-[#00E3B2]/15 border-2 border-[#00E3B2] flex items-center justify-center mx-auto mb-2 text-[#00897B]">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <span className="font-mono text-xs text-[#00897B] uppercase tracking-wider font-bold block">
                Solicitud Registrada en el Laboratorio
              </span>
              <h3 className="text-2xl font-extrabold text-[#0B1F2D]">
                ¡Bienvenido a Cokito's Lab, {formData.fullName}!
              </h3>
              <p className="text-xs sm:text-sm text-[#1E3A52] max-w-lg mx-auto leading-relaxed">
                Tu solicitud ha sido ingresada con éxito a nuestro sistema central. Se ha emitido tu código oficial de seguimiento comercial:
              </p>
            </div>

            {/* Official Reference Box with Copy */}
            <div className="p-4 sm:p-5 rounded-xl bg-linear-to-r from-[#F0F9FF] to-[#E8FBF7] border border-[#00D9F5] max-w-lg mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
              <div className="text-center sm:text-left">
                <span className="text-[11px] font-mono text-[#64748B] uppercase tracking-wider block">
                  Referencia Comercial Única:
                </span>
                <span className="text-2xl sm:text-3xl font-mono font-extrabold text-[#0B1F2D] tracking-wide">
                  {submissionResult.referenceCode}
                </span>
              </div>
              <button
                type="button"
                onClick={handleCopyRef}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white hover:bg-[#EAF6FD] text-xs font-mono text-[#009bb3] font-bold border border-[#BCE4F7] transition-all cursor-pointer shadow-xs"
              >
                {copiedRef ? <Check className="w-4 h-4 text-[#00897B]" /> : <Copy className="w-4 h-4" />}
                <span>{copiedRef ? 'Copiada' : 'Copiar Código'}</span>
              </button>
            </div>

            {/* Two Clear Choices */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto pt-2">
              
              {/* Option 1: Continue Diagnostic */}
              <div className="p-5 rounded-xl border-2 border-[#00D9F5] bg-[#F0F9FF] flex flex-col justify-between space-y-4 hover:shadow-md transition-all">
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#00D9F5]/20 text-[11px] font-mono font-bold text-[#0B1F2D]">
                    <Sparkles className="w-3.5 h-3.5 text-[#009bb3]" />
                    <span>Opción Recomendada</span>
                  </div>
                  <h4 className="text-base font-extrabold text-[#0B1F2D]">
                    Continuar con el Diagnóstico
                  </h4>
                  <p className="text-xs text-[#1E3A52] leading-relaxed">
                    Es opcional y nos permitirá conocer en profundidad los requerimientos específicos de tu proyecto para formular la arquitectura y presupuesto ideal.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setShowDiagnosticModal(true)}
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-[#00D9F5] hover:bg-[#00E3B2] text-[#0B1F2D] font-mono font-bold text-xs sm:text-sm tracking-wide transition-all shadow-md cursor-pointer hover:shadow-[0_0_15px_rgba(0,217,245,0.4)]"
                >
                  <span>Iniciar Diagnóstico Guiado</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Option 2: Finish for now */}
              <div className="p-5 rounded-xl border border-[#CDE9F7] bg-white flex flex-col justify-between space-y-4 hover:border-[#00D9F5] transition-all">
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-100 text-[11px] font-mono font-semibold text-slate-700">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    <span>Contacto Tradicional</span>
                  </div>
                  <h4 className="text-base font-extrabold text-[#0B1F2D]">
                    Terminar por Ahora
                  </h4>
                  <p className="text-xs text-[#1E3A52] leading-relaxed">
                    Puedes esperar a que nuestro equipo revise tu solicitud preliminar y te contacte por {formData.contactPreference === 'whatsapp' ? 'WhatsApp' : formData.contactPreference === 'call' ? 'llamada' : 'correo electrónico'}.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleReset}
                  className="w-full py-2.5 px-4 rounded-lg bg-[#EAF6FD] hover:bg-[#D5EBF9] text-[#1E3A52] font-mono font-bold text-xs border border-[#CDE9F7] transition-all cursor-pointer text-center"
                >
                  Esperar contacto del equipo
                </button>
              </div>

            </div>

            {/* Preserving Reference Channels (WhatsApp / Private Link) */}
            <div className="max-w-xl mx-auto pt-4 border-t border-[#E0F2FE] space-y-3 text-center">
              <span className="text-xs font-mono text-[#64748B] block font-medium">
                ¿Deseas conservar tu referencia y enlace privado de recuperación?
              </span>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5">
                <button
                  type="button"
                  onClick={handleOpenWhatsApp}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-[#25D366] hover:bg-[#20BA5A] text-white font-mono font-bold text-xs transition-all shadow-xs cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Confirmar vía WhatsApp</span>
                </button>

                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-white hover:bg-[#F0F9FF] border border-[#BCE4F7] text-xs font-mono text-[#0B1F2D] font-bold transition-all cursor-pointer"
                >
                  {copiedLink ? <Check className="w-4 h-4 text-[#00897B]" /> : <Copy className="w-4 h-4 text-[#009bb3]" />}
                  <span>{copiedLink ? 'Enlace Copiado' : 'Copiar Enlace de Acceso'}</span>
                </button>
              </div>

              <p className="text-[11px] text-[#64748B] max-w-md mx-auto">
                WhatsApp abrirá una conversación con el mensaje prellenado para que tú lo confirmes y envíes. No se envían mensajes sin tu autorización.
              </p>
            </div>

          </div>
        ) : (
          /* High-Contrast Luminous Light Form */
          <div className="rounded-2xl lab-card-clean bg-white p-5 sm:p-8 shadow-xl border border-[#BCE4F7] relative">
            
            {errorMsg && (
              <div className="mb-5 p-3.5 rounded-lg bg-red-50 border border-red-300 text-red-700 text-xs flex items-center gap-2.5 font-medium animate-in fade-in">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Row 1: Nombre + Empresa */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="fullName" className="block text-xs font-mono text-[#0B1F2D] font-bold mb-1">
                    {t.nameLabel} <span className="text-[#009bb3]">*</span>
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder={t.namePlaceholder}
                    className="w-full px-3.5 py-2.5 rounded-md bg-[#F8FCFE] border border-[#CDE9F7] focus:border-[#00D9F5] focus:bg-white focus:ring-1 focus:ring-[#00D9F5] text-xs sm:text-sm text-[#0B1F2D] placeholder-[#94A3B8] outline-none transition-all font-mono"
                  />
                </div>

                <div>
                  <label htmlFor="company" className="block text-xs font-mono text-[#0B1F2D] font-bold mb-1">
                    {t.companyLabel} <span className="text-[#64748B] font-normal">(opcional)</span>
                  </label>
                  <input
                    id="company"
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder={t.companyPlaceholder}
                    className="w-full px-3.5 py-2.5 rounded-md bg-[#F8FCFE] border border-[#CDE9F7] focus:border-[#00D9F5] focus:bg-white focus:ring-1 focus:ring-[#00D9F5] text-xs sm:text-sm text-[#0B1F2D] placeholder-[#94A3B8] outline-none transition-all font-mono"
                  />
                </div>
              </div>

              {/* Row 2: Correo + Teléfono */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="email" className="block text-xs font-mono text-[#0B1F2D] font-bold mb-1">
                    {t.emailLabel} <span className="text-[#009bb3]">*</span>
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder={t.emailPlaceholder}
                    className="w-full px-3.5 py-2.5 rounded-md bg-[#F8FCFE] border border-[#CDE9F7] focus:border-[#00D9F5] focus:bg-white focus:ring-1 focus:ring-[#00D9F5] text-xs sm:text-sm text-[#0B1F2D] placeholder-[#94A3B8] outline-none transition-all font-mono"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-xs font-mono text-[#0B1F2D] font-bold mb-1">
                    {t.phoneLabel} <span className="text-[#64748B] font-normal">(WhatsApp preferido)</span>
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+58 424 000 0000"
                    className="w-full px-3.5 py-2.5 rounded-md bg-[#F8FCFE] border border-[#CDE9F7] focus:border-[#00D9F5] focus:bg-white focus:ring-1 focus:ring-[#00D9F5] text-xs sm:text-sm text-[#0B1F2D] placeholder-[#94A3B8] outline-none transition-all font-mono"
                  />
                </div>
              </div>

              {/* Row 3: 7 Áreas Especializadas (SELECCIÓN MÚLTIPLE) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-mono text-[#0B1F2D] font-bold">
                    Áreas de interés o requerimiento <span className="text-[#009bb3]">*</span>
                  </label>
                  <span className="text-[11px] font-mono text-[#009bb3]">
                    {formData.serviceAreas.length} seleccionada(s)
                  </span>
                </div>
                <p className="text-[11px] text-[#64748B] -mt-1">
                  Puedes seleccionar una o varias según el alcance de tu proyecto:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                  {SERVICE_AREA_OPTIONS.map((area) => {
                    const isSelected = formData.serviceAreas.includes(area.value);
                    const IconComponent = area.icon;

                    return (
                      <button
                        type="button"
                        key={area.value}
                        onClick={() => handleToggleArea(area.value)}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-start gap-3 ${
                          isSelected
                            ? 'bg-[#E0F8FF] border-[#00D9F5] text-[#0B1F2D] shadow-xs'
                            : 'bg-[#F8FCFE] border-[#CDE9F7] text-[#1E3A52] hover:bg-white hover:border-[#00D9F5]/60'
                        }`}
                      >
                        <div className={`p-2 rounded-lg shrink-0 ${
                          isSelected ? 'bg-[#00D9F5] text-[#0B1F2D]' : 'bg-slate-100 text-slate-500'
                        }`}>
                          <IconComponent className="w-4 h-4" />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <span className="font-mono text-xs font-bold truncate">
                              {area.label}
                            </span>
                            <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                              isSelected ? 'bg-[#00D9F5]/30 text-[#00897B] font-bold' : 'text-[#64748B]'
                            }`}>
                              {area.badge}
                            </span>
                          </div>
                          <p className="text-[11px] text-[#64748B] leading-tight mt-0.5 line-clamp-1">
                            {area.description}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Row 4: Descripción de la necesidad */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label htmlFor="description" className="block text-xs font-mono text-[#0B1F2D] font-bold">
                    {t.descLabel} <span className="text-[#009bb3]">*</span>
                  </label>
                  <span className="text-[10px] font-mono text-[#64748B]">
                    {formData.description.length} caracteres
                  </span>
                </div>
                <textarea
                  id="description"
                  required
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder={t.descPlaceholder}
                  className="w-full px-3.5 py-2.5 rounded-md bg-[#F8FCFE] border border-[#CDE9F7] focus:border-[#00D9F5] focus:bg-white focus:ring-1 focus:ring-[#00D9F5] text-xs sm:text-sm text-[#0B1F2D] placeholder-[#94A3B8] outline-none transition-all resize-y"
                />
              </div>

              {/* Row 5: Preferencia de contacto */}
              <div>
                <label className="block text-xs font-mono text-[#0B1F2D] font-bold mb-1.5">
                  {t.prefLabel}
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  {[
                    { value: 'email' as ContactPreference, label: t.prefEmail },
                    { value: 'whatsapp' as ContactPreference, label: t.prefWhatsapp },
                    { value: 'call' as ContactPreference, label: t.prefCall },
                  ].map((item) => (
                    <label
                      key={item.value}
                      className={`flex items-center justify-center p-2 rounded-md border text-xs font-mono cursor-pointer transition-all ${
                        formData.contactPreference === item.value
                          ? 'border-[#00D9F5] bg-[#E0F8FF] text-[#00897B] font-bold shadow-xs'
                          : 'border-[#CDE9F7] bg-[#F8FCFE] text-[#1E3A52] hover:border-[#00D9F5]/60 hover:bg-white'
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
                <label className="flex items-start gap-2.5 text-xs text-[#1E3A52] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.dataConsent}
                    onChange={(e) => setFormData({ ...formData, dataConsent: e.target.checked })}
                    className="mt-0.5 w-4 h-4 rounded border-[#CDE9F7] bg-white text-[#00D9F5] focus:ring-[#00D9F5]"
                  />
                  <span>{t.consentText}</span>
                </label>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-3 px-5 rounded-md bg-[#00D9F5] hover:bg-[#00E3B2] text-[#0B1F2D] font-bold text-xs sm:text-sm tracking-wide transition-all shadow-md shadow-[#00D9F5]/25 cursor-pointer disabled:opacity-50 hover:shadow-[0_0_20px_rgba(0,217,245,0.4)]"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Registrando solicitud...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>{t.submitBtn}</span>
                    </>
                  )}
                </button>
              </div>

            </form>

            {/* Recover link under form */}
            <div className="mt-6 pt-4 border-t border-[#E0F2FE] text-center">
              <button
                type="button"
                onClick={() => setShowRecoverModal(true)}
                className="text-xs font-mono text-[#009bb3] hover:text-[#0B1F2D] transition-colors inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Search className="w-3.5 h-3.5" />
                <span>¿Ya iniciaste una solicitud anteriormente? Recuperar y continuar diagnóstico</span>
              </button>
            </div>

          </div>
        )}

      </div>

      {/* Interactive Diagnostic Modal */}
      {submissionResult && (
        <DiagnosticFlowModal
          isOpen={showDiagnosticModal}
          referenceCode={submissionResult.referenceCode}
          leadId={submissionResult.lead.id}
          leadName={submissionResult.lead.fullName}
          leadEmail={submissionResult.lead.email}
          leadPhone={submissionResult.lead.phone}
          initialSelectedAreas={formData.serviceAreas}
          recoveryToken={submissionResult.recoveryToken}
          onClose={() => setShowDiagnosticModal(false)}
          onCompleted={(updatedDiag) => {
            console.log('Diagnostic successfully completed:', updatedDiag);
          }}
        />
      )}

      {/* Recover Request Modal */}
      <RecoverRequestModal
        isOpen={showRecoverModal}
        onClose={() => setShowRecoverModal(false)}
        onRecovered={(lead, diagnostic, token) => {
          setSubmissionResult({
            lead,
            referenceCode: lead.referenceCode || `CL-${new Date().getFullYear()}-00001`,
            diagnostic,
            recoveryToken: token,
          });
          setShowDiagnosticModal(true);
        }}
      />

    </section>
  );
};
